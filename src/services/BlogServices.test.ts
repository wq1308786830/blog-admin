import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BlogServices from './BlogServices';
import * as request from '@/utils/request';

// Mock request模块
vi.mock('@/utils/request');

describe('BlogServices - 博客API服务', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCategories', () => {
    it('✅ TDD: 获取分类应使用GET请求', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await BlogServices.getCategories(1);

      expect(request.GET).toHaveBeenCalledWith('/category/getCategories', { fatherId: 1 });
    });

    it('✅ TDD: 获取子分类应传递fatherId参数', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [
          { id: 2, name: 'SubCategory', father_id: 1, level: 2 },
        ],
      });

      await BlogServices.getCategories(1);

      expect(request.GET).toHaveBeenCalledWith('/category/getCategories', { fatherId: 1 });
    });

    it('✅ TDD: 获取顶级分类时fatherId应为null', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [
          { id: 1, name: 'Tech', father_id: null, level: 1 },
        ],
      });

      await BlogServices.getCategories(null);

      expect(request.GET).toHaveBeenCalledWith('/category/getCategories', { fatherId: null });
    });

    it('✅ TDD: 获取分类应返回分类数组', async () => {
      const mockCategories = [
        { id: 1, name: 'Tech', father_id: null, level: 1 },
        { id: 2, name: 'Frontend', father_id: 1, level: 2 },
      ];

      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: mockCategories,
      });

      const result = await BlogServices.getCategories(1);

      expect(result.data).toEqual(mockCategories);
      expect(result.data).toHaveLength(2);
    });

    it('✅ TDD: 获取分类失败时应返回错误信息', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: false,
        msg: '获取分类失败',
        data: null,
      });

      const result = await BlogServices.getCategories(1);

      expect(result.success).toBe(false);
      expect(result.msg).toBe('获取分类失败');
    });

    it('✅ TDD: 获取分类应支持fatherId为0的情况', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await BlogServices.getCategories(0);

      expect(request.GET).toHaveBeenCalledWith('/category/getCategories', { fatherId: 0 });
    });
  });

  describe('getAllCategories', () => {
    it('✅ TDD: 获取所有分类应使用GET请求', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await BlogServices.getAllCategories();

      expect(request.GET).toHaveBeenCalledWith('/category/getAllCategories');
    });

    it('✅ TDD: 获取所有分类应返回完整分类树', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Tech',
          father_id: null,
          level: 1,
          children: [
            { id: 2, name: 'Frontend', father_id: 1, level: 2, children: [] },
          ],
        },
      ];

      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: mockCategories,
      });

      const result = await BlogServices.getAllCategories();

      expect(result.data).toEqual(mockCategories);
      expect(result.data[0].children).toHaveLength(1);
    });

    it('✅ TDD: 获取所有分类失败时应返回错误信息', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: false,
        msg: '服务器错误',
        data: null,
      });

      const result = await BlogServices.getAllCategories();

      expect(result.success).toBe(false);
      expect(result.msg).toBe('服务器错误');
    });

    it('✅ TDD: 无分类时应返回空数组', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      const result = await BlogServices.getAllCategories();

      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('getArticleList', () => {
    it('✅ TDD: 获取文章列表应使用GET请求', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await BlogServices.getArticleList('tech');

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleList', { key: 'tech' });
    });

    it('✅ TDD: 获取文章列表应传递搜索关键字', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await BlogServices.getArticleList('react');

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleList', { key: 'react' });
    });

    it('✅ TDD: 获取文章列表应支持空关键字', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await BlogServices.getArticleList('');

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleList', { key: '' });
    });

    it('✅ TDD: 获取文章列表应返回文章数组', async () => {
      const mockArticles = [
        { id: 1, title: 'React Tutorial', content: '...' },
        { id: 2, title: 'Vue Guide', content: '...' },
      ];

      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: mockArticles,
      });

      const result = await BlogServices.getArticleList('react');

      expect(result.data).toEqual(mockArticles);
      expect(result.data).toHaveLength(2);
    });

    it('✅ TDD: 获取文章列表失败时应返回错误信息', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: false,
        msg: '搜索失败',
        data: null,
      });

      const result = await BlogServices.getArticleList('test');

      expect(result.success).toBe(false);
      expect(result.msg).toBe('搜索失败');
    });
  });

  describe('getArticleDetail', () => {
    it('✅ TDD: 获取文章详情应使用GET请求', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: { id: 1, title: 'Test', content: '...' },
      });

      await BlogServices.getArticleDetail(123);

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleDetail', { articleId: 123 });
    });

    it('✅ TDD: 获取文章详情应传递文章ID', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: { id: 456, title: 'Detail' },
      });

      await BlogServices.getArticleDetail(456);

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleDetail', { articleId: 456 });
    });

    it('✅ TDD: 获取文章详情应返回完整文章数据', async () => {
      const mockArticle = {
        id: 1,
        title: 'Complete Article',
        content: 'Full content here',
        categoryId: 1,
        createTime: '2024-01-01',
      };

      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: mockArticle,
      });

      const result = await BlogServices.getArticleDetail(1);

      expect(result.data).toEqual(mockArticle);
      expect(result.data.title).toBe('Complete Article');
    });

    it('✅ TDD: 获取不存在的文章应返回错误信息', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: false,
        msg: '文章不存在',
        data: null,
      });

      const result = await BlogServices.getArticleDetail(99999);

      expect(result.success).toBe(false);
      expect(result.msg).toBe('文章不存在');
    });

    it('✅ TDD: 获取文章详情应支持ID为1的文章', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: { id: 1, title: 'First Article' },
      });

      await BlogServices.getArticleDetail(1);

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleDetail', { articleId: 1 });
    });
  });

  describe('getArticleRecommendLinks', () => {
    it('✅ TDD: 获取推荐文章应使用GET请求', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await BlogServices.getArticleRecommendLinks(123);

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleRecommendLinks', { articleId: 123 });
    });

    it('✅ TDD: 获取推荐文章应传递文章ID', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [{ id: 2, title: 'Related Article' }],
      });

      await BlogServices.getArticleRecommendLinks(5);

      expect(request.GET).toHaveBeenCalledWith('/article/getArticleRecommendLinks', { articleId: 5 });
    });

    it('✅ TDD: 获取推荐文章应返回推荐文章列表', async () => {
      const mockRecommendations = [
        { id: 2, title: 'Related 1' },
        { id: 3, title: 'Related 2' },
        { id: 4, title: 'Related 3' },
      ];

      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: mockRecommendations,
      });

      const result = await BlogServices.getArticleRecommendLinks(1);

      expect(result.data).toEqual(mockRecommendations);
      expect(result.data).toHaveLength(3);
    });

    it('✅ TDD: 无推荐文章时应返回空数组', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      const result = await BlogServices.getArticleRecommendLinks(1);

      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });

    it('✅ TDD: 获取推荐文章失败时应返回错误信息', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: false,
        msg: '获取推荐失败',
        data: null,
      });

      const result = await BlogServices.getArticleRecommendLinks(1);

      expect(result.success).toBe(false);
      expect(result.msg).toBe('获取推荐失败');
    });
  });

  describe('deleteCategory', () => {
    it('✅ TDD: 删除分类应使用DELETE请求', async () => {
      vi.mocked(request.DELETE).mockResolvedValue({
        success: true,
      });

      await BlogServices.deleteCategory(123);

      expect(request.DELETE).toHaveBeenCalledWith('/admin/deleteCategory', { categoryId: 123 });
    });

    it('✅ TDD: 删除分类应传递分类ID', async () => {
      vi.mocked(request.DELETE).mockResolvedValue({
        success: true,
      });

      await BlogServices.deleteCategory(5);

      expect(request.DELETE).toHaveBeenCalledWith('/admin/deleteCategory', { categoryId: 5 });
    });

    it('✅ TDD: 删除分类成功应返回成功响应', async () => {
      vi.mocked(request.DELETE).mockResolvedValue({
        success: true,
      });

      const result = await BlogServices.deleteCategory(1);

      expect(result.success).toBe(true);
    });

    it('✅ TDD: 删除不存在的分类应返回错误信息', async () => {
      vi.mocked(request.DELETE).mockResolvedValue({
        success: false,
        msg: '分类不存在',
      });

      const result = await BlogServices.deleteCategory(99999);

      expect(result.success).toBe(false);
      expect(result.msg).toBe('分类不存在');
    });

    it('✅ TDD: 删除有子分类的分类应返回错误信息', async () => {
      vi.mocked(request.DELETE).mockResolvedValue({
        success: false,
        msg: '该分类下存在子分类，无法删除',
      });

      const result = await BlogServices.deleteCategory(1);

      expect(result.success).toBe(false);
      expect(result.msg).toBe('该分类下存在子分类，无法删除');
    });

    it('✅ TDD: 删除分类应支持ID为0的情况', async () => {
      vi.mocked(request.DELETE).mockResolvedValue({
        success: true,
      });

      await BlogServices.deleteCategory(0);

      expect(request.DELETE).toHaveBeenCalledWith('/admin/deleteCategory', { categoryId: 0 });
    });
  });
});
