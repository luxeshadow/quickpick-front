import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { DirectMediaUploadParam } from '../../application/params/direct_media_upload_param';
import type { DirectMediaUploadRepository, DirectMediaUploadResult } from '../../domain/repository/direct_media_upload_repository';
import { DirectMediaUploadDatasource } from '../datasources/direct_media_upload_datasource';

export class DirectMediaUploadRepositoryImpl implements DirectMediaUploadRepository {
  constructor(private datasource = new DirectMediaUploadDatasource()) {}
  async upload(param: DirectMediaUploadParam): Promise<DirectMediaUploadResult | Failure> {
    try {
      const result = await this.datasource.upload(param);
      return { ...result, event: result.event.toEntity() };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
