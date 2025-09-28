import * as React from "react";
import { useEffect, useState } from "react";
import ICUCalendar from "./ICUCalendar";
import NowAvailable from "./NowAvailable";
import { api } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * ScheduleTabs - provides two-tab UI: Manage Availability and Schedule ICU.
 * - Manage Availability: shows NowAvailable list and a form to set availability
 * - Schedule ICU: Weekly calendar for booking
 */
export default function ScheduleTabs() {
  const [activeTab, setActiveTab] = useState<"availability" | "schedule">("availability");
  return (
    <section className="panel center" role="region" aria-label="Scheduling">
      <div className="calendar-toolbar" style={{ justifyContent: "space-between" }}>
        <div className="segmented" role="tablist" aria-label="Scheduler tabs">
          <button
            role="tab"
            aria-selected={activeTab === "availability" ? "true" : "false"}
            onClick={() => setActiveTab("availability")}
          >
            Manage Availability
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "schedule" ? "true" : "false"}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule ICU
          </button>
        </div>
      </div>

      <div style={{ padding: 0, overflow: "hidden" }}>
        {activeTab === "availability" ? (
          <div>
            <NowAvailable />
            <ManageAvailability />
          </div>
        ) : (
          <ICUCalendar />
        )}
      </div>
    </section>
  );
}

/**
 * ManageAvailability - simple form to configure availability.
 */
function ManageAvailability() {
  const [resources, setResources] = useState<Array<{ id: string | number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [type, setType] = useState<"doctor" | "room">("doctor");
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("18:00");
  const [recurring, setRecurring] = useState(false);
  const [days, setDays] = useState<Record<string, boolean>>({
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false
  });

  // Load resources whenever type changes
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    api
      .listResources({ role: type === "doctor" ? "surgeon" : "or" })
      .then((data: any[]) => {
        if (!ignore) setResources(data || []);
      })
      .catch(() => {
        if (!ignore) setResources([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [type]);

  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const dayLabels: Record<string, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

  async function saveAvailability(e: SubmitEvent | Event) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        resourceId,
        type,
        date: date || null,
        start,
        end,
        recurring,
        days: Object.entries(days).filter(([_, v]) => v).map(([k]) => k),
      };
      console.log("Availability payload", payload);
      alert("Availability saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section" aria-label="Manage Availability">
      <h3 style={{ marginTop: 0 }}>Manage Availability</h3>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Set availability for doctors and ICU rooms. Choose a specific date and time, or create a recurring weekly schedule.
      </p>
      <form onSubmit={saveAvailability} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "center" }}>
          <label>Type</label>
          <div className="segmented" role="tablist" aria-label="Availability type">
            <button
              role="tab"
              aria-selected={type === "doctor" ? "true" : "false"}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); setType("doctor"); setResourceId(""); }}
            >
              Doctor
            </button>
            <button
              role="tab"
              aria-selected={type === "room" ? "true" : "false"}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); setType("room"); setResourceId(""); }}
            >
              ICU Room
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "center" }}>
          <label htmlFor="resourceSel">{type === "doctor" ? "Doctor" : "ICU Room"}</label>
          <select
            id="resourceSel"
            className="select"
            aria-label="Resource"
            value={resourceId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setResourceId(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">{loading ? "Loading..." : "Select..."}</option>
            {(resources || []).map((r) => (
              <option key={String(r.id)} value={String(r.id)}>{r.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "center" }}>
          <label htmlFor="dateSel">Date</label>
          <input
            id="dateSel"
            className="input"
            type="date"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            disabled={recurring}
            aria-disabled={recurring ? "true" : "false"}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", gap: 8, alignItems: "center" }}>
          <label>Time Window</label>
          <input className="input" type="time" value={start} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStart(e.target.value)} required />
          <input className="input" type="time" value={end} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)} required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "start" }}>
          <label>Recurring</label>
          <div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecurring(e.target.checked)}
              />
              Weekly recurrence
            </label>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }} aria-label="Recurring days">
              {dayKeys.map((k) => (
                <label key={k} className="chip" style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={!!days[k]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDays((d) => ({ ...d, [k]: e.target.checked }))}
                    disabled={!recurring}
                    aria-disabled={!recurring ? "true" : "false"}
                    style={{ marginRight: 6 }}
                  />
                  {dayLabels[k]}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Availability"}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setResourceId("");
              setDate("");
              setStart("08:00");
              setEnd("18:00");
              setRecurring(false);
              setDays({ mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false });
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
