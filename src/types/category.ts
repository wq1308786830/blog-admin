/**
 * Category entity
 */
export interface Category {
  id: number;
  name: string;
  father_id: number | null;
  level: number;
  children?: Category[];
}

/**
 * Category option for cascader
 */
export interface CategoryOption {
  value: string | number;
  label: string;
  children?: CategoryOption[];
}
