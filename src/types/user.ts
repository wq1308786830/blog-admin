/**
 * User entity for authentication
 */
export interface User extends Record<string, unknown> {
  id: number;
  username: string;
  email?: string;
  role?: string;
  token?: string;
}
