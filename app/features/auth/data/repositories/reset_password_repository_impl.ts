import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { ResetPasswordParam } from '../../application/params/reset_password_param';
import type { ResetPasswordRepository } from '../../domain/repository/reset_password_repository';
import { ResetPasswordDatasource } from '../datasources/reset_password_datasource';

export class ResetPasswordRepositoryImpl implements ResetPasswordRepository {
  private datasource: ResetPasswordDatasource;

  constructor(datasource: ResetPasswordDatasource = new ResetPasswordDatasource()) {
    this.datasource = datasource;
  }

  async resetPassword(param: ResetPasswordParam): Promise<string | Failure> {
    try {
      return await this.datasource.resetPassword(param);
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
