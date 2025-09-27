/* Right contextual panel: details and quick actions */
import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * RightPanel showing case or resource details with actions.
 */
export default function RightPanel({ selection, onResolveConflict, onAssign, onReschedule }) {
  /** Shows details of the selected entity (case/resource) */
  const [tab, setTab] = useState("overview");
  const type = selection?.type || "none";

  const title = useMemo(() => {
    if (type === "case") return selection.data?.title || "Case";
    if (type === "resource") return selection.data?.name || "Resource";
    return "Details";
  }, [type, selection]);

  return (
    <aside className="panel right" role="region" aria-labelledby="details-title">
      <div className="right-header">
        <h3 id="details-title" style={{ margin: 0 }}>{title}</h3>
        <div>
          {type === "case" && (
            <>
              <button className="btn" onClick={() => onReschedule && onReschedule(selection.data)}>Reschedule</button>
              <button className="btn" onClick={() => onAssign && onAssign(selection.data)}>Assign</button>
              <button className="btn">Print</button>
            </>
          )}
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label="Details tabs">
        {["overview","team","resources","patient","notes","history"].map((t) => (
          <button
            key={t}
            role="tab"
            className="tab"
            aria-selected={tab === t ? "true" : "false"}
            onClick={() => setTab(t)}
          >
            {label(t)}
          </button>
        ))}
      </div>
      <div className="right-body">
        {type === "none" && (
          <div className="section">
            <p>Select a case or resource to see details.</p>
          </div>
        )}
        {type === "case" && (
          <>
            <div className="section">
              <h4>Schedule</h4>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>
                {formatRange(selection.data?.start, selection.data?.end)}
              </div>
            </div>
            <div className="section">
              <h4>Assignments</h4>
              <div className="chips-row">
                {selection.data?.or && <span className="chip chip-amber">OR {selection.data.or}</span>}
                {selection.data?.surgeon && <span className="chip chip-blue">{selection.data.surgeon}</span>}
                {Array.isArray(selection.data?.nurses) && selection.data.nurses.map((n) =>
                  <span key={n} className="chip chip-teal">{n}</span>
                )}
                {Array.isArray(selection.data?.devices) && selection.data.devices.map((d) =>
                  <span key={d} className="chip chip-purple">{d}</span>
                )}
              </div>
            </div>
            {selection.data?.conflict && (
              <div className="section" aria-live="polite">
                <h4 style={{ color: "var(--color-error)" }}>Conflicts</h4>
                <p>Detected: {selection.data.conflictSummary || "Overlap"}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(selection.data.suggestions || []).map((s, i) => (
                    <button key={i} className="btn" onClick={() => onResolveConflict && onResolveConflict(selection.data, s)}>
                      Resolve: {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {type === "resource" && (
          <>
            <div className="section">
              <h4>Role</h4>
              <div>{selection.data?.role}</div>
            </div>
            <div className="section">
              <h4>Availability</h4>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>{selection.data?.availability || "08:00–16:00"}</div>
            </div>
            <div className="section">
              <button className="btn">Show on Calendar</button>
              <button className="btn">Assign to Case</button>
              <button className="btn">Message Team</button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function label(t) {
  switch (t) {
    case "overview": return "Overview";
    case "team": return "Team";
    case "resources": return "Resources";
    case "patient": return "Patient";
    case "notes": return "Notes";
    case "history": return "History";
    default: return t;
  }
}
function formatRange(a, b) {
  if (!a || !b) return "—";
  const s = new Date(a);
  const e = new Date(b);
  return `${s.toLocaleDateString()} ${s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
