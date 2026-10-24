import type { Failure } from '../../../../core/error/failure';
import type { RegisterParam } from '../../application/params/register_param';

export interface RegisterRepository {
  register(params: RegisterParam): Promise<{ email: string; message: string } | Failure>;
}
