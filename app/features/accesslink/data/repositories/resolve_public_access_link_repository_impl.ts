import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { PublicAccessLink } from '../../domain/entities/access_link';
import type { ResolvePublicAccessLinkParam } from '../../application/params/resolve_public_access_link_param';
import type { ResolvePublicAccessLinkRepository } from '../../domain/repository/resolve_public_access_link_repository';
import { ResolvePublicAccessLinkDatasource } from '../datasources/resolve_public_access_link_datasource';
export class ResolvePublicAccessLinkRepositoryImpl implements ResolvePublicAccessLinkRepository {
  constructor(private readonly datasource: ResolvePublicAccessLinkDatasource = new ResolvePublicAccessLinkDatasource()) {}
  async resolvePublicAccessLink(param: ResolvePublicAccessLinkParam): Promise<PublicAccessLink | Failure> {
    try { return await this.datasource.resolvePublicAccessLink(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
