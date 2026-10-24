import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { DeleteAccessLinkParam } from '../../application/params/delete_access_link_param';
export class DeleteAccessLinkDatasource {
  async deleteAccessLink(param: DeleteAccessLinkParam): Promise<string> {
    try {
      const route = ApiRoutes.accessLink.replace('{link_id}', String(param.linkId));
      const response = await fetch(LaravelEndpoint.url(route), {
        method: 'DELETE',
        headers: { ...LaravelEndpoint.headers(param.token) },
        
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de charger le lien d’accès.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return data.message;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
