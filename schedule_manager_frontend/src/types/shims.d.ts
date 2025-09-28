/* Minimal ambient type shims to allow CRA to compile .tsx without @types in CI.
   Replace with proper @types/react, @types/react-dom, @types/react-router-dom in real setup. */
declare module "react" {
  export type ReactNode = any;
  export type ReactElement = any;
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactElement | null;
  }
  export const Fragment: any;
  export function createElement(...args: any[]): any;
  export function useState<T = any>(init?: T): [T, (v: T | ((p: T) => T)) => void];
  export function useEffect(cb: () => void | (() => void), deps?: any[]): void;
  export function useRef<T = any>(v?: T): { current: T };
}
declare module "react-dom/client" {
  const createRoot: any;
  export { createRoot };
}
declare module "react-router-dom" {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export function useNavigate(): (to: string | number) => void;
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
