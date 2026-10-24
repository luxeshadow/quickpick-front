import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { AccessLink } from '../../domain/entities/access_link';
import type { UpdateAccessLinkParam } from '../../application/params/update_access_link_param';
import type { UpdateAccessLinkRepository } from '../../domain/repository/update_access_link_repository';
import { UpdateAccessLinkDatasource } from '../datasources/update_access_link_datasource';
export class UpdateAccessLinkRepositoryImpl implements UpdateAccessLinkRepository {
  constructor(private readonly datasource: UpdateAccessLinkDatasource = new UpdateAccessLinkDatasource()) {}
  async updateAccessLink(param: UpdateAccessLinkParam): Promise<AccessLink | Failure> {
    try { return await this.datasource.updateAccessLink(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
