/**
 * API service for REST/GraphQL requests.
 * Uses environment variables. Ensure to set:
 * REACT_APP_API_BASE, REACT_APP_GRAPHQL_PATH
 */
const API_BASE = process.env.REACT_APP_API_BASE || "/api";
const GRAPHQL_PATH = process.env.REACT_APP_GRAPHQL_PATH || "/graphql";

/**
 * PUBLIC_INTERFACE
 * fetchJSON - simple wrapper for REST GET/POST
 */
export async function fetchJSON(path, options = {}) {
  /** Fetch JSON from REST endpoint, throws on non-2xx */
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * graphql - POST GraphQL queries to backend
 */
export async function graphql(query, variables = {}) {
  /** Send GraphQL POST to configured endpoint */
  const res = await fetch(`${API_BASE}${GRAPHQL_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data.data;
}

/**
 * PUBLIC_INTERFACE
 * api - semantic endpoints used by the app
 */
export const api = {
  // Resources (surgeons, nurses, ORs, devices)
  listResources: (filters) =>
    fetchJSON(`/resources?${new URLSearchParams(filters || {})}`),
  // Cases / Events
  listCases: (params) =>
    fetchJSON(`/cases?${new URLSearchParams(params || {})}`),
  createCase: (payload) =>
    fetchJSON(`/cases`, { method: "POST", body: JSON.stringify(payload) }),
  updateCase: (id, patch) =>
    fetchJSON(`/cases/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  moveCase: (id, start, end) =>
    fetchJSON(`/cases/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ start, end }),
    }),
  // Assignments
  assignResource: (caseId, resourceId) =>
    fetchJSON(`/cases/${caseId}/assign`, {
      method: "POST",
      body: JSON.stringify({ resourceId }),
    }),
  unassignResource: (caseId, resourceId) =>
    fetchJSON(`/cases/${caseId}/unassign`, {
      method: "POST",
      body: JSON.stringify({ resourceId }),
    }),
};
