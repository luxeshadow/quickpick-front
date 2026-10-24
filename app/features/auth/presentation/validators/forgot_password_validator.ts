import type { ForgotPasswordParam } from '../../application/params/forgot_password_param';

export function validateForgotPassword(params: ForgotPasswordParam) {
  if (!params.email) {
    return 'L’adresse e-mail est obligatoire.';
  }

  if (!params.email.includes('@')) {
    return 'Saisissez une adresse e-mail valide.';
  }

  return null;
}