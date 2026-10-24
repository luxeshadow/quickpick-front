import type { Failure } from '../../../../core/error/failure';
import type { ResendOtpParam } from '../../application/params/resend_otp_param';

export interface ResendOtpRepository {
  resendOtp(params: ResendOtpParam): Promise<void | Failure>;
}
