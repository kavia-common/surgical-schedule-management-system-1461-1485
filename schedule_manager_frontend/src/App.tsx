import type { ReactElement } from "react";
import "./theme.css";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ScheduleTabs from "./components/ScheduleTabs";

/**
 * PUBLIC_INTERFACE
 * App - Adds routing and header with a hamburger menu.
 * Routes:
 *  - "/" renders Home (blank page with header)
 *  - "/schedule" renders the Schedule Manager (tabs UI)
 */
function App(): ReactElement {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <Routes>
          <Route
            path="/"
            element={<main className="single-main" role="main" aria-label="Home" />}
          />
          <Route
            path="/schedule"
            element={
              <main className="single-main" role="main" aria-label="Scheduling">
                <ScheduleTabs />
              </main>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
