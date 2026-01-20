import { DELETE, GET } from '@/utils/request';
import { ApiResponse, Article, Category } from '@/types';

function getCategories(fatherId: number | null) {
  return GET('/category/getCategories', { fatherId }) as Promise<ApiResponse<Category[]>>;
}

function getAllCategories() {
  return GET('/category/getAllCategories') as Promise<ApiResponse<Category[]>>;
}

function getArticleList(key: string) {
  return GET('/article/getArticleList', { key }) as Promise<ApiResponse<Article[]>>;
}

function getArticleDetail(articleId: number) {
  return GET('/article/getArticleDetail', { articleId }) as Promise<ApiResponse<Article>>;
}

function getArticleRecommendLinks(articleId: number) {
  return GET('/article/getArticleRecommendLinks', { articleId }) as Promise<ApiResponse<Article[]>>;
}

function deleteCategory(categoryId: number) {
  return DELETE('/admin/deleteCategory', { categoryId }) as Promise<ApiResponse<void>>;
}

const blogServices = {
  getCategories,
  getAllCategories,
  getArticleList,
  getArticleDetail,
  getArticleRecommendLinks,
  deleteCategory,
};

export default blogServices;
