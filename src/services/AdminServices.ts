import md5 from 'md5';
import {GET, POST, PUT} from '../utils/request';

function login(formData: any) {
  const params = {
    ...formData,
    password: md5(formData.password)
  };
  return POST('/admin/login', params);
}

function getArticles(option: any, pageIndex: number) {
  const params = { ...option, pageIndex };
  return GET(`/admin/getArticles`, params);
}

function publishArticle(body: any) {
  return POST('/admin/publishArticle', { ...body });
}

function deleteArticle(id: any) {
  return GET('/admin/deleteArticle', { id });
}

function addCategory(fatherId: any, level: any, categoryName: any) {
  return PUT('/admin/addCategory', { fatherId, level, categoryName });
}

export default {
  login,
  getArticles,
  publishArticle,
  deleteArticle,
  addCategory
};
