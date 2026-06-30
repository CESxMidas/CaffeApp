import { Injectable } from '@nestjs/common';
import type { BranchBankInfoDto, BranchDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type { JwtPayload } from '@common/types/jwt-payload.types';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(payload: JwtPayload): Promise<BranchDto[]> {
    // OWNER + MANAGER: all active branches (manager needs this for branch-assignment proposals)
    if (payload.role === StaffRole.OWNER || payload.role === StaffRole.MANAGER) {
      const branches = await this.prisma.branch.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      return branches.map((branch) => this.toBranchDto(branch));
    }

    if (!payload.branchId) {
      return [];
    }

    const branch = await this.prisma.branch.findFirst({
      where: { id: payload.branchId, isActive: true },
    });

    return branch ? [this.toBranchDto(branch)] : [];
  }

  private toBranchDto(branch: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    bankInfo?: unknown;
    isActive: boolean;
  }): BranchDto {
    return {
      id: branch.id,
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      bankInfo: this.toBranchBankInfo(branch.bankInfo),
      isActive: branch.isActive,
    };
  }

  private toBranchBankInfo(value: unknown): BranchBankInfoDto | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const bankInfo = value as Record<string, unknown>;
    const bank = typeof bankInfo.bank === 'string' ? bankInfo.bank : null;
    const account = typeof bankInfo.account === 'string' ? bankInfo.account : null;

    if (!bank || !account) {
      return null;
    }

    return {
      bank,
      account,
      bankCode: typeof bankInfo.bankCode === 'string' ? bankInfo.bankCode : null,
      holder: typeof bankInfo.holder === 'string' ? bankInfo.holder : null,
    };
  }
}
