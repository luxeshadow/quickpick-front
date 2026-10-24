import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { UserPage } from '../../domain/repository/get_users_repository';
import type { GetUsersParam } from '../../application/params/get_users_param';
import type { GetUsersRepository } from '../../domain/repository/get_users_repository';
import { GetUsersDatasource } from '../datasources/get_users_datasource';
export class GetUsersRepositoryImpl implements GetUsersRepository {
  constructor(private readonly datasource: GetUsersDatasource = new GetUsersDatasource()) {}
  async getUsers(param: GetUsersParam): Promise<UserPage | Failure> {
    try {
      const result = await this.datasource.getUsers(param);
      return { users: result.users.map(user => user.toEntity()), pagination: result.pagination };
    }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
