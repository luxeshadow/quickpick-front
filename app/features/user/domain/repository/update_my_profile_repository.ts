import type { Failure } from '../../../../core/error/failure';
import type { User } from '../entities/user';

export interface UpdatedProfile {
  user: User;
  message: string;
}
import type { UpdateMyProfileParam } from '../../application/params/update_my_profile_param';
export interface UpdateMyProfileRepository { updateMyProfile(param: UpdateMyProfileParam): Promise<UpdatedProfile | Failure>; }
