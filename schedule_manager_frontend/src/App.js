import React from "react";
import "./theme.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ScheduleTabs from "./components/ScheduleTabs";
import Schedule from "./pages/Schedule";

/**
 * PUBLIC_INTERFACE
 * App - Adds routing and header with a hamburger menu.
 * Routes:
 *  - "/" renders the main Scheduling tabs
 *  - "/schedule" renders the Schedule screen
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <main className="single-main" role="main" aria-label="Scheduling">
                <ScheduleTabs />
              </main>
            }
          />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
