import type { Failure } from '../../../../core/error/failure';
import type { LogoutParam } from '../../application/params/logout_param';

export interface LogoutRepository {
  logout(param: LogoutParam): Promise<void | Failure>;
}
