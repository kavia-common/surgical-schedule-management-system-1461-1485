/**
 * PUBLIC_INTERFACE
 * Ambient type declarations for the JS API module to satisfy TS without @types installs.
 * Declares both with-extension and extension-less paths, plus baseUrl-mapped import.
 */
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
declare module "../services/api.js" {
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
declare module "services/api" {
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
