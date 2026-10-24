import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { AccessLink } from '../../domain/entities/access_link';
import type { ShowAccessLinkParam } from '../../application/params/show_access_link_param';
import type { ShowAccessLinkRepository } from '../../domain/repository/show_access_link_repository';
import { ShowAccessLinkDatasource } from '../datasources/show_access_link_datasource';
export class ShowAccessLinkRepositoryImpl implements ShowAccessLinkRepository {
  constructor(private readonly datasource: ShowAccessLinkDatasource = new ShowAccessLinkDatasource()) {}
  async showAccessLink(param: ShowAccessLinkParam): Promise<AccessLink | Failure> {
    try { return await this.datasource.showAccessLink(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
