import type { Failure } from '../../../../core/error/failure';
import type { User } from '../entities/user';

export interface UserPage {
  users: User[];
  pagination: { current_page: number; last_page: number; per_page: number; total: number };
}
import type { GetUsersParam } from '../../application/params/get_users_param';
export interface GetUsersRepository { getUsers(param: GetUsersParam): Promise<UserPage | Failure>; }
