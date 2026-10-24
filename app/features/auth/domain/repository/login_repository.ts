import type { Failure } from '../../../../core/error/failure';
import type { LoginParam } from '../../application/params/login_param';

export interface LoginRepository {
  login(params: LoginParam): Promise<{ email: string; message: string } | Failure>;
}
