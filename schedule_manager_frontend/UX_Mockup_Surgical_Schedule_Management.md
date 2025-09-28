# Surgical Schedule Management System – UX Wireframe and UI Specification (Ocean Professional)

This document presents a markdown-based wireframe (textual mockup) and UI specification for the Surgical Schedule Management System front-end. It follows the three-panel layout and the Ocean Professional style guide with accessibility and responsiveness notes. Styling is implemented with SCSS (see src/styles/theme.scss).

Color Palette (Ocean Professional)
- Primary: #2563EB (Ocean Blue)
- Secondary/Accent: #F59E0B (Amber)
- Success: #10B981 (Emerald; used for “available” indicators)
- Error: #EF4444 (Red; conflicts/errors)
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827
- Gradient: from-blue-500/10 to-gray-50 (subtle background sections)

Typography and Spacing
- Headings: Clean sans-serif, 600/700 weight, 1.25–1.6 line-height
- Body: Sans-serif 400–500 weight, 1.45–1.6 line-height
- Corner radius: 10–14px
- Shadows: Subtle (e.g., 0 1px 2px rgba(0,0,0,0.06), hover 0 4px 12px rgba(0,0,0,0.08))
- Focus ring: 2px solid #2563EB (primary) or #F59E0B on critical CTAs, offset ring on dark elements

Accessibility
- High contrast text/icons on surfaces
- Visible focus rings for all interactive elements
- Keyboard navigable: Tab order: Top bar → Left filters → Resource list → Calendar → Right panel → Footer
- ARIA labels/roles for landmarks and widgets (sidebar, tablist, grid, toolbar, dialog)
- Color never the only signal (use icons and text)
- Reduced motion preference respected for transitions

Global Layout Overview
- Top Navigation/Toolbar (sticky)
  - App title, date range selector, view toggle (Day/Week/Month), search, global actions (New Case, Export, Settings)
- Main Content (Three panels)
  - Left: Resource & Filters Sidebar
  - Center: Schedule Calendar (Day/Week/Month)
  - Right: Contextual Details & Quick Actions
- Footer: Legend and action bar

Responsive Behavior
- >1280px (Desktop): Three panels visible
- 768–1280px (Tablet): Right panel collapsible to drawer; calendar and left sidebar remain
- <768px (Mobile): Single-column with tabbed sections (Resources | Calendar | Details); footer condenses to icon-only with tooltips

------------------------------------------------------------
1) Application Shell (Top Bar + Three Panels + Footer)
------------------------------------------------------------

[Top Bar]
+-------------------------------------------------------------------------------------------+
| Surgical Schedule (Ocean Professional)                                    (User/Settings) |
| [< Prev] [Today] [Next >]  |  Date Range: [Mon, Mar 10 – Sun, Mar 16]  |  View: (Day|Week|Month) |
| [Search 🔎____________________]  [New Case +]  [Export]  [Live: ● Connected]               |
+-------------------------------------------------------------------------------------------+

- Design:
  - Background: white surface with subtle shadow
  - Buttons: Primary (blue) for New Case; secondary/ghost for export; small green dot for Live status
  - Keyboard: View toggle as radio group with arrow key navigation
  - Focus: 2px blue focus ring on all actionable controls

[Main Content – Three Panel Grid]
+-----------+----------------------------------------+------------------------+
|           |                                        |                        |
|  LEFT     |              CENTER: CALENDAR          |    RIGHT: DETAILS      |
|  SIDEBAR  |              (Week View example)       |    & ACTIONS           |
|           |                                        |                        |
+-----------+----------------------------------------+------------------------+

[Footer]
+-------------------------------------------------------------------------------------------+
| Legend: • Surgeon (blue) • Nurse (teal) • OR (amber) • Device (purple) • Conflict (red)  |
| [Undo] [Redo] [Save Changes] [Publish Day] [Help]                                         |
+-------------------------------------------------------------------------------------------+

- Footer design:
  - Background: gradient from-blue-500/10 to-gray-50
  - Buttons: Save Changes (primary), Publish Day (secondary), Undo/Redo (ghost)
  - Icons + text, with tooltip for each
  - Keyboard: Footer buttons reachable after panels; shortcuts displayed in Help

------------------------------------------------------------
2) Left Panel: Resource List and Filters
------------------------------------------------------------

[Left Sidebar]
+-------------------------------------------+
| Filters                                   |
| [Role] (All | Surgeon | Nurse | Anesth...)|
| [Specialty] [▼]                           |
| [OR Room] [▼]                             |
| [Device Type] [▼]                         |
| [Status] (Available | Busy | Offline)     |
| [Time Window] (08:00 – 18:00)             |
| [Apply Filters] (Primary)                 |
| [Clear All] (Ghost)                       |
+-------------------------------------------+
| Resources                                 |
| 🔵 Dr. Alice Kim (Ortho)            •Avail |
| 🔵 Dr. Ben Ortiz (Cardio)           •Avail |
| 🟢 Nurse: C. Lopez                  •Avail |
| 🟡 OR-02 (Hybrid)                   •InUse |
| 🟣 C-Arm #4                          •OK    |
| 🔴 Perfusion Pump #2                 •Down  |
| ...                                       |
+-------------------------------------------+

- Status dots:
  - Available: green •
  - Busy/In use: amber •
  - Down/Offline: red •
  - OK/Standby: purple •
- Interactions:
  - Search within resources (inline search field above list)
  - Select resources to highlight availability on calendar
  - Draggable resources (drag surgeon/nurse/device onto a calendar slot to add/assign to a case)
- Accessibility:
  - Resource list is a listbox with ARIA-activedescendant for keyboard navigation
  - Each item has role="option", status text appended, not color-only
  - Focus outline visible; Enter to open resource details in right panel

------------------------------------------------------------
3) Center Panel: Calendar (Day/Week/Month)
------------------------------------------------------------

[Week View – Time Grid]
+-------------------------------------------------------------------------------------------+
| Time     Mon 3/10         Tue 3/11         Wed 3/12         Thu 3/13         Fri 3/14    |
| 07:00  |                |                |                |                |            |
| 08:00  | [Case A]       | [Case D]       |                | [Case F]       | [Case H]   |
|        | OR-02          | OR-01          |                | OR-03          | OR-02      |
|        | Dr. Kim        | Dr. Ortiz      |                | Dr. Wu         | Dr. Patel  |
|        | Nurse Lopez    | Nurse Stone    |                | Nurse Lee      | Nurse Park |
|        | Dev: C-Arm #4  | Dev: Robot #2  |                | Dev: US #1     | Dev: C-Arm |
|        | ⚠ Conflict     |                |                |                |            |
| 09:00  |                |                | [Case E]       |                |            |
| ...    |                |                |                |                |            |
+-------------------------------------------------------------------------------------------+

- Event Colors and Badges:
  - Case block: blue header; amber stripe on left (OR)
  - Assigned staff chips: small rounded pills inside event
  - Devices: purple chip
  - Conflict badge: red outline + ⚠ text badge; not color-only signal
- Interactions:
  - Drag-and-drop: Move case to different time/day; stretch to change duration
  - Drag resources from left into event to assign; from event to remove
  - Hover: Tooltip with case details; click: opens details in right panel
  - Keyboard:
    - Arrow keys to move focus across grid cells
    - Space/Enter on focused slot: open “Create Case” quick dialog
    - With event focused: arrow to nudge time (Alt+Arrow = 5-min, Shift+Arrow=15-min); Enter to open details
  - Snap to 5/10/15 min grid (config), with live alignment guides
- Conflict Detection:
  - Real-time validation via WebSocket; conflicts highlighted immediately
  - Toast non-blocking messages + right panel shows conflict details and suggested resolutions
- Zoom/Views:
  - Day View: single day column with denser grid lines
  - Month View: blocks with daily case counts; click day opens partial overlay to list day’s cases
  - Week View: default, shows OR lanes (optional toggle: Group by OR vs Group by Surgeon)

[Month View – High-Level]
+-------------------------------------------------------------------------------------------+
| March 2025                                                                               |
| Su   Mo   Tu   We   Th   Fr   Sa                                                         |
|      1    2    3    4    5    6                                                         |
| 7    8    9    10   11   12   13                                                        |
| ...                                                                                    ...|
| [3 cases]  [2 cases]  [0]  [5 cases ⚠] ...                                              |
+-------------------------------------------------------------------------------------------+

- Clicking a cell opens a side preview (right panel) and focuses calendar to that date
- Color chips summarize categories (surgeon/OR/device-heavy)

------------------------------------------------------------
4) Right Panel: Contextual Details and Quick Actions
------------------------------------------------------------

[Case Details Panel]
+-------------------------------------------+
| Case A – ACL Reconstruction               |
| Status: Scheduled • 08:00–10:30           |
| OR: OR-02 (Amber)                         |
| Surgeon: Dr. Alice Kim (Blue)             |
| Anesth: Dr. I. Chen (Teal)                |
| Nurses: C. Lopez, M. Stone                |
| Devices: C-Arm #4                         |
| Patient: John Doe (M, 44)                 |
| Prep: Completed | Labs: OK                |
| Conflicts: ⚠ Device overlap with Case D   |
|                                           |
| [Reschedule] [Assign Staff] [Assign Dev]  |
| [Checklists] [Pre-Op Notes] [Print]       |
+-------------------------------------------+

- Tabs within details (sticky tablist):
  - Overview | Team | Resources | Patient | Notes | History
- Actions:
  - Reschedule: Opens time picker + calendar overlay; keyboard friendly
  - Assign Staff/Device: Opens searchable list with filters; multi-select with role grouping
  - Checklists: Expandable accordions
- Conflict Resolution:
  - Shows conflicts for overlapping staff/devices/rooms; suggests alternative time slots or resources; single-click “Resolve by moving to 10:45”
- Activity Log:
  - Shows timeline of changes; each entry has timestamp, user, change summary

[Resource Details Panel]
+-------------------------------------------+
| Resource: Dr. Alice Kim                   |
| Role: Surgeon | Specialty: Ortho          |
| Availability: 08:00–16:00                 |
| Booked: 08:00–10:30, 13:00–15:00          |
| Notes: ...                                |
|                                           |
| [Show on Calendar] [Assign to Case]       |
| [Message Team]                             |
+-------------------------------------------+

- When a resource is selected, the center calendar highlights availability ranges

[Quick Create Panel]
+-------------------------------------------+
| Create Case                               |
| Procedure: [Search CPT / common]          |
| Duration: [ 90 min ]                      |
| Preferred OR: [ OR-02 ]                   |
| Surgeon: [ Dr. ... ]                      |
| Nurses: [ ... ]                           |
| Devices: [ ... ]                          |
| Patient: [ ... ]                          |
| Start: [ 08:00 ]  Date: [ 3/10/2025 ]     |
| [Create & Place] [Cancel]                 |
+-------------------------------------------+

- “Create & Place” places case on calendar with temporary “pending” styling (dashed border) until saved

------------------------------------------------------------
5) Footer: Legend and Action Buttons
------------------------------------------------------------

[Footer]
+-------------------------------------------------------------------------------------------+
| Legend:                                              Actions:                              |
| • Surgeon (blue)   • Nurse (teal)   • OR (amber)     [Undo] [Redo] [Save Changes] [Publish]|
| • Device (purple)  • Conflict (red)                  [Help]                                |
+-------------------------------------------------------------------------------------------+

- Tooltips define each legend item
- Keyboard shortcuts:
  - Ctrl/Cmd+S: Save Changes
  - Ctrl/Cmd+Z: Undo, Shift+Ctrl/Cmd+Z: Redo
  - ?: Open Help/Shortcuts

------------------------------------------------------------
6) Interactive Elements and Behaviors (Detailed)
------------------------------------------------------------

- Drag-and-drop:
  - From Left to Center: Assign resource to case or create new case by dropping onto empty time slot
  - Within Center: Move case in time/day; stretch to adjust duration
  - From Center to Right: Drag case onto action targets (e.g., quick “Assign Staff” action dropzone)
  - Visual cues: Shadow lift, blue outline on valid targets, red dashed outline on invalid targets
- Selection and Editing:
  - Single-click event: Opens Right Panel with details, focuses first action
  - Double-click empty slot: Quick Create Case panel
  - Context menu (right-click or keyboard Menu key) on event: Edit, Duplicate, Split, Cancel
- Real-time updates:
  - Websocket status in top bar (Live: • Connected). When disconnected, show amber dot and a retry button
  - Conflict notifications as non-blocking banners; details anchor into Right Panel
- Bulk operations:
  - Multi-select events with Shift/Ctrl+Click (or keyboard) for moving groups of cases
  - Alignment rules preserve staff/device constraints; conflicts summarized in Right Panel

------------------------------------------------------------
7) Responsiveness Blueprints
------------------------------------------------------------

- Desktop
  - Fixed left width: 320–360px; right width: 360–420px; center flexible
  - Time grid density: 15-min lines; event min height ~32px
- Tablet
  - Right panel collapsible via chevron; opens as drawer over calendar
  - Filters collapse into accordions; chips for active filters
- Mobile
  - Top bar compresses into two rows; action buttons as icons
  - Three main sections as tabs: Resources | Calendar | Details
  - Quick actions appear as bottom sheet; large touch targets (44px min)
  - Drag-and-drop replaced with “Assign” modal + up/down time steppers

------------------------------------------------------------
8) Accessibility Notes (Implementation-Oriented)
------------------------------------------------------------

- Landmarks: <header>, <nav>, <main>, <aside>, <footer>
- ARIA:
  - Left sidebar: role="complementary" with labelledby Filters
  - Calendar grid: role="grid", gridcell for time slots; aria-selected for focused cell
  - View toggle: role="tablist" with tabs Day/Week/Month
  - Right panel: region with labelledby (Case Details)
  - Live region for toast/conflict: aria-live="polite"
- Focus management:
  - Open/close panels restore focus
  - Dialogs trap focus; Esc closes
- Color contrast:
  - Ensure text on blue/amber meets WCAG AA; use 700 weight on small blue text on white
- Motion:
  - Respect prefers-reduced-motion; use opacity and simple elevation changes rather than complex transforms

------------------------------------------------------------
9) Sample Micro-Flows
------------------------------------------------------------

A) Create and Place a New Case
1. Click “New Case +” or double-click empty calendar slot.
2. Quick Create panel opens on right; focus in Procedure field.
3. Fill fields (keyboard-friendly), set start time/date.
4. Click “Create & Place”: provisional case appears on calendar (dashed border).
5. Assign staff/devices by dragging from left or using Assign dialogs.
6. Click “Save Changes” in footer. Success toast; provisional styling removed.

B) Resolve a Device Conflict
1. Conflict badge appears on Case A (red outline + ⚠).
2. Click event → Right panel highlights “Conflicts” section.
3. Choose suggestion “Move to 10:45” or “Use C-Arm #3”.
4. Preview overlay shows impact; confirm.
5. Calendar updates in real-time; conflict cleared; log entry recorded.

C) Switch Views and Navigate Dates
1. Use View toggle: Week → Day.
2. Keyboard: Arrow keys navigate hours; PageUp/PageDown switch days; Home/End jump to first/last slot.
3. Use “Today” to return to current date; announcement in live region.

------------------------------------------------------------
10) Component Tokens and Design Mapping (for implementation)
------------------------------------------------------------

- Tokens (CSS variables suggestion)
  - --color-primary: #2563EB
  - --color-accent: #F59E0B
  - --color-success: #10B981
  - --color-error: #EF4444
  - --color-bg: #f9fafb
  - --color-surface: #ffffff
  - --color-text: #111827
  - --radius-md: 12px
  - --shadow-sm: 0 1px 2px rgba(0,0,0,0.06)
  - --shadow-md: 0 4px 12px rgba(0,0,0,0.08)
  - --focus-ring: 0 0 0 2px #2563EB

- Key Components
  - TopBar: AppTitle, DateNavigator, ViewToggle, Search, GlobalActions, LiveStatus
  - Sidebar: FiltersPanel, ResourceSearch, ResourceList (draggable items with status)
  - Calendar: ViewTabs, TimeGrid, EventBlock (chips, badges), Tooltip, ContextMenu
  - RightPanel: DetailsTabs, ActionsToolbar, ConflictResolver, ActivityLog
  - Footer: Legend, ActionBar, HelpDialog
  - Overlays: QuickCreateDialog, AssignDialog, ConfirmationModals, Toasts

This wireframe and specification should guide implementation of the three-panel layout with the Ocean Professional theme, ensuring accessibility and responsive behavior while supporting drag-and-drop, conflict management, and real-time updates.
