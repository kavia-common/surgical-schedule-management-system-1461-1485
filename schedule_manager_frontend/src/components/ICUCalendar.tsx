/**
 * Thin TS wrapper to import the existing JS ICUCalendar implementation,
 * enabling TypeScript consumers to import "./ICUCalendar" without missing d.ts.
 */
// PUBLIC_INTERFACE
/** ICUCalendar - TS facade for the JS implementation. */
import type { FC } from "react";
import Impl from "./ICUCalendar.js";

// Explicitly type as FC to avoid TS7022 self-referential inference issues.
const ICUCalendar: FC = Impl as unknown as FC;
export default ICUCalendar;
