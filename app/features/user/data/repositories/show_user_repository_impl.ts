import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { User } from '../../domain/entities/user';
import type { ShowUserParam } from '../../application/params/show_user_param';
import type { ShowUserRepository } from '../../domain/repository/show_user_repository';
import { ShowUserDatasource } from '../datasources/show_user_datasource';
export class ShowUserRepositoryImpl implements ShowUserRepository {
  constructor(private readonly datasource: ShowUserDatasource = new ShowUserDatasource()) {}
  async showUser(param: ShowUserParam): Promise<User | Failure> {
    try {
      const user = await this.datasource.showUser(param);
      return user.toEntity();
    }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
