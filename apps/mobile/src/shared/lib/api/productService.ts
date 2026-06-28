import type { ProductCategoryDto, ProductDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const productService = {
  async listProducts(branchId: string): Promise<ProductDto[]> {
    const { data } = await apiClient.get<ProductDto[]>(API_ENDPOINTS.products, {
      params: { branchId },
    });
    return data;
  },

  async listCategories(branchId: string): Promise<ProductCategoryDto[]> {
    const { data } = await apiClient.get<ProductCategoryDto[]>(
      `${API_ENDPOINTS.products}/categories`,
      {
        params: { branchId },
      },
    );
    return data;
  },
};
