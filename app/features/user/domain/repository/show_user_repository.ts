import type { Failure } from '../../../../core/error/failure';
import type { User } from '../entities/user';
import type { ShowUserParam } from '../../application/params/show_user_param';
export interface ShowUserRepository { showUser(param: ShowUserParam): Promise<User | Failure>; }
