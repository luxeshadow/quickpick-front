import type { RegisterParam } from '../../application/params/register_param';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

export class RegisterValidator {
  static validate(param: RegisterParam): string | null {
    if (!param.fullName?.trim()) {
      return 'Le nom complet est obligatoire.';
    }
    if (!param.email?.trim()) {
      return 'L’adresse e-mail est obligatoire.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(param.email.trim())) {
      return 'Saisissez une adresse e-mail valide.';
    }
    if (!param.phone?.trim()) {
      return 'Le téléphone est obligatoire.';
    }
    const phone = parsePhoneNumberFromString(param.phone.trim(), { defaultCountry: 'CA', extract: false });
    if (!phone?.isValid() || phone.ext) {
      return 'Saisissez un numéro de téléphone valide.';
    }
    if (!param.password?.trim()) {
      return 'Le mot de passe est obligatoire.';
    }
    if (param.password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (!param.confirmPassword?.trim()) {
      return 'La confirmation du mot de passe est obligatoire.';
    }
    if (param.password !== param.confirmPassword) {
      return 'La confirmation du mot de passe ne correspond pas.';
    }
    return null;
  }
}
