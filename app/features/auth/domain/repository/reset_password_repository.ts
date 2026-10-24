import type { Failure } from '../../../../core/error/failure';
import type { ResetPasswordParam } from '../../application/params/reset_password_param';

export interface ResetPasswordRepository {
  resetPassword(param: ResetPasswordParam): Promise<string | Failure>;
}
