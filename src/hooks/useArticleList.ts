import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminServices from '@/services/AdminServices';
import { queryKeys } from '@/lib/query-client';
import { Article, ArticleFilters, CreateArticleDto } from '@/types';
import { message } from 'antd';

export function useArticleList(filters: ArticleFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.articles.list(filters),
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
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.articles.lists() });

      // Snapshot previous value
      const previousArticles = queryClient.getQueriesData<Article[]>({
        queryKey: queryKeys.articles.lists(),
      });

      // Optimistically update to the new value
      queryClient.setQueriesData<Article[]>(
        { queryKey: queryKeys.articles.lists() },
        (old) => old?.filter((a) => a.id !== deletedId) || []
      );

      // Return context with previous value
      return { previousArticles };
    },
    onError: (err, _id, context) => {
      // Rollback to previous value on error
      context?.previousArticles.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      message.error(`错误：${err.message}`);
    },
    onSettled: async () => {
      // Refetch to ensure server state
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.lists() });
    },
    onSuccess: () => {
      message.success('删除成功');
    },
  });

  const publishMutation = useMutation({
    mutationFn: (body: CreateArticleDto) => AdminServices.publishArticle(body),
    onSuccess: async () => {
      message.success('发布成功');
      // Invalidate article lists to show updated data
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.lists() });
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

// New hook for fetching a single article
export function useArticle(articleId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.articles.detail(articleId || 0),
    queryFn: async (): Promise<Article> => {
      if (!articleId) {
        throw new Error('Article ID is required');
      }
      const resp = await AdminServices.getArticles({ categoryId: '', dateRange: [], text: '' }, 0);
      if (!resp.success) {
        throw new Error(resp.msg || 'Failed to fetch article');
      }
      const article = resp.data.find((a) => a.id === articleId);
      if (!article) {
        throw new Error('Article not found');
      }
      return article;
    },
    enabled: !!articleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// New hook for prefetching articles
export function usePrefetchArticle() {
  const queryClient = useQueryClient();

  return (articleId: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.articles.detail(articleId),
      queryFn: async (): Promise<Article> => {
        const resp = await AdminServices.getArticles(
          { categoryId: '', dateRange: [], text: '' },
          0
        );
        if (!resp.success) {
          throw new Error(resp.msg || 'Failed to fetch article');
        }
        const article = resp.data.find((a) => a.id === articleId);
        if (!article) {
          throw new Error('Article not found');
        }
        return article;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}
