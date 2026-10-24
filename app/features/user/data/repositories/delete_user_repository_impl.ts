import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { DeleteUserParam } from '../../application/params/delete_user_param';
import type { DeleteUserRepository } from '../../domain/repository/delete_user_repository';
import { DeleteUserDatasource } from '../datasources/delete_user_datasource';
export class DeleteUserRepositoryImpl implements DeleteUserRepository {
  constructor(private readonly datasource: DeleteUserDatasource = new DeleteUserDatasource()) {}
  async deleteUser(param: DeleteUserParam): Promise<string | Failure> {
    try { return await this.datasource.deleteUser(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
