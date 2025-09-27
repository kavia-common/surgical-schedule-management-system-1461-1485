import React, { useState } from "react";
import "./theme.css";
import "./index.css";
import ScheduleTabs from "./components/ScheduleTabs";
import Login from "./components/Login";
import "./components/Login.css";

/**
 * PUBLIC_INTERFACE
 * App - entry shell. Shows Login first, then the scheduling UI after success.
 * Ocean Professional theme is applied globally.
 */
function App() {
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return (
      <div className="app-shell single">
        <main className="single-main" role="main" aria-label="Login">
          <Login onSuccess={() => setAuthed(true)} />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell single">
      <main className="single-main" role="main" aria-label="Scheduling">
        <ScheduleTabs />
      </main>
    </div>
  );
}

export default App;
