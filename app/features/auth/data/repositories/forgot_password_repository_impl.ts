import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { ForgotPasswordParam } from '../../application/params/forgot_password_param';
import type { ForgotPasswordRepository } from '../../domain/repository/forgot_password_repository';
import { ForgotPasswordDatasource } from '../datasources/forgot_password_datasource';

export class ForgotPasswordRepositoryImpl implements ForgotPasswordRepository {
  private datasource: ForgotPasswordDatasource;

  constructor(datasource: ForgotPasswordDatasource = new ForgotPasswordDatasource()) {
    this.datasource = datasource;
  }

  async forgotPassword(param: ForgotPasswordParam): Promise<string | Failure> {
    try {
      return await this.datasource.forgotPassword(param);
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
