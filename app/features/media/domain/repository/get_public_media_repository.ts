import type { Failure } from '../../../../core/error/failure';
import type { PublicMediaPage } from '../entities/public_media';
import type { GetPublicMediaParam } from '../../application/params/get_public_media_param';
export interface GetPublicMediaRepository { getPublicMedia(param: GetPublicMediaParam): Promise<PublicMediaPage | Failure>; }
