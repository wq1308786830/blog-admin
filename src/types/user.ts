/**
 * User entity for authentication
 */
export interface User extends Record<string, unknown> {
  id: number;
  user_name: string;
  email?: string;
  role?: string;
  token?: string;
}
