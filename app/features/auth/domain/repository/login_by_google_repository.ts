import type { Failure } from '../../../../core/error/failure';
import type { LoginByGoogleParam } from '../../application/params/login_by_google_param';

export interface LoginByGoogleResponse {
  token: string;
  user: Record<string, unknown>;
  message: string;
}

export interface LoginByGoogleRepository {
  loginByGoogle(params: LoginByGoogleParam): Promise<LoginByGoogleResponse | Failure>;
}
