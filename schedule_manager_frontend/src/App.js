import React from "react";
import "./theme.css";
import "./index.css";
import ScheduleTabs from "./components/ScheduleTabs";

/**
 * PUBLIC_INTERFACE
 * App - Focused single-screen UI showing only the scheduling tabs
 * (Manage Availability and Schedule ICU) with Ocean Professional theme.
 */
function App() {
  /** Minimal shell that renders only the ScheduleTabs section */
  return (
    <div className="app-shell single">
      <main className="single-main" role="main" aria-label="Scheduling">
        <ScheduleTabs />
      </main>
    </div>
  );
}

export default App;
