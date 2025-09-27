import React from "react";
import "./theme.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Calendar from "./components/Calendar";
import RightPanel from "./components/RightPanel";

/**
 * PUBLIC_INTERFACE
 * App - Classic three-panel layout: Sidebar (left), Calendar (center), RightPanel (right)
 * Restores the prior application shell structure before modernization.
 */
function App() {
  const [selection, setSelection] = React.useState(null);

  // Placeholder handlers to connect components in classic shell
  const handleSelectEvent = (ev) => setSelection({ type: "case", data: ev });
  const handleSelectResource = (res) => setSelection({ type: "resource", data: res });

  // Dummy calendar props for initial render
  const today = new Date();

  return (
    <div className="app-shell classic">
      <header className="topbar" role="banner" aria-label="Surgical Schedule">
        <div className="topbar-inner">
          <h1 className="app-title">Surgical Schedule</h1>
          <div className="toolbar" role="toolbar" aria-label="Global actions">
            <button className="btn">New Case</button>
            <button className="btn">Export</button>
          </div>
        </div>
      </header>
      <div className="main" role="main" aria-label="Main content">
        <Sidebar onDragStartResource={() => {}} onSelectResource={handleSelectResource} />
        <Calendar
          view="week"
          date={today}
          onDateChange={() => {}}
          onSelectEvent={handleSelectEvent}
          onDropResource={() => {}}
          liveEventsFeed={null}
        />
        <RightPanel
          selection={selection}
          onResolveConflict={() => {}}
          onAssign={() => {}}
          onReschedule={() => {}}
        />
      </div>
      <footer className="footer classic-footer" role="contentinfo">
        <div className="legend">
          <span className="legend-item"><span className="legend-dot legend-blue" /> Surgeon</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: "#0d9488" }} /> Nurse</span>
          <span className="legend-item"><span className="legend-dot legend-amber" /> OR</span>
          <span className="legend-item"><span className="legend-dot legend-purple" /> Device</span>
          <span className="legend-item"><span className="legend-dot legend-red" /> Conflict</span>
        </div>
        <div className="footer-actions" role="toolbar" aria-label="Actions">
          <button className="btn btn-ghost">Undo</button>
          <button className="btn btn-ghost">Redo</button>
          <button className="btn btn-primary">Save Changes</button>
          <button className="btn">Publish Day</button>
          <button className="btn">Help</button>
        </div>
      </footer>
    </div>
  );
}

export default App;
