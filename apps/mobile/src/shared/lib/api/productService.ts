import type { ApiDataResponse, ProductDto } from '@caffeapp/shared';
import { API_ENDPOINTS } from '@shared/config/api.config';
import { apiClient } from './apiClient';

export const productService = {
  async listProducts(branchId: string): Promise<ProductDto[]> {
    const { data } = await apiClient.get<ApiDataResponse<ProductDto[]>>(API_ENDPOINTS.products, {
      params: { branchId },
    });
    return data.data;
  },
};
