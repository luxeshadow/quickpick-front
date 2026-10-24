import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import { EventModel } from '../../../event/data/model/event_model';
import type { DirectMediaUploadParam } from '../../application/params/direct_media_upload_param';

export class DirectMediaUploadDatasource {
  async upload(param: DirectMediaUploadParam) {
    try {
      const body = new FormData();
      for (const file of param.files) body.append('files[]', file);
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.uploadMedia + '/' + param.eventId + '/media'), {
        method: 'POST', headers: LaravelEndpoint.headers(param.token), body,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new ApiException(data?.message || 'Impossible d’envoyer les médias.', response.status);
      if (!['success', 'partial_failure'].includes(data?.status) || !data?.event || !Array.isArray(data.uploaded_files) || !Array.isArray(data.failed_files)) {
        throw new ApiException('La réponse du serveur est invalide.');
      }
      return {
        message: String(data.message),
        event: EventModel.fromJson(data.event),
        uploadedFiles: data.uploaded_files as string[],
        failedFiles: data.failed_files as { filename: string; error: string }[],
      };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Envoi non confirmé. Vérifiez les médias de l’événement avant de réessayer.');
    }
  }
}
