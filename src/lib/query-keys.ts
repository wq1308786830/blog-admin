import { ArticleFilters } from '@/types';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => ['auth', 'user'] as const,
  },
  articles: {
    all: ['articles'] as const,
    lists: () => ['articles', 'list'] as const,
    list: (filters: ArticleFilters) => ['articles', 'list', filters] as const,
    details: () => ['articles', 'detail'] as const,
    detail: (id: number) => ['articles', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    tree: () => ['categories', 'tree'] as const,
    detail: (id: number) => ['categories', 'detail', id] as const,
  },
} as const;
