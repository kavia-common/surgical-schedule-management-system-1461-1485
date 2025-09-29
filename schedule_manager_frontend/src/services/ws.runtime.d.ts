 /** 
  * PUBLIC_INTERFACE
  * Concrete module declaration for the runtime JS implementation path "../services/ws.js".
  * This ensures TS can resolve the named exports when importing from "../services/ws.js".
  */
declare module "../services/ws.js" {
  /** Connects to the WebSocket server using REACT_APP_WS_URL. No-op if missing. */
  export function connectWS(): void;

  /** Subscribe to incoming messages. Returns an unsubscribe function. */
  export function onMessage(cb: (msg: any) => void): () => void;

  /** Subscribe to connection status changes (true=connected). Returns an unsubscribe function. */
  export function onStatus(cb: (connected: boolean) => void): () => void;

  /** Send a JSON-serializable message if the socket is open. */
  export function send(msg: any): void;
}
