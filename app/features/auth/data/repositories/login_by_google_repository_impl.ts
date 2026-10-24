import { ApiException } from '../../../../core/error/exception';
import { Failure } from '../../../../core/error/failure';
import type { LoginByGoogleParam } from '../../application/params/login_by_google_param';
import type { LoginByGoogleRepository, LoginByGoogleResponse } from '../../domain/repository/login_by_google_repository';
import { LoginByGoogleDatasource } from '../datasources/login_by_google_datasource';

export class LoginByGoogleRepositoryImpl implements LoginByGoogleRepository {
  constructor(private readonly datasource: LoginByGoogleDatasource = new LoginByGoogleDatasource()) {}

  async loginByGoogle(params: LoginByGoogleParam): Promise<LoginByGoogleResponse | Failure> {
    try {
      const data = await this.datasource.loginByGoogle(params);
      if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'success'
        || !('token' in data) || typeof data.token !== 'string' || !data.token.trim()
        || !('user' in data) || !data.user || typeof data.user !== 'object' || Array.isArray(data.user)) {
        return new Failure('La réponse du serveur est invalide.');
      }
      return {
        token: data.token,
        user: data.user as Record<string, unknown>,
        message: 'message' in data && typeof data.message === 'string' ? data.message : 'Connexion Google réussie.',
      };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
