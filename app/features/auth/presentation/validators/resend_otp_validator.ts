import type { ResendOtpParam } from '../../application/params/resend_otp_param';

export function validateResendOtp(params: ResendOtpParam) {
  if (!params.email) {
    return 'L’adresse e-mail est obligatoire.';
  }

  if (!params.email.includes('@')) {
    return 'Saisissez une adresse e-mail valide.';
  }

  return null;
}