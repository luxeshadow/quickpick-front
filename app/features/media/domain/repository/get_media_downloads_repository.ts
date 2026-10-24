import type { Failure } from '../../../../core/error/failure';
import type { MediaDownload } from '../entities/media_download';
import type { GetMediaDownloadsParam } from '../../application/params/get_media_downloads_param';
export interface GetMediaDownloadsRepository { getMediaDownloads(param: GetMediaDownloadsParam): Promise<MediaDownload[] | Failure>; }
