import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { ProductDto, ProductCategoryDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

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

  // Task 6.1: GET /products/:id endpoint
  async getById(payload: JwtPayload, productId: string): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: { select: { name: true } } },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Check branch access
    const scopedBranchId = resolveBranchScope(payload);
    if (product.branchId !== scopedBranchId) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return {
      id: product.id,
      branchId: product.branchId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      categoryName: product.category.name,
    };
  }

  // Task 6.2: GET /categories endpoint
  async listCategories(payload: JwtPayload, branchId?: string): Promise<ProductCategoryDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    const categories = await this.prisma.productCategory.findMany({
      where: { branchId: scopedBranchId },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      branchId: c.branchId,
      name: c.name,
      slug: c.slug,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
    }));
  }

  // Task 6.3: POST /products (manager only)
  async create(payload: JwtPayload, dto: CreateProductDto): Promise<ProductDto> {
    const scopedBranchId = resolveBranchScope(payload);

    // Validate category exists
    const category = await this.prisma.productCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    if (category.branchId !== scopedBranchId) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    // Check slug uniqueness for category name
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        branchId: scopedBranchId,
        categoryId: dto.categoryId,
        name: dto.name,
      },
    });

    if (existingProduct) {
      throw new ConflictException('Sản phẩm đã tồn tại trong danh mục này');
    }

    const product = await this.prisma.product.create({
      data: {
        branchId: scopedBranchId,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        isAvailable: dto.isAvailable ?? true,
      },
      include: { category: { select: { name: true } } },
    });

    return {
      id: product.id,
      branchId: product.branchId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      categoryName: product.category.name,
    };
  }

  // Task 6.4: PATCH /products/:id (manager only)
  async update(payload: JwtPayload, productId: string, dto: UpdateProductDto): Promise<ProductDto> {
    const scopedBranchId = resolveBranchScope(payload);

    // Check product exists and belongs to branch
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (existingProduct.branchId !== scopedBranchId) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Validate category if changing
    if (dto.categoryId && dto.categoryId !== existingProduct.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Danh mục không tồn tại');
      }

      if (category.branchId !== scopedBranchId) {
        throw new NotFoundException('Danh mục không tồn tại');
      }
    }

    const product = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
      },
      include: { category: { select: { name: true } } },
    });

    return {
      id: product.id,
      branchId: product.branchId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      categoryName: product.category.name,
    };
  }

  // FR-D05: DELETE /products/:id (manager only)
  async delete(payload: JwtPayload, productId: string): Promise<void> {
    const scopedBranchId = resolveBranchScope(payload);

    // Check product exists and belongs to branch
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (existingProduct.branchId !== scopedBranchId) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Soft delete - set isAvailable to false
    await this.prisma.product.update({
      where: { id: productId },
      data: { isAvailable: false },
    });
  }

  // Task 6.5: POST /categories (manager only)
  async createCategory(payload: JwtPayload, dto: CreateCategoryDto): Promise<ProductCategoryDto> {
    const scopedBranchId = resolveBranchScope(payload);

    // Check slug uniqueness
    const existingCategory = await this.prisma.productCategory.findFirst({
      where: {
        branchId: scopedBranchId,
        slug: dto.slug,
      },
    });

    if (existingCategory) {
      throw new ConflictException('Slug danh mục đã tồn tại');
    }

    const category = await this.prisma.productCategory.create({
      data: {
        branchId: scopedBranchId,
        name: dto.name,
        slug: dto.slug,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });

    return {
      id: category.id,
      branchId: category.branchId,
      name: category.name,
      slug: category.slug,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    };
  }
}
