import axios from 'axios';

import config from '@/helpers/config';
import { loading, parseObj2SearchParams, toast } from '@/utils/tools';

const { prefix } = config;
const TIMEOUT = 3 * 60 * 1000; // 请求超时3min

axios.defaults.baseURL = prefix;
axios.defaults.timeout = TIMEOUT;
axios.defaults.headers.common.Authorization = '111';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

interface RequestOptions {
  method: string;
  body?: string;
}

interface RequestError extends Error {
  errMessage?: string;
}

/**
 * 请求后端返回Promise
 *
 * @param  {string} url       请求api
 * @param  {RequestOptions} options fetch需要的options配置
 * @param  {boolean} [isShowLoading] 是否展示loading
 * @return {Promise}          返回数据，Promise或者undefined
 */
export async function request<T = unknown>(url: string, options: RequestOptions, isShowLoading: boolean): Promise<T> {
  if (isShowLoading) {
    loading(true);
  }

  let response;
  const option = {
    url,
    method: options.method,
    data: options.body,
  };
  try {
    response = await axios(option);
  } catch (e: unknown) {
    const error = e as RequestError;
    loading(false, undefined, () => {
      if (error.errMessage) {
        return toast(error.errMessage);
      }
      return toast('网络错误～');
    });
    throw error;
  }

  if (isShowLoading) {
    loading(false);
  }
  return response as T;
}

/**
 * 请求发送前的全局处理
 */
axios.interceptors.request.use(
  (conf) => conf,
  (error) => Promise.reject(error)
);

/**
 * 请求返回的全局处理
 */
axios.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response);
  },
  (error) => Promise.reject(error)
);

/**
 * GET请求，注意请求参数直接缀到url地址
 * @param url 请求的url
 * @param {Record<string, unknown>} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<T>} 返回结果
 * @constructor
 */
export function GET<T = unknown>(url: string, params: Record<string, unknown> | null = null, showLoading = false): Promise<T> {
  let searchParams = parseObj2SearchParams(params);
  searchParams = searchParams === '' ? searchParams : `?${searchParams}`;

  const options: RequestOptions = {
    method: 'GET',
  };

  return request<T>(`${url}${searchParams}`, options, showLoading);
}

/**
 * POST请求
 * @param url 请求的url
 * @param {Record<string, unknown>} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<T>} 返回结果
 * @constructor
 */
export function POST<T = unknown>(url: string, params: Record<string, unknown> | null = null, showLoading = false): Promise<T> {
  const searchParams = parseObj2SearchParams(params);

  const options: RequestOptions = {
    method: 'POST',
    body: searchParams,
  };

  return request<T>(url, options, showLoading);
}

/**
 * PUT请求
 * @param url 请求的url
 * @param {Record<string, unknown>} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<T>} 返回结果
 * @constructor
 */
export function PUT<T = unknown>(url: string, params: Record<string, unknown> | null = null, showLoading = false): Promise<T> {
  const searchParams = parseObj2SearchParams(params);

  const options: RequestOptions = {
    method: 'PUT',
    body: searchParams,
  };

  return request<T>(url, options, showLoading);
}

/**
 * DELETE请求
 * @param url 请求的url
 * @param {Record<string, unknown>} params 请求参数
 * @param showLoading 是否展示loading
 * @returns {Promise<T>} 返回结果
 * @constructor
 */
export function DELETE<T = unknown>(url: string, params: Record<string, unknown> | null = null, showLoading = false): Promise<T> {
  let searchParams = parseObj2SearchParams(params);
  searchParams = searchParams === '' ? searchParams : `?${searchParams}`;

  const options: RequestOptions = {
    method: 'DELETE',
  };
  return request<T>(`${url}${searchParams}`, options, showLoading);
}
