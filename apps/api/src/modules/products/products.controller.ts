import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type { ProductDto, ProductCategoryDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
  ): Promise<{ data: ProductDto[] }> {
    const data = await this.productsService.listForBranch(user, branchId);
    return { data };
  }

  // Task 6.2: GET /categories endpoint
  @Get('categories')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async listCategories(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
  ): Promise<{ data: ProductCategoryDto[] }> {
    const data = await this.productsService.listCategories(user, branchId);
    return { data };
  }

  // Task 6.1: GET /products/:id endpoint
  @Get(':productId')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async getOne(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
  ): Promise<{ data: ProductDto }> {
    const data = await this.productsService.getById(user, productId);
    return { data };
  }

  // Task 6.3: POST /products (manager only)
  @Post()
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateProductDto,
  ): Promise<{ data: ProductDto }> {
    const data = await this.productsService.create(user, dto);
    return { data };
  }

  // Task 6.4: PATCH /products/:id (manager only)
  @Patch(':productId')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ): Promise<{ data: ProductDto }> {
    const data = await this.productsService.update(user, productId, dto);
    return { data };
  }

  // Task 6.5: POST /categories (manager only)
  @Post('categories')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async createCategory(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCategoryDto,
  ): Promise<{ data: ProductCategoryDto }> {
    const data = await this.productsService.createCategory(user, dto);
    return { data };
  }

  // FR-D05: DELETE /products/:id (manager only)
  @Delete(':productId')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
  ): Promise<{ data: { success: boolean } }> {
    await this.productsService.delete(user, productId);
    return { data: { success: true } };
  }
}
