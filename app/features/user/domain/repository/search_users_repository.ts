import type { Failure } from '../../../../core/error/failure';
import type { UserPage } from './get_users_repository';
import type { SearchUsersParam } from '../../application/params/search_users_param';
export interface SearchUsersRepository { searchUsers(param: SearchUsersParam): Promise<UserPage | Failure>; }
