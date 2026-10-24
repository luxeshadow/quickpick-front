import type { Event } from '../../../event/domain/entities/event';
import type { Failure } from '../../../../core/error/failure';
import type { DirectMediaUploadParam } from '../../application/params/direct_media_upload_param';

export interface DirectMediaUploadResult {
  message: string;
  event: Event;
  uploadedFiles: string[];
  failedFiles: { filename: string; error: string }[];
}

export interface DirectMediaUploadRepository {
  upload(param: DirectMediaUploadParam): Promise<DirectMediaUploadResult | Failure>;
}
