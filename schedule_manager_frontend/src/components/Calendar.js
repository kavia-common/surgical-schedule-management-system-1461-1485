/* Calendar center panel: day/week/month with drag-and-drop and keyboard nav */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../services/api";
import { addDays, minutesBetween, setTime, startOfWeek } from "../utils/dateUtils";

/**
 * PUBLIC_INTERFACE
 * Calendar component with Week/Day/Month views and DnD
 */
export default function Calendar({
  view,
  date,
  onDateChange,
  onSelectEvent,
  onDropResource,
  liveEventsFeed,
}) {
  /** Center panel with events */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load events for current range
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const start = view === "month"
      ? new Date(date.getFullYear(), date.getMonth(), 1)
      : startOfWeek(date);
    const end = view === "month"
      ? new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
      : addDays(start, view === "day" ? 1 : 7);

    api
      .listCases({ start: start.toISOString(), end: end.toISOString() })
      .then((data) => {
        if (!ignore) setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => !ignore && setEvents([]))
      .finally(() => !ignore && setLoading(false));
    return () => (ignore = true);
  }, [view, date]);

  // listen for live updates
  useEffect(() => {
    if (!liveEventsFeed) return;
    const unsub = liveEventsFeed((msg) => {
      if (msg.type === "case.updated") {
        setEvents((cur) => {
          const idx = cur.findIndex((e) => e.id === msg.payload.id);
          if (idx >= 0) {
            const newArr = [...cur];
            newArr[idx] = { ...newArr[idx], ...msg.payload };
            return newArr;
          }
          return cur;
        });
      } else if (msg.type === "case.created") {
        setEvents((cur) => [msg.payload, ...cur]);
      } else if (msg.type === "case.deleted") {
        setEvents((cur) => cur.filter((e) => e.id !== msg.payload.id));
      }
    });
    return () => unsub && unsub();
  }, [liveEventsFeed]);

  if (view === "month") {
    return (
      <section className="panel center" role="region" aria-label="Month calendar">
        <div className="calendar-toolbar">
          <span style={{ fontWeight: 700, fontSize: 18 }}>{date.toLocaleString(undefined, { month: "long", year: "numeric" })}</span>
        </div>
        <div className="calendar" role="grid" aria-busy={loading ? "true" : "false"}>
          <MonthGrid date={date} onDateChange={onDateChange} events={events} />
        </div>
      </section>
    );
  }

  return (
    <section className="panel center" role="region" aria-label={`${view} calendar`}>
      <div className="calendar-toolbar">
        <span className="chip">Snap: 15m</span>
      </div>
      <TimeGrid
        view={view}
        date={date}
        events={events}
        loading={loading}
        onSelectEvent={onSelectEvent}
        onDropResource={onDropResource}
        onMoveEvent={async (id, start, end) => {
          await api.moveCase(id, start, end);
          setEvents((cur) =>
            cur.map((e) => (e.id === id ? { ...e, start, end } : e))
          );
        }}
      />
    </section>
  );
}

function MonthGrid({ date, onDateChange, events }) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // Monday start
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function countFor(day) {
    if (!day) return 0;
    const target = new Date(date.getFullYear(), date.getMonth(), day);
    const start = setTime(target, 0, 0).toISOString();
    const end = setTime(target, 23, 59).toISOString();
    return events.filter((e) => e.start >= start && e.start <= end).length;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, padding: 12 }}>
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
        <div key={d} style={{ fontWeight: 600, color: "var(--muted)" }}>{d}</div>
      ))}
      {cells.map((day, idx) => {
        const cnt = countFor(day);
        const hasConflict = false; // placeholder
        return (
          <button
            key={idx}
            className="btn"
            style={{ textAlign: "left", minHeight: 80 }}
            onClick={() => day && onDateChange(new Date(date.getFullYear(), date.getMonth(), day))}
            aria-label={day ? `Day ${day}, ${cnt} cases` : "Empty"}
          >
            <div style={{ fontWeight: 700 }}>{day || ""}</div>
            {!!day && (
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {cnt} cases {hasConflict ? "⚠" : ""}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function TimeGrid({ view, date, events, loading, onSelectEvent, onDropResource, onMoveEvent }) {
  const containerRef = useRef(null);

  // Grid config
  const dayCount = view === "day" ? 1 : 5;
  const start = startOfWeek(date);
  const hours = Array.from({ length: 12 }, (_, i) => 7 + i); // 7:00 - 19:00
  const pxPerMin = 2; // 30 min = 60px
  const dayHeight = (minutes) => minutes * pxPerMin;

  const dayCols = useMemo(() => {
    return Array.from({ length: dayCount }, (_, i) => addDays(start, i));
  }, [start, dayCount]);

  // Drag over empty slot to create or assign
  const onDragOver = (e) => {
    if (e.dataTransfer.types.includes("application/resource") || e.dataTransfer.types.includes("application/event")) {
      e.preventDefault();
    }
  };

  const onDrop = (e, dayIdx) => {
    e.preventDefault();
    const bounds = containerRef.current.getBoundingClientRect();
    const y = e.clientY - bounds.top - 32; // header approx
    const minutesFromStart = Math.max(0, Math.round(y / pxPerMin));
    const startTime = setTime(dayCols[dayIdx], 7, 0); // grid starts 7:00
    startTime.setMinutes(startTime.getMinutes() + minutesFromStart);
    const resourceJson = e.dataTransfer.getData("application/resource");
    const eventJson = e.dataTransfer.getData("application/event");

    if (resourceJson && onDropResource) {
      const res = JSON.parse(resourceJson);
      onDropResource({ resource: res, start: startTime.toISOString() });
    } else if (eventJson) {
      const ev = JSON.parse(eventJson);
      const duration = minutesBetween(new Date(ev.start), new Date(ev.end));
      const newStart = startTime.toISOString();
      const newEnd = new Date(startTime.getTime() + duration * 60000).toISOString();
      onMoveEvent(ev.id, newStart, newEnd);
    }
  };

  return (
    <div
      ref={containerRef}
      className="calendar"
      role="grid"
      aria-rowcount={hours.length}
      aria-colcount={dayCount}
      aria-busy={loading ? "true" : "false"}
      onDragOver={onDragOver}
    >
      <div className="timegrid" onDrop={(e) => e.preventDefault()}>
        <div className="hours" role="rowheader" aria-hidden="true">
          {hours.map((h) => (
            <div key={h} className="hour">{`${String(h).padStart(2, "0")}:00`}</div>
          ))}
        </div>
        <div className="columns">
          <div className="day-columns">
            {dayCols.map((d, idx) => (
              <div
                key={idx}
                className="day-col"
                role="gridcell"
                aria-colindex={idx + 1}
                onDrop={(e) => onDrop(e, idx)}
              >
                {/* Horizontal guides */}
                {hours.map((h, i) => (
                  <div
                    key={i}
                    className="gridline"
                    style={{ top: dayHeight((h - 7) * 60) }}
                    aria-hidden="true"
                  />
                ))}
                {/* Events positioned absolutely */}
                {events
                  .filter((e) => sameDay(new Date(e.start), d))
                  .map((ev) => (
                    <EventBlock
                      key={ev.id}
                      event={ev}
                      pxPerMin={pxPerMin}
                      gridStartHour={7}
                      onSelect={() => onSelectEvent && onSelectEvent(ev)}
                      onDrag={(data) => {
                        // Provide DnD data
                        data.setData("application/event", JSON.stringify(ev));
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventBlock({ event, pxPerMin, gridStartHour, onSelect, onDrag }) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const top = ((start.getHours() - gridStartHour) * 60 + start.getMinutes()) * pxPerMin;
  const height = Math.max(32, (end - start) / 60000 * pxPerMin);
  const conflict = !!event.conflict;

  return (
    <div
      className={`event ${conflict ? "conflict" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${event.title}, ${formatTime(start)} to ${formatTime(end)}${conflict ? ", conflict" : ""}`}
      style={{ top, height }}
      draggable
      onDragStart={(e) => onDrag && onDrag(e.dataTransfer)}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter" && onSelect) onSelect(); }}
    >
      <span className="event-left-stripe" aria-hidden="true" />
      <div className="event-header">
        <span>{event.title || "Case"}</span>
        {conflict && <span className="badge">⚠ Conflict</span>}
      </div>
      <div className="event-body">
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {formatTime(start)} - {formatTime(end)}
        </div>
        <div className="chips-row">
          {event.or && <span className="chip chip-amber">OR {event.or}</span>}
          {event.surgeon && <span className="chip chip-blue">{event.surgeon}</span>}
          {Array.isArray(event.nurses) && event.nurses.map((n) => (
            <span key={n} className="chip chip-teal">{n}</span>
          ))}
          {Array.isArray(event.devices) && event.devices.map((d) => (
            <span key={d} className="chip chip-purple">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
