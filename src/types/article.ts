import { Category } from './category';

/**
 * Article entity
 */
export interface Article {
  id: number;
  category_id: number;
  title: string;
  description: string;
  content?: string;
  text_type: 'md' | 'html';
  category?: Category;
  create_time?: number;
  update_time?: number;
}

/**
 * Filters for article list
 */
export interface ArticleFilters {
  categoryId: string;
  dateRange: [number, number] | [];
  text: string;
}

/**
 * DTO for creating/updating articles
 */
export interface CreateArticleDto {
  title: string;
  categoryId: number;
  content: string;
  textType: 'md' | 'html';
  id?: number;
}
