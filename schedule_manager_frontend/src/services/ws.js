/**
 * WebSocket client for live updates.
 * Requires REACT_APP_WS_URL environment variable (ws[s]://host/path)
 * This module auto-reconnects with simple backoff.
 */

let socket = null;
let listeners = new Set();
let statusListeners = new Set();
let reconnectDelay = 1000;

const WS_URL = process.env.REACT_APP_WS_URL || "";

function notifyStatus(connected) {
  statusListeners.forEach((cb) => {
    try { cb(connected); } catch {}
  });
}

/**
 * PUBLIC_INTERFACE
 * connectWS - connect if URL available
 */
export function connectWS() {
  /** Connects to WebSocket server and sets up message routing */
  if (!WS_URL) return;
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;

  socket = new WebSocket(WS_URL);
  socket.onopen = () => {
    reconnectDelay = 1000;
    notifyStatus(true);
  };
  socket.onmessage = (ev) => {
    let data = null;
    try { data = JSON.parse(ev.data); } catch { data = { type: "raw", payload: ev.data }; }
    listeners.forEach((cb) => {
      try { cb(data); } catch (e) { /* noop */ }
    });
  };
  socket.onclose = () => {
    notifyStatus(false);
    setTimeout(connectWS, reconnectDelay);
    reconnectDelay = Math.min(10000, reconnectDelay * 1.5);
  };
  socket.onerror = () => {
    try { socket.close(); } catch {}
  };
}

/**
 * PUBLIC_INTERFACE
 * onMessage - subscribe to data messages
 */
export function onMessage(cb) {
  /** Subscribes to all message types; returns unsubscribe function */
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/**
 * PUBLIC_INTERFACE
 * onStatus - subscribe to connection status boolean
 */
export function onStatus(cb) {
  /** Subscribes to connection status changes; returns unsubscribe */
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}

/**
 * PUBLIC_INTERFACE
 * send - send outbound messages (if needed)
 */
export function send(msg) {
  /** Sends JSON message when socket available */
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
}
