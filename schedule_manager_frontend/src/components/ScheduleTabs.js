import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * ScheduleTabs - provides two-tab UI: Manage Availability and Schedule ICU.
 * - Manage Availability: Doctors and ICU rooms can set availability (date, time, recurring days)
 * - Schedule ICU: Book a time slot by selecting available doctors and rooms
 */
export default function ScheduleTabs() {
  /** Main controller for the two-tab screen */
  const [activeTab, setActiveTab] = useState("availability"); // 'availability' | 'schedule'
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

      <div style={{ padding: 12, overflow: "auto" }}>
        {activeTab === "availability" ? <ManageAvailability /> : <ScheduleICU />}
      </div>
    </section>
  );
}

/**
 * ManageAvailability - form to add and list availability for doctors and ICU rooms
 * This is a frontend-only placeholder; hook to backend as needed via api service.
 */
function ManageAvailability() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // form state
  const [type, setType] = useState("doctor"); // doctor | room
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("18:00");
  const [recurring, setRecurring] = useState(false);
  const [days, setDays] = useState({ mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false });

  // load resources
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .listResources({ role: type === "doctor" ? "surgeon" : "or" })
      .then((data) => { if (!ignore) setResources(data || []); })
      .catch(() => { if (!ignore) setResources([]); })
      .finally(() => !ignore && setLoading(false));
    return () => (ignore = true);
  }, [type]);

  const dayKeys = ["mon","tue","wed","thu","fri","sat","sun"];
  const dayLabels = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

  async function saveAvailability(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Example payload; adapt to backend expectations.
      const payload = {
        resourceId,
        type,
        date: date || null,
        start,
        end,
        recurring,
        days: Object.entries(days).filter(([k, v]) => v).map(([k]) => k),
      };
      // Placeholder: call a non-existing endpoint or reuse createCase to simulate saving
      // Here we noop and show a toast-like alert for demo.
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
              onClick={(e) => { e.preventDefault(); setType("doctor"); setResourceId(""); }}
            >
              Doctor
            </button>
            <button
              role="tab"
              aria-selected={type === "room" ? "true" : "false"}
              onClick={(e) => { e.preventDefault(); setType("room"); setResourceId(""); }}
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
            onChange={(e) => setResourceId(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">{loading ? "Loading..." : "Select..."}</option>
            {(resources || []).map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
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
            onChange={(e) => setDate(e.target.value)}
            disabled={recurring}
            aria-disabled={recurring ? "true" : "false"}
            aria-description="Select a date for one-time availability; disabled when recurring is enabled."
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", gap: 8, alignItems: "center" }}>
          <label>Time Window</label>
          <input className="input" type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
          <input className="input" type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "start" }}>
          <label>Recurring</label>
          <div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
              />
              Weekly recurrence
            </label>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }} aria-label="Recurring days">
              {dayKeys.map((k) => (
                <label key={k} className="chip" style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={!!days[k]}
                    onChange={(e) => setDays((d) => ({ ...d, [k]: e.target.checked }))}
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

/**
 * ScheduleICU - form to select a date/time and book by choosing available doctor and ICU room.
 * Doctor and room dropdowns auto-populate based on availability heuristics (frontend mocked).
 */
function ScheduleICU() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:30");
  const [doctor, setDoctor] = useState("");
  const [room, setRoom] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let ignore = false;
    // Load all doctors and rooms
    Promise.all([
      api.listResources({ role: "surgeon" }).catch(() => []),
      api.listResources({ role: "or" }).catch(() => []),
    ]).then(([docs, ors]) => {
      if (ignore) return;
      setAllDoctors(docs || []);
      setAllRooms(ors || []);
    });
    return () => (ignore = true);
  }, []);

  // naive availability filter: consider status=avail as available; in real scenario, query backend by date/time
  const availableDoctors = useMemo(() => {
    return (allDoctors || []).filter((d) => (d.status || "avail") === "avail");
  }, [allDoctors]);
  const availableRooms = useMemo(() => {
    return (allRooms || []).filter((r) => (r.status || "avail") === "avail");
  }, [allRooms]);

  async function book(e) {
    e.preventDefault();
    setBooking(true);
    try {
      if (!date) {
        alert("Please choose a date.");
        return;
      }
      // Compose ISO datetimes for placeholder booking
      const startISO = combineLocalDateTime(date, start);
      const endISO = combineLocalDateTime(date, end);
      const created = await api.createCase({
        title: "ICU Booking",
        start: startISO,
        end: endISO,
        surgeon: pickNameById(allDoctors, doctor),
        or: pickNameById(allRooms, room),
      });
      alert(`Booked! Case ID: ${created?.id || "n/a"}`);
      // clear minimal
      setDoctor("");
      setRoom("");
    } catch (err) {
      alert("Booking failed");
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="section" aria-label="Schedule ICU">
      <h3 style={{ marginTop: 0 }}>Schedule ICU</h3>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Choose a date and time, then select from available doctors and ICU rooms to create a booking.
      </p>
      <form onSubmit={book} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "center" }}>
          <label htmlFor="dateInput">Date</label>
          <input id="dateInput" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", gap: 8, alignItems: "center" }}>
          <label>Time Window</label>
          <input className="input" type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
          <input className="input" type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "center" }}>
          <label htmlFor="docSel">Available Doctor</label>
          <select
            id="docSel"
            className="select"
            aria-label="Available doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            <option value="">Select doctor…</option>
            {availableDoctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: "center" }}>
          <label htmlFor="roomSel">Available ICU Room</label>
          <select
            id="roomSel"
            className="select"
            aria-label="Available ICU room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
          >
            <option value="">Select room…</option>
            {availableRooms.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={booking}>
            {booking ? "Booking..." : "Book Slot"}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => { setDoctor(""); setRoom(""); }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

/** Combine date (yyyy-mm-dd) and time (HH:mm) into local ISO string */
function combineLocalDateTime(dateStr, timeStr) {
  const [y, m, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  const [hh, mm] = timeStr.split(":").map((v) => parseInt(v, 10));
  const dt = new Date(y, (m - 1), d, hh, mm, 0, 0);
  return dt.toISOString();
}
function pickNameById(items, id) {
  const found = (items || []).find((x) => String(x.id) === String(id));
  return found ? found.name : undefined;
}
