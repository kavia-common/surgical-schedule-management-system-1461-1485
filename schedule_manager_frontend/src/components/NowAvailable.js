import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * NowAvailable - Displays doctors and ICU rooms currently available at the present time.
 * - Pulls resources via api.listResources
 * - Filters by role (surgeon for doctors, or for ICU rooms) and status (avail)
 * - Auto-refreshes every 60s and when minute ticks over
 */
export default function NowAvailable({ placement = "above" }) {
  /**
   * Fetch current availability snapshots and refresh every minute.
   * Backend integration: expects api.listResources to return items with shape:
   *   { id, name, role: "surgeon"|"or"|..., status: "avail"|"busy"|..., meta? }
   * In absence of a backend, the mock should return similar.
   */
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [timestamp, setTimestamp] = useState(new Date());

  // Tick every 60s to refresh "current" time and re-fetch availability
  useEffect(() => {
    const id = setInterval(() => setTimestamp(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [docList, roomList] = await Promise.all([
        api.listResources({ role: "surgeon" }).catch(() => []),
        api.listResources({ role: "or" }).catch(() => []),
      ]);
      // Filter by status avail
      setDoctors((docList || []).filter((r) => (r.status || "avail") === "avail"));
      setRooms((roomList || []).filter((r) => (r.status || "avail") === "avail"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    (async () => {
      await load();
    })();
    return () => {
      ignore = true;
    };
    // Re-run when minute changes (timestamp state updates every minute)
  }, [timestamp]);

  const timeLabel = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [timestamp]
  );

  return (
    <section
      className="now-available"
      role="region"
      aria-label="Now Available: Doctors and ICU Rooms"
    >
      <header className="now-header">
        <div className="now-title">
          <span className="now-dot" aria-hidden="true" />
          <span className="now-text" style={{ fontSize: 16 }}>Now Available</span>
        </div>
        <div className="now-meta" aria-live="polite">
          as of {timeLabel} {loading ? "• Updating…" : ""}
        </div>
      </header>

      <div className="now-body">
        <div className="now-group" aria-label="Available Doctors">
          <div className="now-group-title">
            <span className="legend-dot legend-blue" aria-hidden="true" /> Doctors
          </div>
          <div className="now-chips" role="list">
            {(doctors || []).slice(0, 12).map((d) => (
              <span key={d.id} className="chip chip-blue" role="listitem" title={d.meta || ""}>
                {d.name}
              </span>
            ))}
            {!loading && (doctors || []).length === 0 && (
              <span className="now-empty">None</span>
            )}
          </div>
        </div>

        <div className="now-group" aria-label="Available ICU Rooms">
          <div className="now-group-title">
            <span className="legend-dot legend-amber" aria-hidden="true" /> ICU Rooms
          </div>
          <div className="now-chips" role="list">
            {(rooms || []).slice(0, 12).map((r) => (
              <span key={r.id} className="chip chip-amber" role="listitem" title={r.meta || ""}>
                {r.name}
              </span>
            ))}
            {!loading && (rooms || []).length === 0 && (
              <span className="now-empty">None</span>
            )}
          </div>
        </div>
      </div>

      <div className="visually-hidden" aria-live="polite">
        Now Available updated at {timeLabel}.
      </div>
    </section>
  );
}
