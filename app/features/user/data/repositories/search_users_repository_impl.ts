import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { UserPage } from '../../domain/repository/get_users_repository';
import type { SearchUsersParam } from '../../application/params/search_users_param';
import type { SearchUsersRepository } from '../../domain/repository/search_users_repository';
import { SearchUsersDatasource } from '../datasources/search_users_datasource';
export class SearchUsersRepositoryImpl implements SearchUsersRepository {
  constructor(private readonly datasource: SearchUsersDatasource = new SearchUsersDatasource()) {}
  async searchUsers(param: SearchUsersParam): Promise<UserPage | Failure> {
    try {
      const result = await this.datasource.searchUsers(param);
      return { users: result.users.map(user => user.toEntity()), pagination: result.pagination };
    }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
