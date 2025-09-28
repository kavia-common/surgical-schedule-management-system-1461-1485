/* no default React import needed with react-jsx */

export interface FooterBarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onPublish?: () => void;
  onHelp?: () => void;
}

/**
 * PUBLIC_INTERFACE
 * FooterBar component
 */
export default function FooterBar({ onUndo, onRedo, onSave, onPublish, onHelp }: FooterBarProps) {
  /** Footer with legend and actions */
  return (
    <footer className="footer" role="contentinfo">
      <div className="legend" aria-label="Legend">
        <span className="legend-item"><span className="legend-dot legend-blue" /> Surgeon</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#0d9488" }} /> Nurse</span>
        <span className="legend-item"><span className="legend-dot legend-amber" /> OR</span>
        <span className="legend-item"><span className="legend-dot legend-purple" /> Device</span>
        <span className="legend-item"><span className="legend-dot legend-red" /> Conflict</span>
      </div>
      <div className="footer-actions" role="toolbar" aria-label="Actions">
        <button className="btn btn-ghost" onClick={onUndo} title="Undo (Ctrl/Cmd+Z)">Undo</button>
        <button className="btn btn-ghost" onClick={onRedo} title="Redo (Shift+Ctrl/Cmd+Z)">Redo</button>
        <button className="btn btn-primary" onClick={onSave} title="Save (Ctrl/Cmd+S)">Save Changes</button>
        <button className="btn" onClick={onPublish}>Publish Day</button>
        <button className="btn" onClick={onHelp} aria-describedby="help-tip">Help</button>
        <span id="help-tip" className="visually-hidden">Keyboard: Ctrl/Cmd+S save, Ctrl/Cmd+Z undo, Shift+Ctrl/Cmd+Z redo, ? help</span>
      </div>
    </footer>
  );
}
