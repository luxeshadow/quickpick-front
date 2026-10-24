import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { AccessLink } from '../../domain/entities/access_link';
import { AccessLinkModel } from '../model/access_link_model';
import type { GenerateAccessLinkParam } from '../../application/params/generate_access_link_param';
export class GenerateAccessLinkDatasource {
  async generateAccessLink(param: GenerateAccessLinkParam): Promise<AccessLink> {
    try {
      const route = ApiRoutes.eventAccessLinks.replace('{event_id}', String(param.eventId));
      const response = await fetch(LaravelEndpoint.url(route), {
        method: 'POST',
        headers: { ...LaravelEndpoint.headers(param.token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: param.expiresAt, max_scans: param.maxScans }),
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de charger le lien d’accès.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return AccessLinkModel.fromJson(data.access_link).toEntity();
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
