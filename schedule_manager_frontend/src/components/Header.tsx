import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Header - Top bar with hamburger menu. Clicking opens a left drawer with 'Home' and 'Schedule Manager'.
 */
export default function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const nav = useNavigate();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click or Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (drawerRef.current && target && !drawerRef.current.contains(target) && target !== buttonRef.current) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function navigateTo(path: string) {
    setOpen(false);
    nav(path);
  }

  return (
    <header className="topbar" role="banner">
      <div className="topbar-inner">
        <div className="brand" aria-label="Application title">Surgical Schedule</div>

        <div className="toolbar" role="toolbar" aria-label="Global actions">
          <div>
            <button
              ref={buttonRef}
              className="btn"
              aria-haspopup="dialog"
              aria-expanded={open ? "true" : "false"}
              aria-controls="app-drawer"
              aria-label="Open navigation menu"
              onClick={() => setOpen((s) => !s)}
            >
              <i className="bi bi-list menu-icon" aria-hidden="true" />
              <span className="visually-hidden">Menu</span>
            </button>
          </div>

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
        </div>
      </div>

      {/* Left Drawer */}
      <div
        id="app-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="false"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          inset: "0 0 0 0",
          pointerEvents: open ? "auto" : "none",
          zIndex: 30,
        }}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: open ? "rgba(17,24,39,0.4)" : "transparent",
            transition: "background .2s ease",
          }}
        />
        {/* Panel */}
        <nav
          role="navigation"
          aria-label="Primary"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 280,
            height: "100%",
            background: "#fff",
            borderRight: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            transform: open ? "translateX(0)" : "translateX(-105%)",
            transition: "transform .2s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: 12, borderBottom: "1px solid var(--border)", fontWeight: 700 }}>
            Navigation
          </div>
          <button
            className="btn"
            style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, textAlign: "left" }}
            onClick={() => navigateTo("/")}
          >
            Home
          </button>
          <button
            className="btn"
            style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, textAlign: "left" }}
            onClick={() => navigateTo("/schedule")}
          >
            Schedule Manager
          </button>
        </nav>
      </div>
    </header>
  );
}
