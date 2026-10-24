import { ApiException } from '../../../../core/error/exception';
import { Failure } from '../../../../core/error/failure';
import type { RegisterParam } from '../../application/params/register_param';
import type { RegisterRepository } from '../../domain/repository/register_repository';
import { RegisterDatasource } from '../datasources/register_datasource';

export class RegisterRepositoryImpl implements RegisterRepository {
  constructor(private readonly datasource: RegisterDatasource = new RegisterDatasource()) {}

  async register(params: RegisterParam): Promise<{ email: string; message: string } | Failure> {
    try {
      const data = await this.datasource.register(params);
      if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'success'
        || !('email' in data) || typeof data.email !== 'string' || !data.email.trim()) {
        return new Failure('La réponse du serveur est invalide.');
      }
      return {
        email: data.email.trim(),
        message: 'message' in data && typeof data.message === 'string' ? data.message : 'Compte créé. Un code de vérification a été envoyé.',
      };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
