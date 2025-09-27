# Surgical Schedule Manager Frontend (Ocean Professional)

Three-panel React UI for surgical scheduling with a modern, minimal design and real-time updates.

## Features
- Three-panel layout: Sidebar (filters/resources), Center (calendar with Day/Week/Month), Right (details/quick actions)
- Drag-and-drop: move events; drop resources onto calendar to assign or quick-create
- Live updates via WebSocket with status indicator
- Accessibility: ARIA roles, keyboard navigation, visible focus rings
- Ocean Professional theme: blue and amber accents, subtle shadows, rounded corners

## Getting Started
- npm install
- Copy .env.example to .env and set variables:
  - REACT_APP_API_BASE=/api
  - REACT_APP_GRAPHQL_PATH=/graphql
  - REACT_APP_WS_URL=ws://localhost:4000/ws (or as provided by backend)
- npm start

## Keyboard Shortcuts
- Ctrl/Cmd+S: Save changes
- Ctrl/Cmd+Z: Undo
- Shift+Ctrl/Cmd+Z: Redo
- ?: Help

## Structure
- src/theme.css: Theme tokens and base styles
- src/services/api.js: REST/GraphQL helpers (PUBLIC_INTERFACE)
- src/services/ws.js: WebSocket client (PUBLIC_INTERFACE)
- src/components/Sidebar.js: Filters and resource list (PUBLIC_INTERFACE)
- src/components/Calendar.js: Day/Week/Month calendar (PUBLIC_INTERFACE)
- src/components/RightPanel.js: Contextual details/actions (PUBLIC_INTERFACE)
- src/components/FooterBar.js: Legend and action bar (PUBLIC_INTERFACE)
- src/App.js: App shell and wiring

## Integration
Configure API and WS URLs via .env. The frontend expects:
- GET /api/resources
- GET /api/cases?start=ISO&end=ISO
- POST /api/cases (create), PATCH /api/cases/:id, POST /api/cases/:id/move
- POST /api/cases/:id/assign and /unassign
- WebSocket messages: { type: "case.created" | "case.updated" | "case.deleted", payload: {...} }

Replace endpoints or adapt api.js to match your backend.

## Notes
This implementation uses native HTML5 DnD and a custom calendar grid for light footprint. You can swap for FullCalendar/dnd-kit if preferred.
