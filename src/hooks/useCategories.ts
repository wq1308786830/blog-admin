import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminServices from '@/services/AdminServices';
import BlogServices from '@/services/BlogServices';
import { queryKeys } from '@/lib/query-client';
import { ApiResponse, Category, CategoryOption } from '@/types';
import { handleOptions } from '@/utils/tools';
import { showSuccess, showError } from '@/lib/toast';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn: async (): Promise<CategoryOption[]> => {
      const resp = (await BlogServices.getAllCategories()) as ApiResponse<Category[]>;
      if (resp.success) {
        return handleOptions(resp.data);
      }
      showError(resp.msg || 'Failed to fetch categories');
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { fatherId: number | null; level: number; categoryName: string }) =>
      AdminServices.addCategory(params.fatherId, params.level, params.categoryName),
    onSuccess: async () => {
      showSuccess('添加成功');
      // Invalidate and refetch categories
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (err: Error) => {
      showError(`错误：${err.message}`);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => BlogServices.deleteCategory(categoryId),
    onSuccess: async () => {
      showSuccess('删除成功');
      // Invalidate and refetch categories
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (err: Error) => {
      showError(`错误：${err.message}`);
    },
  });
}
