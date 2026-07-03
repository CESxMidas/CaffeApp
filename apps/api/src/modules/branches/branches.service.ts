import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { BranchBankInfoDto, BranchDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { CreateBranchDto } from './dto/create-branch.dto';
import type { UpdateBranchDto } from './dto/update-branch.dto';

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

  async create(payload: JwtPayload, dto: CreateBranchDto): Promise<BranchDto> {
    if (payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ chủ quán mới được tạo chi nhánh');
    }

    const existing = await this.prisma.branch.findFirst({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException('Tên chi nhánh đã tồn tại');
    }

    const branch = await this.prisma.branch.create({
      data: {
        name: dto.name,
        address: dto.address ?? null,
        phone: dto.phone ?? null,
      },
    });

    return this.toBranchDto(branch);
  }

  async update(payload: JwtPayload, id: string, dto: UpdateBranchDto): Promise<BranchDto> {
    if (payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ chủ quán mới được sửa chi nhánh');
    }

    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException('Chi nhánh không tồn tại');
    }

    if (dto.name && dto.name !== branch.name) {
      const duplicate = await this.prisma.branch.findFirst({
        where: { name: dto.name, id: { not: id } },
      });
      if (duplicate) {
        throw new BadRequestException('Tên chi nhánh đã tồn tại');
      }
    }

    const updated = await this.prisma.branch.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });

    return this.toBranchDto(updated);
  }

  async remove(payload: JwtPayload, id: string): Promise<BranchDto> {
    if (payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ chủ quán mới được xóa chi nhánh');
    }

    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException('Chi nhánh không tồn tại');
    }

    // Soft delete — deactivate
    const updated = await this.prisma.branch.update({
      where: { id },
      data: { isActive: false },
    });

    return this.toBranchDto(updated);
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
