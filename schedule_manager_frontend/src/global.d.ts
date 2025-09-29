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
//// <reference path="./types/api.d.ts" />
/// <reference path="./types/ws.d.ts" />

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
  }

/// <reference path="./types/ws.d.ts" />;
  export function fetchJSON(path: string, options?: Record<string, any>): Promise<any>;
  export function graphql(query: string, variables?: Record<string, any>): Promise<any>;
}
