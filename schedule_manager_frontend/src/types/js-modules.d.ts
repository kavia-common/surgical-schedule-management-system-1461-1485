declare module "*.js" {
  const value: any;
  export default value;
  export = value;
}

// Explicit module declarations for JS React components and services used by TSX files
declare module "../components/ICUCalendar.js";
declare module "../components/ICUCalendar";
declare module "../components/NowAvailable.js";
declare module "../components/NowAvailable";

// For api service, provide declarations for both with-extension and bare import paths
declare module "../services/api.js";
declare module "../services/api";

// Utils
declare module "../utils/dateUtils.js";
declare module "../utils/dateUtils";
