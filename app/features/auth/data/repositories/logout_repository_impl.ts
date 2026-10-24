import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { LogoutParam } from '../../application/params/logout_param';
import type { LogoutRepository } from '../../domain/repository/logout_repository';
import { LogoutDatasource } from '../datasources/logout_datasource';

export class LogoutRepositoryImpl implements LogoutRepository {
  private datasource: LogoutDatasource;

  constructor(datasource: LogoutDatasource = new LogoutDatasource()) {
    this.datasource = datasource;
  }

  async logout(param: LogoutParam): Promise<void | Failure> {
    try {
      await this.datasource.logout(param);
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
