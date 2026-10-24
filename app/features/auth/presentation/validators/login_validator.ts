import type { LoginParam } from '../../application/params/login_param';

export class LoginValidator {
  static validate(param: LoginParam): string | null {
    if (!param.email?.trim()) {
      return 'L’adresse e-mail est obligatoire.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(param.email.trim())) {
      return 'Saisissez une adresse e-mail valide.';
    }
    if (!param.password?.trim()) {
      return 'Le mot de passe est obligatoire.';
    }
    return null;
  }
}