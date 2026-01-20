import { message } from 'antd';
import { Category, CategoryOption } from '@/types';

/**
 * 展示loading
 * @param isShow 是否展示
 * @param afterClose 关闭后的执行函数
 * @param content loading下的文案
 */
export function loading(isShow = true, content = '正在加载...', afterClose = () => {}) {
  if (isShow) {
    message.loading(content, 300, afterClose);
  } else {
    message.destroy();

    if (afterClose !== undefined) {
      afterClose();
    }
  }
}

/**
 * 展示toast
 * @param afterClose 关闭后的执行函数
 * @param content toast文案
 */
export function toast(content: React.ReactNode, afterClose = undefined) {
  message.info(content, 2, afterClose);
}

/**
 * 将请求参数转换为application/x-www-form-urlencoded的参数形式
 * @param {Record<string, unknown>} obj 请求参数
 * @return {string}
 */
export function parseObj2SearchParams(obj: Record<string, unknown> | null) {
  let searchParams = '';
  if (obj !== null && obj !== undefined) {
    searchParams = Object.keys(obj)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(obj[key]))}`)
      .join('&');
  }

  return searchParams;
}

interface CategoryWithSubCategory extends Category {
  subCategory?: CategoryWithSubCategory[];
}

/**
 * The recursive function to change option's key name.
 * @param data:input option array data.
 * @returns optionData: output option array data.
 */
export const handleOptions = (data: CategoryWithSubCategory[]): CategoryOption[] => {
  const newOptionData: CategoryOption[] = [];
  for (let i = 0; i < data.length; i += 1) {
    const category = data[i];
    if (!category) continue;

    const newItem: CategoryOption = { value: category.id, label: category.name };
    if (category.subCategory && category.subCategory.length) {
      newItem.children = handleOptions(category.subCategory);
    }
    newOptionData.push(newItem);
  }
  return newOptionData;
};
