import { ApiException } from '../../../../core/error/exception';
import { Failure } from '../../../../core/error/failure';
import type { LoginParam } from '../../application/params/login_param';
import type { LoginRepository } from '../../domain/repository/login_repository';
import { LoginDatasource } from '../datasources/login_datasource';

export class LoginRepositoryImpl implements LoginRepository {
  constructor(private readonly datasource: LoginDatasource = new LoginDatasource()) {}

  async login(params: LoginParam): Promise<{ email: string; message: string } | Failure> {
    try {
      const data = await this.datasource.login(params);
      if (!data || data.status !== 'success' || typeof data.email !== 'string' || !data.email.trim()) {
        return new Failure('La réponse du serveur est invalide.');
      }
      return {
        email: data.email.trim(),
        message: typeof data.message === 'string' ? data.message : 'Un code de vérification a été envoyé.',
      };
    } catch (error) {
      if (error instanceof ApiException) {
        return new Failure(error.message);
      }

      return new Failure('Une erreur inattendue est survenue.');
    }
  }
}
