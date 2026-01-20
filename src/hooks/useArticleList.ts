import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminServices from '@/services/AdminServices';
import { Article, ArticleFilters } from '@/types';
import { message } from 'antd';

export function useArticleList(filters: ArticleFilters) {
  return useInfiniteQuery({
    queryKey: ['articles', filters],
    queryFn: async ({ pageParam = 0 }): Promise<Article[]> => {
      const resp = await AdminServices.getArticles(filters, pageParam);
      if (!resp.success) {
        throw new Error(resp.msg || 'Failed to fetch articles');
      }
      return resp.data;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) => {
      return _lastPage.length ? allPages.length : undefined;
    },
  });
}

export function useArticleActions() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => AdminServices.deleteArticle(id),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      message.success('删除成功');
    },
    onError: (err: Error) => {
      message.error(`错误：${err.message}`);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (body: any) => AdminServices.publishArticle(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      message.success('发布成功');
    },
    onError: (err: Error) => {
      message.error(`错误：${err.message}`);
    },
  });

  return {
    deleteArticle: deleteMutation.mutate,
    publishArticle: publishMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isPublishing: publishMutation.isPending,
  };
}
