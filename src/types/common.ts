/**
 * Common API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  msg?: string;
}
