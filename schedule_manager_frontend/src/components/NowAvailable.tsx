/**
 * Thin TS wrapper to import the existing JS NowAvailable implementation,
 * enabling TypeScript consumers to import "./NowAvailable" without missing d.ts.
 */
import Impl from "./NowAvailable.js";
export default Impl as any;
