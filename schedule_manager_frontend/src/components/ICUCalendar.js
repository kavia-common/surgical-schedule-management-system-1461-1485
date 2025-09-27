import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * ICUCalendar - A week-view calendar for ICU scheduling with single-cell selection and a booking modal.
 * - Renders a 7-day time grid (hour rows).
 * - Clicking a cell opens a modal to create a booking (select OR, Doctor, and patient details).
 * - Follows Ocean Professional theme and extracted style guide.
 */
export default function ICUCalendar() {
  /** Calendar state and interaction logic */
  const [current, setCurrent] = useState(getStartOfWeek(new Date())); // Monday of current week
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // selection: one cell at a time
  const [selection, setSelection] = useState(null); // { date: Date, hour: number, minute: number }

  // modal form state
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // booking fields
  const [form, setForm] = useState({
    date: "",
    start: "09:00",
    end: "10:00",
    roomId: "",
    doctorId: "",
    patientName: "",
    patientId: "",
    status: "Upcoming",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  // Load resources and cases
  useEffect(() => {
    let ignore = false;
    Promise.all([
      api.listResources({ role: "or" }).catch(() => []),
      api.listResources({ role: "surgeon" }).catch(() => []),
    ]).then(([ors, docs]) => {
      if (ignore) return;
      setRooms(ors || []);
      setDoctors(docs || []);
    });
    return () => (ignore = true);
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const start = new Date(current);
    const end = new Date(current);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    api
      .listCases({ start: start.toISOString(), end: end.toISOString() })
      .then((data) => {
        if (!ignore) setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => !ignore && setEvents([]))
      .finally(() => !ignore && setLoading(false));
    return () => (ignore = true);
  }, [current]);

  // columns (Mon..Sun)
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(current, i));
  }, [current]);

  // header label (month/year of week range)
  const monthLabel = useMemo(() => {
    const end = addDays(current, 6);
    const sameMonth = current.getMonth() === end.getMonth();
    if (sameMonth) {
      return `${current.toLocaleString(undefined, { month: "long" })} ${current.getFullYear()}`;
    }
    return `${current.toLocaleString(undefined, { month: "short" })}–${end.toLocaleString(undefined, { month: "short", year: "numeric" })}`;
  }, [current]);

  function prevWeek() {
    setCurrent((d) => addDays(d, -7));
  }
  function nextWeek() {
    setCurrent((d) => addDays(d, 7));
  }
  function thisWeek() {
    setCurrent(getStartOfWeek(new Date()));
  }

  function onCellClick(day, hour, minute) {
    // set single selection and open dialog
    const selDate = new Date(day);
    selDate.setHours(hour, minute, 0, 0);
    setSelection({ date: selDate, hour, minute });
    setForm((f) => ({
      ...f,
      date: toLocalDate(selDate),
      start: toLocalTime(selDate),
      end: toLocalTime(addMinutes(selDate, 60)),
    }));
    setShowModal(true);
  }

  async function onSaveBooking(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Required validation
      if (!form.roomId || !form.doctorId || !form.patientName) {
        alert("Please fill in Operating Room, Doctor, and Patient Name.");
        return;
      }
      const startISO = combineLocalDateTime(form.date, form.start);
      const endISO = combineLocalDateTime(form.date, form.end);
      const payload = {
        title: "ICU Booking",
        start: startISO,
        end: endISO,
        or: pickNameById(rooms, form.roomId),
        surgeon: pickNameById(doctors, form.doctorId),
        patient: form.patientName,
        patientId: form.patientId || undefined,
        notes: form.notes || undefined,
        status: form.status,
      };
      const created = await api.createCase(payload);
      setEvents((cur) => [created, ...cur]);
      setShowModal(false);
      setSelection(null);
    } catch (err) {
      alert("Failed to save booking");
    } finally {
      setSaving(false);
    }
  }

  // Map clicks to minutes
  const hourRowHeight = 56; // per style guide
  const pxPerMin = hourRowHeight / 60; // ~0.933 px/min for 56/hour

  function computeTop(dt) {
    const mins = dt.getHours() * 60 + dt.getMinutes();
    return Math.round(mins * pxPerMin);
  }
  function computeHeight(start, end) {
    const minutes = Math.max(30, Math.round((end - start) / 60000));
    return Math.round(minutes * pxPerMin);
  }

  const gridRef = useRef(null);

  return (
    <div className="icu-scheduler">
      <header className="icu-header" role="toolbar" aria-label="ICU calendar header">
        <button className="nav-btn" aria-label="Previous week" title="Previous week">‹</button>
        <h1 className="icu-title" aria-live="polite">{monthLabel}</h1>
        <div className="icu-header-actions">
          <button className="nav-btn" aria-label="Next week" title="Next week" onClick={nextWeek}>›</button>
          <button className="btn btn-ghost" onClick={thisWeek} style={{ marginLeft: 8 }}>This Week</button>
        </div>
      </header>

      <main className="icu-board" role="region" aria-label="ICU scheduling calendar">
        {/* Column headers (time axis + 7 days) */}
        <div className="icu-columns-header">
          <div className="axis-blank" aria-hidden="true" />
          {days.map((d, idx) => (
            <div key={idx} className="day-head" aria-label={d.toDateString()}>
              <div className="day-head-inner">
                <span className="weekday">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
                <span className="daynum">{d.getDate()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <section className="icu-time-grid" aria-busy={loading ? "true" : "false"} role="grid">
          <aside className="icu-time-axis" aria-hidden="false">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="icu-hour-label">{formatHourLabel(h)}</div>
            ))}
          </aside>

          <div className="icu-grid-scroll" ref={gridRef}>
            <div className="icu-grid-canvas" style={{ height: `${hourRowHeight * 24}px` }}>
              {/* 7 day columns */}
              {days.map((d, idx) => (
                <DayColumn
                  key={idx}
                  date={d}
                  hourRowHeight={hourRowHeight}
                  onCellClick={onCellClick}
                />
              ))}

              {/* Events layer */}
              <div className="icu-events-layer" aria-hidden="false">
                {events.map((ev) => {
                  const sd = new Date(ev.start);
                  const ed = new Date(ev.end);
                  const dayIdx = dayIndexFromDate(sd, current);
                  if (dayIdx < 0 || dayIdx > 6) return null;
                  const top = computeTop(sd);
                  const height = computeHeight(sd, ed);
                  const leftPct = 3;
                  const rightPct = 3;
                  return (
                    <article
                      key={ev.id}
                      className={`icu-event-card ${statusClass(ev.status)}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Booking: ${ev.status || "Scheduled"} on ${sd.toDateString()} ${formatTime(sd)}–${formatTime(ed)}${ev.surgeon ? ` with ${ev.surgeon}` : ""}${ev.or ? `, OR ${ev.or}` : ""}`}
                      style={{
                        gridColumn: dayIdx + 1,
                        top,
                        height,
                        left: `${leftPct}%`,
                        right: `${rightPct}%`,
                      }}
                      onClick={() => {
                        // Future: open edit dialog. For now, no-op.
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // Future: open edit dialog
                        }
                      }}
                    >
                      <span className="rail" aria-hidden="true" />
                      <div className="card-body">
                        <div className="card-title">{labelStatus(ev.status)}</div>
                        <div className="card-sub">
                          {ev.or ? <span className="pill pill-amber">OR {ev.or}</span> : null}
                          {ev.surgeon ? <span className="pill pill-blue">{ev.surgeon}</span> : null}
                          {ev.patient ? <span className="pill">{ev.patient}</span> : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Booking modal */}
      {showModal && (
        <Modal onClose={() => { setShowModal(false); setSelection(null); }}>
          <form onSubmit={onSaveBooking} className="icu-dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
            <header className="icu-dialog-header">
              <h2 id="dlg-title">Book ICU Slot</h2>
            </header>
            <div className="icu-dialog-body">
              <div className="row two">
                <label className="fld">
                  <span className="lbl">Date</span>
                  <input
                    className="input"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    required
                  />
                </label>
                <label className="fld">
                  <span className="lbl">Operating Room</span>
                  <select
                    className="select"
                    value={form.roomId}
                    onChange={(e) => setForm((f) => ({ ...f, roomId: e.target.value }))}
                    required
                  >
                    <option value="">Select OR…</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="row two">
                <label className="fld">
                  <span className="lbl">Start</span>
                  <input
                    className="input"
                    type="time"
                    step="300"
                    value={form.start}
                    onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
                    required
                  />
                </label>
                <label className="fld">
                  <span className="lbl">End</span>
                  <input
                    className="input"
                    type="time"
                    step="300"
                    value={form.end}
                    onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
                    required
                  />
                </label>
              </div>

              <div className="row two">
                <label className="fld">
                  <span className="lbl">Doctor</span>
                  <select
                    className="select"
                    value={form.doctorId}
                    onChange={(e) => setForm((f) => ({ ...f, doctorId: e.target.value }))}
                    required
                  >
                    <option value="">Select doctor…</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </label>
                <label className="fld">
                  <span className="lbl">Patient Name</span>
                  <input
                    className="input"
                    type="text"
                    placeholder="Full name"
                    value={form.patientName}
                    onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                    required
                  />
                </label>
              </div>

              <div className="row two">
                <label className="fld">
                  <span className="lbl">Patient ID/MRN</span>
                  <input
                    className="input"
                    type="text"
                    placeholder="Optional"
                    value={form.patientId}
                    onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                  />
                </label>
                <label className="fld">
                  <span className="lbl">Status</span>
                  <select
                    className="select"
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option>Upcoming</option>
                    <option>Running</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </label>
              </div>

              <label className="fld">
                <span className="lbl">Notes</span>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Additional notes…"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </label>
            </div>
            <div className="icu-dialog-actions">
              <button type="button" className="btn" onClick={() => { setShowModal(false); setSelection(null); }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save Booking"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/** DayColumn renders hourly rows; each row has two 30-min cells for precise selection */
function DayColumn({ date, hourRowHeight, onCellClick }) {
  const hours = Array.from({ length: 24 }, (_, h) => h);
  return (
    <div className="icu-day-col" role="gridcell" aria-label={date.toDateString()}>
      {hours.map((h) => (
        <div key={h} className="icu-hour-row" style={{ height: hourRowHeight }}>
          <button
            className="icu-cell"
            onClick={() => onCellClick(date, h, 0)}
            aria-label={`${date.toDateString()}, ${formatHourLabel(h)} start`}
            title="Click to book"
          />
          <button
            className="icu-cell half"
            onClick={() => onCellClick(date, h, 30)}
            aria-label={`${date.toDateString()}, ${formatHourLabel(h)}:30 start`}
            title="Click to book"
          />
        </div>
      ))}
    </div>
  );
}

/** Simple centered modal with backdrop and focus trap */
function Modal({ children, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose && onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.activeElement;
    // focus first focusable in dialog after mount
    setTimeout(() => {
      const el = ref.current?.querySelector("input, select, textarea, button");
      el && el.focus();
    }, 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      try { prev && prev.focus && prev.focus(); } catch {}
    };
  }, [onClose]);

  return (
    <div className="icu-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="icu-dialog-wrap"
        role="document"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* Utilities */

function getStartOfWeek(date) {
  const d = new Date(date);
  const dow = (d.getDay() + 6) % 7; // Monday=0
  d.setDate(d.getDate() - dow);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(d, n) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}
function addMinutes(d, n) {
  const nd = new Date(d);
  nd.setMinutes(nd.getMinutes() + n);
  return nd;
}
function dayIndexFromDate(d, weekStart) {
  const diff = Math.floor((stripTime(d) - stripTime(weekStart)) / 86400000);
  return diff;
}
function stripTime(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function formatHourLabel(h) {
  const ampm = h < 12 ? "am" : "pm";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${ampm}`;
}
function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function toLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function toLocalTime(d) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function combineLocalDateTime(dateStr, timeStr) {
  const [y, m, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  const [hh, mm] = timeStr.split(":").map((v) => parseInt(v, 10));
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return dt.toISOString();
}
function pickNameById(items, id) {
  const found = (items || []).find((x) => String(x.id) === String(id));
  return found ? found.name : undefined;
}
function statusClass(s) {
  if (!s) return "status-default";
  const key = String(s).toLowerCase();
  if (key.startsWith("run")) return "status-running";
  if (key.startsWith("comp")) return "status-completed";
  if (key.startsWith("canc")) return "status-cancelled";
  return "status-upcoming";
}
function labelStatus(s) {
  if (!s) return "Scheduled";
  return s;
}
