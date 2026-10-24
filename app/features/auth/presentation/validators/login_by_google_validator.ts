import type { LoginByGoogleParam } from '../../application/params/login_by_google_param';

export class LoginByGoogleValidator {
  static validate(param: LoginByGoogleParam): string | null {
    if (!param.idToken?.trim()) {
      return 'Le jeton Google est obligatoire.';
    }
    return null;
  }
}
