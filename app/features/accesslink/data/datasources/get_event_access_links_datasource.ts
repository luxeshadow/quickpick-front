import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { AccessLink } from '../../domain/entities/access_link';
import { AccessLinkModel } from '../model/access_link_model';
import type { AccessLinkJson } from '../model/access_link_model';
import type { GetEventAccessLinksParam } from '../../application/params/get_event_access_links_param';
export class GetEventAccessLinksDatasource {
  async getEventAccessLinks(param: GetEventAccessLinksParam): Promise<AccessLink[]> {
    try {
      const route = ApiRoutes.eventAccessLinks.replace('{event_id}', String(param.eventId));
      const response = await fetch(LaravelEndpoint.url(route), {
        method: 'GET',
        headers: { ...LaravelEndpoint.headers(param.token) },
        
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de charger le lien d’accès.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return data.access_links.map((link: AccessLinkJson) => AccessLinkModel.fromJson(link).toEntity());
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
