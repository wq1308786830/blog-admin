import { useQuery } from '@tanstack/react-query';
import BlogServices from '@/services/BlogServices';
import { ApiResponse, Category, CategoryOption } from '@/types';
import { handleOptions } from '@/utils/tools';
import { message } from 'antd';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<CategoryOption[]> => {
      const resp = (await BlogServices.getAllCategories()) as ApiResponse<Category[]>;
      if (resp.success) {
        return handleOptions(resp.data, []);
      }
      message.error(resp.msg || 'Failed to fetch categories');
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
