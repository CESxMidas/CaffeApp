import { io, type Socket } from 'socket.io-client';
import { getApiBaseUrl } from './apiClient';

/**
 * Socket.IO events emitted by the server (must match OrdersGateway).
 */
export const ORDER_WS_EVENTS = {
  CREATED: 'order.created',
  STATUS_CHANGED: 'order.status.changed',
  QUEUE_UPDATED: 'barista.queue.updated',
} as const;

let socket: Socket | null = null;

/**
 * Connect (or reuse) the WebSocket for order updates.
 * Pass the current JWT access token — the server verifies it on handshake.
 */
export function connectOrderSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const baseUrl = getApiBaseUrl();

  socket = io(`${baseUrl}/ws`, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 10_000,
    reconnectionAttempts: Infinity,
  });

  return socket;
}

/** Get the current socket instance (or null if not connected). */
export function getOrderSocket(): Socket | null {
  return socket;
}

/** Disconnect and clear the socket. */
export function disconnectOrderSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
