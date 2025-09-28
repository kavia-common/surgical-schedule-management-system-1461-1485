/**
 * Thin TS wrapper to import the existing JS NowAvailable implementation,
 * enabling TypeScript consumers to import "./NowAvailable" without missing d.ts.
 */
// PUBLIC_INTERFACE
/** NowAvailable - TS facade for the JS implementation. */
import type { FC } from "react";
import Impl from "./NowAvailable.js";

// Explicitly type as FC to avoid TS7022 self-referential inference issues.
const NowAvailable: FC = Impl as unknown as FC;
export default NowAvailable;
