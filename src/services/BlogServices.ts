import {DELETE, GET} from '../utils/request';

function getCategories(fatherId: any) {
  return GET('/category/getCategories', { fatherId });
}

function getAllCategories() {
  return GET('/category/getAllCategories');
}

function getArticleList(key: any) {
  return GET('/article/getArticleList', { key });
}

function getArticleDetail(articleId: any) {
  return GET('/article/getArticleDetail', { articleId });
}

function getArticleRecommendLinks(articleId: any) {
  return GET('/article/getArticleRecommendLinks', { articleId });
}

function deleteCategory(categoryId: any) {
  return DELETE('/admin/deleteCategory', { categoryId });
}

export default {
  getCategories,
  getAllCategories,
  getArticleList,
  getArticleDetail,
  getArticleRecommendLinks,
  deleteCategory
};
