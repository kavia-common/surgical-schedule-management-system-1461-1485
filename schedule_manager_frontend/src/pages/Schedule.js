import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Schedule - Simple page representing the schedule screen.
 * Contains an "Agree" button that navigates back to the previous screen/header.
 */
export default function Schedule() {
  const navigate = useNavigate();

  function onAgree() {
    // Navigate back to previous page; fallback to home if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <main className="single-main" role="main" aria-label="Schedule">
      <section className="panel center" role="region" aria-label="Schedule Agreement">
        <div className="calendar-toolbar" style={{ justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>Schedule</h2>
        </div>
        <div style={{ padding: 16 }}>
          <p style={{ color: "var(--muted)" }}>
            This is the Schedule screen. Please review and press Agree to return.
          </p>
          <button className="btn btn-primary" onClick={onAgree} aria-label="Agree and go back">
            Agree
          </button>
        </div>
      </section>
    </main>
  );
}
