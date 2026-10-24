import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { MediaDownload } from '../../domain/entities/media_download';
import type { GetMediaDownloadsParam } from '../params/get_media_downloads_param';
import type { GetMediaDownloadsRepository } from '../../domain/repository/get_media_downloads_repository';
export class GetMediaDownloadsUseCase implements UseCase<MediaDownload[], GetMediaDownloadsParam> {
  constructor(private readonly repository: GetMediaDownloadsRepository) {}
  async execute(param: GetMediaDownloadsParam): Promise<MediaDownload[] | Failure> {
    if (!param.token.trim()) return new Failure('Le token du lien est manquant.');
    if (!param.mediaIds.length) return new Failure('Sélectionnez au moins une photo.');
    if (param.mediaIds.length > 100) return new Failure('Sélectionnez au maximum 100 photos.');
    return this.repository.getMediaDownloads(param);
  }
}
