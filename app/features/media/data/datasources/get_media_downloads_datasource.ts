import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { MediaDownload } from '../../domain/entities/media_download';
import type { GetMediaDownloadsParam } from '../../application/params/get_media_downloads_param';
export class GetMediaDownloadsDatasource {
  async getMediaDownloads(param: GetMediaDownloadsParam): Promise<MediaDownload[]> {
    
    try {
      
      const route = ApiRoutes.publicMediaDownloads.replace('{token}', encodeURIComponent(param.token));
      const response = await fetch(LaravelEndpoint.url(route), {
        method: 'POST', headers: { ...LaravelEndpoint.headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ media_ids: param.mediaIds }),
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'La requête a échoué. Veuillez réessayer.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return data.downloads;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
