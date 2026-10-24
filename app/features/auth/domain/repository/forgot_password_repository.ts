import type { Failure } from '../../../../core/error/failure';
import type { ForgotPasswordParam } from '../../application/params/forgot_password_param';

export interface ForgotPasswordRepository {
  forgotPassword(param: ForgotPasswordParam): Promise<string | Failure>;
}
