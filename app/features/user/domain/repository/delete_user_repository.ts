import type { Failure } from '../../../../core/error/failure';
import type { DeleteUserParam } from '../../application/params/delete_user_param';
export interface DeleteUserRepository { deleteUser(param: DeleteUserParam): Promise<string | Failure>; }
