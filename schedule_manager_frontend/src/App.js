import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./theme.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Calendar from "./components/Calendar";
import RightPanel from "./components/RightPanel";
import FooterBar from "./components/FooterBar";
import ScheduleTabs from "./components/ScheduleTabs";
import { api } from "./services/api";
import { connectWS, onMessage, onStatus } from "./services/ws";
import { addDays } from "./utils/dateUtils";

// PUBLIC_INTERFACE
function App() {
  /** Application shell: top bar, three panels, footer, and live updates */
  const [view, setView] = useState("week"); // "day" | "week" | "month"
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [liveConnected, setLiveConnected] = useState(false);

  const [selection, setSelection] = useState({ type: "none", data: null });

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        onUndo();
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        onRedo();
      } else if (e.key === "?") {
        onHelp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Live WebSocket connection
  useEffect(() => {
    connectWS();
    const offMsg = onMessage(() => {}); // Calendar subscribes with its own feed
    const offStatus = onStatus((connected) => setLiveConnected(connected));
    return () => {
      offMsg && offMsg();
      offStatus && offStatus();
    };
  }, []);

  // PUBLIC_INTERFACE
  const liveEventsFeed = useCallback((cb) => {
    /** Subscribe to all live messages and filter for case events */
    const off = onMessage((msg) => {
      if (!msg || !msg.type) return;
      if (String(msg.type).startsWith("case.")) cb(msg);
    });
    return off;
  }, []);

  // PUBLIC_INTERFACE
  const onSelectEvent = (ev) => {
    /** Select an event for details panel */
    setSelection({ type: "case", data: ev });
  };

  // PUBLIC_INTERFACE
  const onSelectResource = (r) => {
    /** Select a resource for right panel details */
    setSelection({ type: "resource", data: r });
  };

  // PUBLIC_INTERFACE
  const onDropResource = async ({ resource, start }) => {
    /** When a resource is dropped on calendar: either assign to selected case or create */
    if (selection.type === "case") {
      await api.assignResource(selection.data.id, resource.id);
      setSelection((s) => ({
        ...s,
        data: {
          ...s.data,
          // naive append for demo
          nurses: resource.role === "nurse" ? [...(s.data.nurses || []), resource.name] : s.data.nurses,
          devices: resource.role === "device" ? [...(s.data.devices || []), resource.name] : s.data.devices,
          surgeon: resource.role === "surgeon" ? resource.name : s.data.surgeon,
        },
      }));
    } else {
      // Quick create minimal case payload
      const durationMin = 90;
      const startDt = new Date(start);
      const endDt = new Date(startDt.getTime() + durationMin * 60000);
      const created = await api.createCase({
        title: "New Case",
        start: startDt.toISOString(),
        end: endDt.toISOString(),
        surgeon: resource.role === "surgeon" ? resource.name : undefined,
        nurses: resource.role === "nurse" ? [resource.name] : [],
        devices: resource.role === "device" ? [resource.name] : [],
      });
      setSelection({ type: "case", data: created });
    }
  };

  const rangeLabel = useMemo(() => {
    if (view === "day") {
      return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    }
    if (view === "week") {
      const end = addDays(date, 4);
      return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    }
    return date.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [view, date]);

  function prev() {
    setDate((d) => {
      const nd = new Date(d);
      if (view === "day") nd.setDate(nd.getDate() - 1);
      else if (view === "week") nd.setDate(nd.getDate() - 7);
      else nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  }
  function next() {
    setDate((d) => {
      const nd = new Date(d);
      if (view === "day") nd.setDate(nd.getDate() + 1);
      else if (view === "week") nd.setDate(nd.getDate() + 7);
      else nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  }
  function today() {
    setDate(new Date());
  }

  function onUndo() { /* Hook to global undo stack if available */ }
  function onRedo() { /* Hook to global redo stack if available */ }
  function onSave() { /* Persist pending changes if using local buffer */ }
  function onPublish() { /* Publish day action placeholder */ }
  function onHelp() { alert("Shortcuts:\nCtrl/Cmd+S Save\nCtrl/Cmd+Z Undo\nShift+Ctrl/Cmd+Z Redo\n? Help"); }

  return (
    <div className="app-shell">
      <header className="topbar" role="banner">
        <div className="topbar-inner">
          <div className="brand" aria-label="App title">Surgical Schedule</div>
          <div className="toolbar" role="toolbar" aria-label="Global controls">
            <div className="date-nav" role="group" aria-label="Date navigation">
              <button className="btn" onClick={prev} aria-label="Previous">‹ Prev</button>
              <button className="btn" onClick={today} aria-label="Today">Today</button>
              <button className="btn" onClick={next} aria-label="Next">Next ›</button>
            </div>
            <div className="date-label" aria-live="polite">Date Range: {rangeLabel}</div>
            <div className="segmented" role="tablist" aria-label="View">
              {["day","week","month"].map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v ? "true" : "false"}
                  onClick={() => setView(v)}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <div className="search">
              <input
                aria-label="Search"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: "inline-flex", gap: 8 }}>
              <button className="btn btn-primary">New Case +</button>
              <button className="btn">Export</button>
            </div>
          </div>
          <div className="live" aria-live="polite">
            <span className="live-dot" style={{ background: liveConnected ? "var(--color-success)" : "var(--color-accent)" }} />
            Live: {liveConnected ? "Connected" : "Reconnecting…"}
          </div>
        </div>
      </header>

      <main className="main" role="main">
        <Sidebar
          onDragStartResource={() => {}}
          onSelectResource={onSelectResource}
        />
        <ScheduleTabs />
        <RightPanel
          selection={selection}
          onAssign={(c) => setSelection({ type: "case", data: c })}
          onReschedule={(c) => setSelection({ type: "case", data: c })}
          onResolveConflict={(c, suggestion) => {
            // Placeholder: resolve action
            alert(`Resolve: ${suggestion?.label || "resolve"}`);
          }}
        />
      </main>

      <FooterBar
        onUndo={onUndo}
        onRedo={onRedo}
        onSave={onSave}
        onPublish={onPublish}
        onHelp={onHelp}
      />
    </div>
  );
}

export default App;
