import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { AccessLink } from '../../domain/entities/access_link';
import type { GetEventAccessLinksParam } from '../../application/params/get_event_access_links_param';
import type { GetEventAccessLinksRepository } from '../../domain/repository/get_event_access_links_repository';
import { GetEventAccessLinksDatasource } from '../datasources/get_event_access_links_datasource';
export class GetEventAccessLinksRepositoryImpl implements GetEventAccessLinksRepository {
  constructor(private readonly datasource: GetEventAccessLinksDatasource = new GetEventAccessLinksDatasource()) {}
  async getEventAccessLinks(param: GetEventAccessLinksParam): Promise<AccessLink[] | Failure> {
    try { return await this.datasource.getEventAccessLinks(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
