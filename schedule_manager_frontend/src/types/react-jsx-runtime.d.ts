/* Temporary shim for the new JSX runtime types without installing @types/react.
   Replace with @types/react in a proper TS setup. */
declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
