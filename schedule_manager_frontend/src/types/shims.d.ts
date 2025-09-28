/* Minimal ambient type shims to allow CRA to compile .tsx without @types in CI.
   Replace with proper @types/react, @types/react-dom, @types/react-router-dom in real setup. */
declare module "react" {
  // Core React types
  export type ReactNode = any;
  export type ReactElement = any;

  // PUBLIC_INTERFACE
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactElement | null;
  }

  // Commonly used runtime exports
  export const Fragment: any;
  // PUBLIC_INTERFACE
  export const StrictMode: any;

  // Factory + hooks (very loose typing to satisfy TS without @types)
  export function createElement(...args: any[]): any;
  export function useState<T = any>(init?: T): [T, (v: T | ((p: T) => T)) => void];
  export function useEffect(cb: () => void | (() => void), deps?: any[]): void;
  export function useRef<T = any>(v?: T): { current: T };

  // PUBLIC_INTERFACE
  // Minimal event types used in codebase (used as React.MouseEvent<...>, React.ChangeEvent<...>)
  export interface SyntheticEvent<T = any, E = Event> {
    nativeEvent: E;
    currentTarget: T;
    target: T;
    preventDefault(): void;
    stopPropagation(): void;
  }
  export interface MouseEvent<T = any> extends SyntheticEvent<T, globalThis.MouseEvent> {}
  export interface ChangeEvent<T = any> extends SyntheticEvent<T, globalThis.Event> {}
}

declare module "react-dom/client" {
  // PUBLIC_INTERFACE
  const createRoot: any;
  export { createRoot };
}

declare module "react-router-dom" {
  // PUBLIC_INTERFACE
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export function useNavigate(): (to: string | number) => void;
}

declare namespace JSX {
  // PUBLIC_INTERFACE
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
