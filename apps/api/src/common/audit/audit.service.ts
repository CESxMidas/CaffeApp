import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';

export interface AuditLogParams {
  branchId?: string | null;
  actorId?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  beforeData?: Prisma.InputJsonValue;
  afterData?: Prisma.InputJsonValue;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: AuditLogParams): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        branchId: params.branchId ?? null,
        actorId: params.actorId ?? null,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        beforeData: params.beforeData ?? undefined,
        afterData: params.afterData ?? undefined,
        metadata: params.metadata ?? undefined,
      },
    });
  }
}
