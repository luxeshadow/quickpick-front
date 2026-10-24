import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { DeleteAccessLinkParam } from '../../application/params/delete_access_link_param';
import type { DeleteAccessLinkRepository } from '../../domain/repository/delete_access_link_repository';
import { DeleteAccessLinkDatasource } from '../datasources/delete_access_link_datasource';
export class DeleteAccessLinkRepositoryImpl implements DeleteAccessLinkRepository {
  constructor(private readonly datasource: DeleteAccessLinkDatasource = new DeleteAccessLinkDatasource()) {}
  async deleteAccessLink(param: DeleteAccessLinkParam): Promise<string | Failure> {
    try { return await this.datasource.deleteAccessLink(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
