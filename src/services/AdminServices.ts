import md5 from 'md5';
import { GET, POST, PUT } from '@/utils/request';
import { ApiResponse, Article, ArticleFilters, CreateArticleDto } from '@/types';

interface LoginFormData {
  username: string;
  password: string;
}

function login(formData: LoginFormData) {
  const params = {
    ...formData,
    password: md5(formData.password),
  };
  return POST('/admin/login', params) as Promise<ApiResponse<any>>;
}

function getArticles(option: ArticleFilters, pageIndex: number) {
  const params = { ...option, pageIndex };
  return GET(`/admin/getArticles`, params) as Promise<ApiResponse<Article[]>>;
}

function publishArticle(body: CreateArticleDto) {
  return POST('/admin/publishArticle', { ...body }) as Promise<ApiResponse<Article>>;
}

function deleteArticle(id: number) {
  return GET('/admin/deleteArticle', { id }) as Promise<ApiResponse<void>>;
}

function addCategory(fatherId: number | null, level: number, categoryName: string) {
  return PUT('/admin/addCategory', { fatherId, level, categoryName }) as Promise<ApiResponse<unknown>>;
}

const adminServices = {
  login,
  getArticles,
  publishArticle,
  deleteArticle,
  addCategory,
};

export default adminServices;
