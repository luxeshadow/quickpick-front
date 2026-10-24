import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { GetPublicMediaParam } from '../../application/params/get_public_media_param';
import type { PublicMediaPage } from '../../domain/entities/public_media';
import type { GetPublicMediaRepository } from '../../domain/repository/get_public_media_repository';
import { GetPublicMediaDatasource } from '../datasources/get_public_media_datasource';
export class GetPublicMediaRepositoryImpl implements GetPublicMediaRepository {
  constructor(private readonly datasource: GetPublicMediaDatasource = new GetPublicMediaDatasource()) {}
  async getPublicMedia(param: GetPublicMediaParam): Promise<PublicMediaPage | Failure> {
    try { return await this.datasource.getPublicMedia(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
