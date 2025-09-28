declare module "*.js" {
  const value: any;
  export default value;
  export = value;
}

// Explicit module declarations for JS React components used by TSX files
declare module "../components/ICUCalendar.js";
declare module "../components/ICUCalendar";
declare module "../components/NowAvailable.js";
declare module "../components/NowAvailable";
declare module "../services/api.js";
declare module "../utils/dateUtils.js";
