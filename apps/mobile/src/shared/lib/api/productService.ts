import type { ApiDataResponse, ProductDto, ProductCategoryDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const productService = {
  async listProducts(branchId: string): Promise<ProductDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<ProductDto[]>>(API_ENDPOINTS.products, {
      params: { branchId },
    });
    return data.data;
  },

  async listCategories(branchId?: string): Promise<ProductCategoryDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<ProductCategoryDto[]>>(
      `${API_ENDPOINTS.products}/categories`,
      { params: { ...(branchId ? { branchId } : {}) } },
    );
    return data.data;
  },

  async createProduct(params: {
    branchId: string;
    name: string;
    price: number;
    categoryId: string;
    description?: string;
  }): Promise<ProductDto> {
    const { data } = await apiClient.post<ApiDataResponse<ProductDto>>(
      API_ENDPOINTS.products,
      params,
    );
    return data.data;
  },

  async updateProduct(params: {
    productId: string;
    name?: string;
    price?: number;
    categoryId?: string;
    description?: string;
  }): Promise<ProductDto> {
    const { data } = await apiClient.patch<ApiDataResponse<ProductDto>>(
      `${API_ENDPOINTS.products}/${params.productId}`,
      params,
    );
    return data.data;
  },

  async deleteProduct(productId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.products}/${productId}`);
  },
};
