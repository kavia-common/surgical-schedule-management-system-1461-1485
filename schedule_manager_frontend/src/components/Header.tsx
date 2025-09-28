import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Header - Minimal top bar with a hamburger menu. Contains a 'Schedule' item that navigates to /schedule.
 */
export default function Header() {
  /** Minimal header with menu */
  const [open, setOpen] = useState<boolean>(false);
  const nav = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on outside click or Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function goSchedule() {
    setOpen(false);
    nav("/schedule");
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar-inner">
        <div className="brand">Surgical Schedule</div>
        <div className="toolbar">
          <div className="segmented" aria-hidden="true">
            <button aria-selected="true">Week</button>
            <button aria-selected="false">Day</button>
            <button aria-selected="false">Month</button>
          </div>
          <div className="date-nav" aria-hidden="true">
            <button className="btn">Prev</button>
            <span className="date-label">This Week</span>
            <button className="btn">Next</button>
          </div>
          <div className="search" aria-hidden="true">
            <input className="input" placeholder="Search…" />
          </div>
          <div className="live" aria-hidden="true">
            <span className="live-dot" /> Live
          </div>

          {/* Hamburger menu */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              className="btn"
              aria-haspopup="menu"
              aria-expanded={open ? "true" : "false"}
              aria-label="Open menu"
              onClick={() => setOpen((s) => !s)}
            >
              {/* simple list icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"></path>
              </svg>
            </button>
            {open && (
              <div
                role="menu"
                aria-label="Main menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 6,
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  boxShadow: "var(--shadow-md)",
                  minWidth: 160,
                  zIndex: 20,
                  overflow: "hidden",
                }}
              >
                <button
                  role="menuitem"
                  className="btn"
                  style={{ display: "block", width: "100%", textAlign: "left", border: 0, borderRadius: 0 }}
                  onClick={goSchedule}
                >
                  Schedule
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
