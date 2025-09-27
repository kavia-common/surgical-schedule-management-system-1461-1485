/* Sidebar: Filters + Resource List, with ARIA and basic drag handle */
import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

/**
 * PUBLIC_INTERFACE
 * Sidebar component with filters and resource list.
 */
export default function Sidebar({ onDragStartResource, onSelectResource }) {
  /** Left panel with filters and draggable resources */
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    q: "",
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // load resources
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .listResources({ role: filters.role === "all" ? "" : filters.role, q: filters.q })
      .then((data) => {
        if (!ignore) setResources(data || []);
      })
      .catch(() => {
        if (!ignore) setResources([]);
      })
      .finally(() => !ignore && setLoading(false));
    return () => (ignore = true);
  }, [filters.role, filters.q]);

  const filtered = useMemo(() => {
    if (filters.status === "all") return resources;
    return (resources || []).filter((r) => (r.status || "avail") === filters.status);
  }, [resources, filters.status]);

  const onDragStart = (ev, res) => {
    ev.dataTransfer.setData("application/resource", JSON.stringify(res));
    if (onDragStartResource) onDragStartResource(res);
  };

  return (
    <aside className="panel left" role="complementary" aria-labelledby="filters-heading">
      <div className="sidebar-header">
        <h3 id="filters-heading" style={{ margin: 0 }}>Filters</h3>
      </div>
      <div className="filters">
        <div className="row">
          <select
            aria-label="Role filter"
            className="select"
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="all">All Roles</option>
            <option value="surgeon">Surgeon</option>
            <option value="nurse">Nurse</option>
            <option value="anesth">Anesthesiologist</option>
            <option value="or">OR Room</option>
            <option value="device">Device</option>
          </select>
          <select
            aria-label="Status filter"
            className="select"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="avail">Available</option>
            <option value="busy">Busy</option>
            <option value="standby">OK/Standby</option>
            <option value="down">Down/Offline</option>
          </select>
        </div>
        <div className="resource-search">
          <input
            aria-label="Search resources"
            className="input"
            value={filters.q}
            placeholder="Search resources..."
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />
        </div>
        <div className="chips" aria-label="Active filters">
          {filters.role !== "all" && <span className="chip">{filters.role}</span>}
          {filters.status !== "all" && <span className="chip">{filters.status}</span>}
          {filters.q && <span className="chip">“{filters.q}”</span>}
        </div>
      </div>

      <div
        className="resource-list"
        role="listbox"
        aria-label="Resource list"
        aria-busy={loading ? "true" : "false"}
      >
        {(filtered || []).map((r) => (
          <div
            key={r.id}
            className="resource-item"
            role="option"
            tabIndex={0}
            draggable
            onDragStart={(e) => onDragStart(e, r)}
            onClick={() => onSelectResource && onSelectResource(r)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSelectResource) onSelectResource(r);
            }}
            aria-label={`${r.name}, ${r.role}. Status: ${statusLabel(r.status)}`}
            title="Drag to calendar to assign"
          >
            <span className={`status-dot ${statusClass(r.status)}`} aria-hidden="true" />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.meta || ""}</div>
            </div>
            <span className="role-pill">{roleLabel(r.role)}</span>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>
            No resources found.
          </div>
        )}
      </div>
    </aside>
  );
}

function roleLabel(role) {
  switch (role) {
    case "surgeon": return "Surgeon";
    case "nurse": return "Nurse";
    case "anesth": return "Anesth";
    case "or": return "OR";
    case "device": return "Device";
    default: return "Unknown";
  }
}
function statusClass(status) {
  switch (status) {
    case "avail": return "status-avail";
    case "busy": return "status-busy";
    case "down": return "status-down";
    default: return "status-standby";
  }
}
function statusLabel(status) {
  switch (status) {
    case "avail": return "Available";
    case "busy": return "Busy";
    case "down": return "Down/Offline";
    default: return "OK/Standby";
  }
}
