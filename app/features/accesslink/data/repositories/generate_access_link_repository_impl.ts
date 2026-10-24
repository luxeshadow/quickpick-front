import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { AccessLink } from '../../domain/entities/access_link';
import type { GenerateAccessLinkParam } from '../../application/params/generate_access_link_param';
import type { GenerateAccessLinkRepository } from '../../domain/repository/generate_access_link_repository';
import { GenerateAccessLinkDatasource } from '../datasources/generate_access_link_datasource';
export class GenerateAccessLinkRepositoryImpl implements GenerateAccessLinkRepository {
  constructor(private readonly datasource: GenerateAccessLinkDatasource = new GenerateAccessLinkDatasource()) {}
  async generateAccessLink(param: GenerateAccessLinkParam): Promise<AccessLink | Failure> {
    try { return await this.datasource.generateAccessLink(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
