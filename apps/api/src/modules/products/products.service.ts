import { Injectable } from '@nestjs/common';
import type { ProductDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForBranch(payload: JwtPayload, branchId?: string): Promise<ProductDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);
    const isManagerPlus = payload.role === StaffRole.MANAGER || payload.role === StaffRole.OWNER;

    const products = await this.prisma.product.findMany({
      where: {
        branchId: scopedBranchId,
        ...(isManagerPlus ? {} : { isAvailable: true }),
      },
      include: { category: { select: { name: true } } },
      orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
    });

    return products.map((p) => ({
      id: p.id,
      branchId: p.branchId,
      categoryId: p.categoryId,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      isAvailable: p.isAvailable,
      categoryName: p.category.name,
    }));
  }
}
