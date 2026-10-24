import type { VerifyOtpParam } from '../../application/params/verify_otp_param';

export class VerifyOtpValidator {
  static validate(param: VerifyOtpParam): string | null {
    if (!param.email?.trim()) return 'L’adresse e-mail est obligatoire.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(param.email.trim())) return 'Saisissez une adresse e-mail valide.';
    if (!/^[0-9]{6}$/.test(param.code)) return 'Saisissez le code à 6 chiffres.';
    return null;
  }
}
