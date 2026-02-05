import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdminServices from './AdminServices';
import * as request from '@/utils/request';

// Mock request模块
vi.mock('@/utils/request');

// Mock md5
vi.mock('md5', () => ({
  default: vi.fn((password: string) => `hashed_${password}`),
}));

describe('AdminServices - 管理员API服务', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('✅ TDD: 登录应使用POST请求发送到/admin/login', async () => {
      vi.mocked(request.POST).mockResolvedValue({
        success: true,
        data: { id: 1, user_name: 'admin' },
      });

      const result = await AdminServices.login({
        user_name: 'admin',
        password: '123456',
      });

      expect(request.POST).toHaveBeenCalledWith('/admin/login', expect.any(Object));
      expect(result.data).toEqual({ id: 1, user_name: 'admin' });
    });

    it('✅ TDD: 登录应对密码进行MD5加密', async () => {
      vi.mocked(request.POST).mockResolvedValue({
        success: true,
        data: { id: 1 },
      });

      await AdminServices.login({
        user_name: 'admin',
        password: 'mypassword',
      });

      expect(request.POST).toHaveBeenCalledWith(
        '/admin/login',
        {
          user_name: 'admin',
          password: 'hashed_mypassword',
        }
      );
    });

    it('✅ TDD: 登录应传递完整的用户名和密码参数', async () => {
      vi.mocked(request.POST).mockResolvedValue({
        success: true,
        data: { id: 1 },
      });

      await AdminServices.login({
        user_name: 'testuser',
        password: 'testpass',
      });

      expect(request.POST).toHaveBeenCalledWith(
        '/admin/login',
        {
          user_name: 'testuser',
          password: 'hashed_testpass',
        }
      );
    });

    it('✅ TDD: 登录失败时应返回错误响应', async () => {
      vi.mocked(request.POST).mockResolvedValue({
        success: false,
        msg: '用户名或密码错误',
        data: null,
      });

      const result = await AdminServices.login({
        user_name: 'admin',
        password: 'wrong',
      });

      expect(result.success).toBe(false);
      expect(result.msg).toBe('用户名或密码错误');
    });
  });

  describe('getArticles', () => {
    it('✅ TDD: 获取文章列表应使用GET请求', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      await AdminServices.getArticles({ categoryId: '1', dateRange: [], text: 'search' }, 1);

      expect(request.GET).toHaveBeenCalledWith('/admin/getArticles', expect.any(Object));
    });

    it('✅ TDD: 获取文章列表应传递filters和pageIndex', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      const filters = { categoryId: '1', dateRange: [] as [], text: 'search' };
      await AdminServices.getArticles(filters, 2);

      expect(request.GET).toHaveBeenCalledWith(
        '/admin/getArticles',
        {
          categoryId: '1',
          dateRange: [],
          text: 'search',
          pageIndex: 2,
        }
      );
    });

    it('✅ TDD: 获取文章列表应返回文章数组', async () => {
      const mockArticles = [
        { id: 1, title: 'Article 1' },
        { id: 2, title: 'Article 2' },
      ];

      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: mockArticles,
      });

      const result = await AdminServices.getArticles({}, 1);

      expect(result.data).toEqual(mockArticles);
      expect(result.data).toHaveLength(2);
    });

    it('✅ TDD: 获取文章列表应正确处理空filters', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      const filters: any = {};
      await AdminServices.getArticles(filters, 1);

      expect(request.GET).toHaveBeenCalledWith(
        '/admin/getArticles',
        {
          pageIndex: 1,
        }
      );
    });

    it('✅ TDD: 获取文章列表应支持不同页码', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
        data: [],
      });

      const filters: any = {};
      await AdminServices.getArticles(filters, 5);

      expect(request.GET).toHaveBeenCalledWith(
        '/admin/getArticles',
        {
          pageIndex: 5,
        }
      );
    });
  });

  describe('publishArticle', () => {
    it('✅ TDD: 发布文章应使用POST请求发送到/admin/publishArticle', async () => {
      const articleDto = {
        title: 'Test Article',
        content: 'Test content',
        categoryId: 1,
        textType: 'md' as const,
      };

      vi.mocked(request.POST).mockResolvedValue({
        success: true,
        data: { id: 1, ...articleDto },
      });

      await AdminServices.publishArticle(articleDto);

      expect(request.POST).toHaveBeenCalledWith('/admin/publishArticle', articleDto);
    });

    it('✅ TDD: 发布文章应传递完整的文章数据', async () => {
      const articleDto = {
        title: 'New Article',
        content: 'Content here',
        categoryId: 2,
        textType: 'html' as const,
      };

      vi.mocked(request.POST).mockResolvedValue({
        success: true,
        data: { id: 123 },
      });

      await AdminServices.publishArticle(articleDto);

      expect(request.POST).toHaveBeenCalledWith(
        '/admin/publishArticle',
        {
          title: 'New Article',
          content: 'Content here',
          categoryId: 2,
          textType: 'html',
        }
      );
    });

    it('✅ TDD: 发布文章成功应返回创建的文章', async () => {
      const createdArticle = {
        id: 999,
        title: 'Published',
        content: 'Published content',
        categoryId: 1,
        textType: 'md' as const,
      };

      vi.mocked(request.POST).mockResolvedValue({
        success: true,
        data: createdArticle,
      });

      const result = await AdminServices.publishArticle({
        title: 'Published',
        content: 'Published content',
        categoryId: 1,
        textType: 'md',
      });

      expect(result.data).toEqual(createdArticle);
      expect(result.data.id).toBe(999);
    });

    it('✅ TDD: 发布文章失败时应返回错误信息', async () => {
      vi.mocked(request.POST).mockResolvedValue({
        success: false,
        msg: '发布失败',
        data: null,
      });

      const result = await AdminServices.publishArticle({
        title: 'Failed',
        content: 'Failed content',
        categoryId: 1,
        textType: 'md',
      });

      expect(result.success).toBe(false);
      expect(result.msg).toBe('发布失败');
    });
  });

  describe('deleteArticle', () => {
    it('✅ TDD: 删除文章应使用GET请求传递文章ID', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
      });

      await AdminServices.deleteArticle(123);

      expect(request.GET).toHaveBeenCalledWith('/admin/deleteArticle', { id: 123 });
    });

    it('✅ TDD: 删除文章应正确传递不同的ID', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
      });

      await AdminServices.deleteArticle(456);

      expect(request.GET).toHaveBeenCalledWith('/admin/deleteArticle', { id: 456 });
    });

    it('✅ TDD: 删除文章成功应返回成功响应', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: true,
      });

      const result = await AdminServices.deleteArticle(1);

      expect(result.success).toBe(true);
    });

    it('✅ TDD: 删除不存在的文章应返回失败响应', async () => {
      vi.mocked(request.GET).mockResolvedValue({
        success: false,
        msg: '文章不存在',
      });

      const result = await AdminServices.deleteArticle(99999);

      expect(result.success).toBe(false);
      expect(result.msg).toBe('文章不存在');
    });
  });

  describe('addCategory', () => {
    it('✅ TDD: 添加分类应使用PUT请求', async () => {
      vi.mocked(request.PUT).mockResolvedValue({
        success: true,
        data: { id: 1, name: 'Tech' },
      });

      await AdminServices.addCategory(1, 2, 'Tech');

      expect(request.PUT).toHaveBeenCalledWith(
        '/admin/addCategory',
        { fatherId: 1, level: 2, categoryName: 'Tech' }
      );
    });

    it('✅ TDD: 添加分类应传递fatherId、level和categoryName参数', async () => {
      vi.mocked(request.PUT).mockResolvedValue({
        success: true,
        data: { id: 2 },
      });

      await AdminServices.addCategory(5, 3, 'Programming');

      expect(request.PUT).toHaveBeenCalledWith(
        '/admin/addCategory',
        {
          fatherId: 5,
          level: 3,
          categoryName: 'Programming',
        }
      );
    });

    it('✅ TDD: 添加顶级分类时fatherId应为null', async () => {
      vi.mocked(request.PUT).mockResolvedValue({
        success: true,
        data: { id: 10 },
      });

      await AdminServices.addCategory(null, 1, 'Technology');

      expect(request.PUT).toHaveBeenCalledWith(
        '/admin/addCategory',
        {
          fatherId: null,
          level: 1,
          categoryName: 'Technology',
        }
      );
    });

    it('✅ TDD: 添加子分类应正确设置level', async () => {
      vi.mocked(request.PUT).mockResolvedValue({
        success: true,
        data: { id: 15 },
      });

      await AdminServices.addCategory(1, 2, 'Frontend');

      expect(request.PUT).toHaveBeenCalledWith(
        '/admin/addCategory',
        {
          fatherId: 1,
          level: 2,
          categoryName: 'Frontend',
        }
      );
    });

    it('✅ TDD: 添加分类成功应返回创建的分类', async () => {
      const newCategory = {
        id: 100,
        name: 'New Category',
        fatherId: null,
        level: 1,
      };

      vi.mocked(request.PUT).mockResolvedValue({
        success: true,
        data: newCategory,
      });

      const result = await AdminServices.addCategory(null, 1, 'New Category');

      expect(result.data).toEqual(newCategory);
      expect((result.data as any).id).toBe(100);
    });

    it('✅ TDD: 添加分类失败时应返回错误信息', async () => {
      vi.mocked(request.PUT).mockResolvedValue({
        success: false,
        msg: '分类名称已存在',
        data: null,
      });

      const result = await AdminServices.addCategory(1, 2, 'Tech');

      expect(result.success).toBe(false);
      expect(result.msg).toBe('分类名称已存在');
    });
  });
});
