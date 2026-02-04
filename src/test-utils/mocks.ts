import { vi } from 'vitest';

/**
 * AdminServices Mock
 * 管理员API服务的Mock实现
 */
export const mockAdminServices = {
  login: vi.fn(),
  getArticles: vi.fn(),
  publishArticle: vi.fn(),
  deleteArticle: vi.fn(),
  addCategory: vi.fn(),
};

/**
 * BlogServices Mock
 * 博客API服务的Mock实现
 */
export const mockBlogServices = {
  getCategories: vi.fn(),
  getAllCategories: vi.fn(),
  getArticleList: vi.fn(),
  getArticleDetail: vi.fn(),
  getArticleRecommendLinks: vi.fn(),
  deleteCategory: vi.fn(),
};

// Mock AdminServices模块
vi.mock('@/services/AdminServices', () => ({
  default: mockAdminServices,
}));

// Mock BlogServices模块
vi.mock('@/services/BlogServices', () => ({
  default: mockBlogServices,
}));

/**
 * 重置所有Mock
 * 在每个测试前调用以清理Mock状态
 */
export function resetAllMocks() {
  Object.values(mockAdminServices).forEach((mock) => mock.mockReset?.());
  Object.values(mockBlogServices).forEach((mock) => mock.mockReset?.());
}

/**
 * 设置默认Mock返回值
 * 为常见场景配置默认的Mock行为
 */
export function setupDefaultMocks() {
  // AdminServices默认返回
  mockAdminServices.login.mockResolvedValue({
    success: true,
    data: mockFactories.user(),
  });

  mockAdminServices.getArticles.mockResolvedValue({
    success: true,
    data: { list: [], total: 0 },
  });

  mockAdminServices.publishArticle.mockResolvedValue({
    success: true,
    data: { id: 1 },
  });

  mockAdminServices.deleteArticle.mockResolvedValue({
    success: true,
  });

  mockAdminServices.addCategory.mockResolvedValue({
    success: true,
    data: mockFactories.category(),
  });

  // BlogServices默认返回
  mockBlogServices.getCategories.mockResolvedValue({
    success: true,
    data: [mockFactories.category()],
  });

  mockBlogServices.getAllCategories.mockResolvedValue({
    success: true,
    data: [],
  });

  mockBlogServices.getArticleList.mockResolvedValue({
    success: true,
    data: { list: [], total: 0 },
  });

  mockBlogServices.getArticleDetail.mockResolvedValue({
    success: true,
    data: mockFactories.article(),
  });

  mockBlogServices.getArticleRecommendLinks.mockResolvedValue({
    success: true,
    data: [],
  });

  mockBlogServices.deleteCategory.mockResolvedValue({
    success: true,
  });
}

// 导出mockFactories以便在mocks中使用
import { mockFactories } from './index';
