 /**
  * PUBLIC_INTERFACE
  * Global ambient types aggregator to ensure TS includes our shims during builds.
  * This file is included by tsconfig `"include": ["src"]`.
  * It re-exports or references local ambient module declarations so the compiler
  * can resolve JS modules imported by TS files without @types.
  */

// Ensure the compiler loads our type shims
/// <reference path="./types/shims.d.ts" />
/// <reference path="./types/js-modules.d.ts" />
/// <reference path="./types/react-jsx-runtime.d.ts" />
/// <reference path="./types/api.d.ts" />

// Additionally, provide a direct declaration for the relative path used in ScheduleTabs
declare module "../services/api" {
  export const api: {
    listResources: (filters?: Record<string, any>) => Promise<any[]>;
    listCases: (params?: Record<string, any>) => Promise<any[]>;
    createCase: (payload: Record<string, any>) => Promise<any>;
    updateCase: (id: string | number, patch: Record<string, any>) => Promise<any>;
    moveCase: (id: string | number, start: string, end: string) => Promise<any>;
    assignResource: (caseId: string | number, resourceId: string | number) => Promise<any>;
    unassignResource: (caseId: string | number, resourceId: string | number) => Promise<any>;
  };
  export function fetchJSON(path: string, options?: Record<string, any>): Promise<any>;
  export function graphql(query: string, variables?: Record<string, any>): Promise<any>;
}

// WS module declaration to satisfy TS7016 for "../services/ws" imports in TS files.
declare module "../services/ws" {
  /** Connects to the WebSocket server using REACT_APP_WS_URL. No-op if missing. */
  export function connectWS(): void;
  /** Subscribe to incoming messages. Returns an unsubscribe function. */
  export function onMessage(cb: (msg: any) => void): () => void;
  /** Subscribe to connection status changes (true=connected). Returns an unsubscribe function. */
  export function onStatus(cb: (connected: boolean) => void): () => void;
  /** Send a JSON-serializable message if the socket is open. */
  export function send(msg: any): void;
}
