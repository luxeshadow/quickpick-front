import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { GetPublicMediaParam } from '../../application/params/get_public_media_param';
import type { PublicMediaPage } from '../../domain/entities/public_media';
export class GetPublicMediaDatasource {
  async getPublicMedia(param: GetPublicMediaParam): Promise<PublicMediaPage> {
    try {
      let route = ApiRoutes.publicAccessLinkMedia.replace('{token}', encodeURIComponent(param.token)) + '?per_page=30';
      if (param.cursor) route += '&cursor=' + encodeURIComponent(param.cursor);
      const response = await fetch(LaravelEndpoint.url(route), { headers: LaravelEndpoint.headers() });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de charger la galerie.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return { media: data.media, pagination: data.pagination };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
