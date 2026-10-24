import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { MediaDownload } from '../../domain/entities/media_download';
import type { GetMediaDownloadsParam } from '../../application/params/get_media_downloads_param';
import type { GetMediaDownloadsRepository } from '../../domain/repository/get_media_downloads_repository';
import { GetMediaDownloadsDatasource } from '../datasources/get_media_downloads_datasource';
export class GetMediaDownloadsRepositoryImpl implements GetMediaDownloadsRepository {
  constructor(private readonly datasource: GetMediaDownloadsDatasource = new GetMediaDownloadsDatasource()) {}
  async getMediaDownloads(param: GetMediaDownloadsParam): Promise<MediaDownload[] | Failure> {
    try { return await this.datasource.getMediaDownloads(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
