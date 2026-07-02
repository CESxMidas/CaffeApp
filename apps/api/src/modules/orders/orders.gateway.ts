import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { OrderDto } from '@caffeapp/shared';

/**
 * Room name prefix for branch-scoped rooms.
 * Clients join `branch:{branchId}` after JWT verification.
 */
const BRANCH_ROOM_PREFIX = 'branch:';

/**
 * Events emitted by the server to branch rooms.
 */
export const ORDER_EVENTS = {
  CREATED: 'order.created',
  STATUS_CHANGED: 'order.status.changed',
  QUEUE_UPDATED: 'barista.queue.updated',
} as const;

/**
 * Socket.IO gateway for real-time order updates.
 *
 * - Clients authenticate via JWT in handshake `auth.token`.
 * - After auth, clients are placed in a branch-scoped room (`branch:{branchId}`).
 * - Events: `order.created`, `order.status.changed`, `barista.queue.updated`.
 *
 * @see TASK-P2-11 — Sprint 4 P1: WebSocket bếp
 */
@WebSocketGateway({
  namespace: '/ws',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(OrdersGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  // ── Connection lifecycle ──────────────────────────────────────────────

  async handleConnection(client: Socket): Promise<void> {
    try {
      const payload = this.verifyToken(client);
      (client.data as Record<string, unknown>).user = payload;

      const branchId = payload.branchId;
      if (branchId) {
        client.join(BRANCH_ROOM_PREFIX + branchId);
        this.logger.debug(
          `Client ${client.id} joined room ${BRANCH_ROOM_PREFIX + branchId} (role=${payload.role})`,
        );
      } else {
        this.logger.debug(`Client ${client.id} connected without branchId (role=${payload.role})`);
      }
    } catch (err) {
      this.logger.warn(`Connection rejected: ${(err as Error).message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`Client ${client.id} disconnected`);
  }

  // ── Public emit helpers (called by OrdersService) ─────────────────────

  /** Emit `order.created` + `barista.queue.updated` to the branch room. */
  emitOrderCreated(branchId: string, order: OrderDto): void {
    const room = BRANCH_ROOM_PREFIX + branchId;
    this.server.to(room).emit(ORDER_EVENTS.CREATED, { order });
    this.server.to(room).emit(ORDER_EVENTS.QUEUE_UPDATED, { branchId });
    this.logger.debug(
      `Emitted ${ORDER_EVENTS.CREATED} to room ${room} (order #${order.orderNumber})`,
    );
  }

  /** Emit `order.status.changed` + `barista.queue.updated` to the branch room. */
  emitOrderStatusChanged(branchId: string, order: OrderDto): void {
    const room = BRANCH_ROOM_PREFIX + branchId;
    this.server.to(room).emit(ORDER_EVENTS.STATUS_CHANGED, { order });
    this.server.to(room).emit(ORDER_EVENTS.QUEUE_UPDATED, { branchId });
    this.logger.debug(
      `Emitted ${ORDER_EVENTS.STATUS_CHANGED} to room ${room} (order #${order.orderNumber} → ${order.status})`,
    );
  }

  /** Emit `barista.queue.updated` to the branch room (e.g. item prepared toggled). */
  emitQueueUpdated(branchId: string): void {
    const room = BRANCH_ROOM_PREFIX + branchId;
    this.server.to(room).emit(ORDER_EVENTS.QUEUE_UPDATED, { branchId });
    this.logger.debug(`Emitted ${ORDER_EVENTS.QUEUE_UPDATED} to room ${room}`);
  }

  // ── Private helpers ───────────────────────────────────────────────────

  private verifyToken(client: Socket): JwtPayload {
    // Socket.IO v4: token can be passed in handshake auth or query
    const token =
      (client.handshake.auth as { token?: string } | undefined)?.token ??
      (client.handshake.query as { token?: string } | undefined)?.token;

    if (!token) {
      throw new UnauthorizedException('No auth token provided');
    }

    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
