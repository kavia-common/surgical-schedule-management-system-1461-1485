/**
 * Thin TS wrapper to import the existing JS ICUCalendar implementation,
 * enabling TypeScript consumers to import "./ICUCalendar" without missing d.ts.
 */
import Impl from "./ICUCalendar.js";
export default Impl as any;
