import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.js";
import Calendar from "../components/Calendar.js";
import RightPanel from "../components/RightPanel.js";
import FooterBar from "../components/FooterBar";
import { api } from "../services/api";
import { connectWS, onMessage, onStatus } from "../services/ws";

/**
 * PUBLIC_INTERFACE
 * ScheduleManager - Three-panel scheduler UI (left: resources/filters, center: calendar, right: details).
 * - Drag-and-drop: drag resources from sidebar onto calendar to assign/create.
 * - Live updates: hooks to WebSocket client (simulated if backend not set).
 * - Accessibility: roles, focus management, keyboard shortcuts.
 */
export default function ScheduleManager() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [date, setDate] = useState(new Date());
  const [selection, setSelection] = useState<any>({ type: "none" });
  const [connected, setConnected] = useState(false);

  // Initialize WS client (no-op if REACT_APP_WS_URL missing)
  useEffect(() => {
    connectWS();
    const unsub1 = onStatus((ok: boolean) => setConnected(ok));
    const unsub2 = onMessage((_msg: any) => {
      // Could route to calendar updates (Calendar subscribes directly if liveEventsFeed provided)
    });
    return () => {
      unsub1 && unsub1();
      unsub2 && unsub2();
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // Save is a stub call here; replace with real batch save
        // eslint-disable-next-line no-alert
        alert("Changes saved (stub).");
      } else if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        alert("Undo (stub).");
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        alert("Redo (stub).");
      } else if (e.key === "?") {
        // eslint-disable-next-line no-alert
        alert("Shortcuts: Ctrl/Cmd+S Save · Ctrl/Cmd+Z Undo · Shift+Ctrl/Cmd+Z Redo");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Calendar live feed adapter
  const liveEventsFeed = useCallback((cb: (msg: any) => void) => {
    const unsub = onMessage(cb);
    return () => unsub && unsub();
  }, []);

  function onDropResource({ resource, start }: { resource: any; start: string }) {
    // Create a placeholder case or assign resource to an existing targeted anchor.
    // For simplicity: quick-create a case for OR/surgeon drops, else ignore.
    const payload: any = {
      title: "New Case",
      start,
      end: new Date(new Date(start).getTime() + 60 * 60000).toISOString(),
    };
    if (resource.role === "or") payload.or = resource.name;
    if (resource.role === "surgeon") payload.surgeon = resource.name;
    api.createCase(payload).catch(() => {
      // eslint-disable-next-line no-alert
      alert("Failed to create a new case.");
    });
  }

  const onSelectEvent = useCallback((ev: any) => {
    setSelection({ type: "case", data: ev });
  }, []);

  const onSelectResource = useCallback((res: any) => {
    setSelection({ type: "resource", data: res });
  }, []);

  const onResolveConflict = useCallback((_case: any, suggestion: any) => {
    // Stub: Apply move suggestion if provided
    if (suggestion?.start && suggestion?.end) {
      api.moveCase(_case.id, suggestion.start, suggestion.end).catch(() => {
        // eslint-disable-next-line no-alert
        alert("Failed to resolve conflict.");
      });
    }
  }, []);

  const onReschedule = useCallback((ev: any) => {
    // Stub: Nudge +15min
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    const ns = new Date(s.getTime() + 15 * 60000).toISOString();
    const ne = new Date(e.getTime() + 15 * 60000).toISOString();
    api.moveCase(ev.id, ns, ne).catch(() => {
      // eslint-disable-next-line no-alert
      alert("Failed to reschedule.");
    });
  }, []);

  return (
    <div className="main" role="main" aria-label="Schedule Manager">
      {/* Left */}
      <Sidebar
        onDragStartResource={() => {}}
        onSelectResource={onSelectResource}
      />

      {/* Center */}
      <section className="panel center" role="region" aria-label="Calendar">
        <div className="calendar-toolbar" style={{ justifyContent: "space-between" }}>
          <div className="segmented" role="tablist" aria-label="View toggle">
            <button role="tab" aria-selected={view === "day"} onClick={() => setView("day")}>Day</button>
            <button role="tab" aria-selected={view === "week"} onClick={() => setView("week")}>Week</button>
            <button role="tab" aria-selected={view === "month"} onClick={() => setView("month")}>Month</button>
          </div>
          <div className="date-nav">
            <button className="btn" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - (view === "month" ? 28 : view === "week" ? 7 : 1)))}>Prev</button>
            <span className="date-label">
              {view === "month"
                ? date.toLocaleString(undefined, { month: "long", year: "numeric" })
                : date.toLocaleDateString()}
            </span>
            <button className="btn" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + (view === "month" ? 28 : view === "week" ? 7 : 1)))}>Next</button>
          </div>
          <div className="live" aria-live="polite">
            <span className="live-dot" style={{ background: connected ? "var(--color-success)" : "var(--color-accent)" }} />
            Live: {connected ? "Connected" : "Connecting…"}
          </div>
        </div>

        <Calendar
          view={view}
          date={date}
          onDateChange={setDate}
          onSelectEvent={onSelectEvent}
          onDropResource={onDropResource}
          liveEventsFeed={liveEventsFeed}
        />
      </section>

      {/* Right */}
      <RightPanel
        selection={selection}
        onResolveConflict={onResolveConflict}
        onAssign={() => {}}
        onReschedule={onReschedule}
      />

      {/* Footer (full width across three columns) */}
      <div style={{ gridColumn: "1 / -1" }}>
        <FooterBar
          onUndo={() => alert("Undo (stub)")}
          onRedo={() => alert("Redo (stub)")}
          onSave={() => alert("Save (stub)")}
          onPublish={() => alert("Publish Day (stub)")}
          onHelp={() => alert("Help (stub)")}
        />
      </div>
    </div>
  );
}
