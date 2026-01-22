import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminServices from '@/services/AdminServices';
import BlogServices from '@/services/BlogServices';
import { queryKeys } from '@/lib/query-client';
import { CreateArticleDto } from '@/types';
import { showSuccess, showError } from '@/lib/toast';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

export interface ArticleEditState {
  title: string;
  categoryId: number;
  textType: 'md' | 'html';
  markdownContent: string;
  editorState: any;
}

const initialState: ArticleEditState = {
  title: '',
  categoryId: 0,
  textType: 'md',
  markdownContent: '',
  editorState: EditorState.createEmpty(),
};

export function useArticleEdit(articleId: number | undefined) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<ArticleEditState>(initialState);

  // Fetch article detail
  const { data: article, isLoading } = useQuery({
    queryKey: queryKeys.articles.detail(articleId || 0),
    queryFn: async () => {
      if (!articleId) {
        throw new Error('Article ID is required');
      }
      const resp = await BlogServices.getArticleDetail(articleId);
      if (!resp.success) {
        throw new Error(resp.msg || 'Failed to fetch article');
      }
      return resp.data;
    },
    enabled: !!articleId && articleId !== 0,
    staleTime: 5 * 60 * 1000,
  });

  // Initialize article state when data is loaded
  useEffect(() => {
    if (article) {
      setState((prev) => ({
        ...prev,
        title: article.title || '',
        categoryId: article.category_id || 0,
        textType: article.text_type || 'md',
      }));

      if (article.text_type === 'md') {
        setState((prev) => ({ ...prev, markdownContent: article.content || '' }));
      } else if (article.text_type === 'html') {
        initHtmlEditor(article.content || '');
      }
    }
  }, [article]);

  const initHtmlEditor = (html: string) => {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setState((prev) => ({ ...prev, editorState }));
    }
  };

  // Publish article mutation
  const publishMutation = useMutation({
    mutationFn: (body: CreateArticleDto) => AdminServices.publishArticle(body),
    onSuccess: async () => {
      showSuccess('发布成功！');
      // Invalidate article lists to show updated data
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.lists() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.articles.detail(articleId || 0) });
    },
    onError: (err: Error) => {
      showError(`错误：${err.message}`);
    },
  });

  const updateState = (updates: Partial<ArticleEditState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const publishArticle = (additionalData: { id?: number }) => {
    let content = '';
    if (state.textType === 'md') {
      content = state.markdownContent;
    } else {
      const rawContent = convertToRaw(state.editorState.getCurrentContent());
      content = draftToHtml(rawContent);
    }

    const body: CreateArticleDto = {
      title: state.title,
      categoryId: state.categoryId,
      content,
      textType: state.textType,
      ...additionalData,
    };

    publishMutation.mutate(body);
  };

  return {
    state,
    updateState,
    publishArticle,
    isLoading,
    isPublishing: publishMutation.isPending,
  };
}
