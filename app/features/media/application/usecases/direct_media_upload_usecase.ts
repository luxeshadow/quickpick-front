import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { DirectMediaUploadParam } from '../params/direct_media_upload_param';
import type { DirectMediaUploadRepository, DirectMediaUploadResult } from '../../domain/repository/direct_media_upload_repository';
import { validateDirectMediaUpload } from '../../presentation/validators/direct_media_upload_validator';

export class DirectMediaUploadUseCase implements UseCase<DirectMediaUploadResult, DirectMediaUploadParam> {
  constructor(private repository: DirectMediaUploadRepository) {}
  async execute(param: DirectMediaUploadParam): Promise<DirectMediaUploadResult | Failure> {
    const error = validateDirectMediaUpload(param);
    if (error) return new Failure(error);
    return await this.repository.upload(param);
  }
}
