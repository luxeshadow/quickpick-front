import type { Failure } from '../../../../core/error/failure';
import type { VerifyOtpParam } from '../../application/params/verify_otp_param';

export interface VerifyOtpResponse {
  token: string;
  user: Record<string, unknown>;
  message: string;
}

export interface VerifyOtpRepository {
  verifyOtp(params: VerifyOtpParam): Promise<VerifyOtpResponse | Failure>;
}
