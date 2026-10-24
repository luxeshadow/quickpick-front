import type { ResetPasswordParam } from '../../application/params/reset_password_param';

export function validateResetPassword(param: ResetPasswordParam): string | null {
  if (!param.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(param.email)) {
    return 'Le lien de réinitialisation ne contient pas une adresse e-mail valide.';
  }
  if (!param.token || !/^[a-f0-9]{64}$/i.test(param.token)) {
    return 'Le lien de réinitialisation est invalide.';
  }
  if (!param.password) return 'Le mot de passe est obligatoire.';
  if (param.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (!param.confirmPassword) return 'La confirmation du mot de passe est obligatoire.';
  if (param.password !== param.confirmPassword) return 'La confirmation du mot de passe ne correspond pas.';
  return null;
}
