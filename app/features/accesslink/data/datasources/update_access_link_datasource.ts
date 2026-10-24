import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { AccessLink } from '../../domain/entities/access_link';
import { AccessLinkModel } from '../model/access_link_model';
import type { UpdateAccessLinkParam } from '../../application/params/update_access_link_param';
export class UpdateAccessLinkDatasource {
  async updateAccessLink(param: UpdateAccessLinkParam): Promise<AccessLink> {
    try {
      const route = ApiRoutes.accessLink.replace('{link_id}', String(param.linkId));
      const response = await fetch(LaravelEndpoint.url(route), {
        method: 'PATCH',
        headers: { ...LaravelEndpoint.headers(param.token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: param.expiresAt, max_scans: param.maxScans, is_active: param.isActive }),
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
