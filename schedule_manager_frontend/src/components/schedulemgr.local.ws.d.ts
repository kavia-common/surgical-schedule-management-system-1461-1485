/**
 * PUBLIC_INTERFACE
 * Local ambient declaration to ensure TS can resolve the JS ws module
 * from ScheduleManager.tsx's relative import path during CI builds.
 * This complements src/types/ws.d.ts.
 */
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
