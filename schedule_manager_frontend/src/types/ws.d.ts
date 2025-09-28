/**
 * PUBLIC_INTERFACE
 * Ambient declarations for the WebSocket client module paths to satisfy TS7016.
 * Declares both "../services/ws" and "../services/ws.js" to match imports.
 */
declare module "../services/ws" {
  export function connectWS(): void;
  export function onMessage(cb: (msg: any) => void): () => void;
  export function onStatus(cb: (connected: boolean) => void): () => void;
  export function send(msg: any): void;
}
declare module "../services/ws.js" {
  export function connectWS(): void;
  export function onMessage(cb: (msg: any) => void): () => void;
  export function onStatus(cb: (connected: boolean) => void): () => void;
  export function send(msg: any): void;
}
