import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { PublicAccessLink } from '../../domain/entities/access_link';
import type { ResolvePublicAccessLinkParam } from '../../application/params/resolve_public_access_link_param';
export class ResolvePublicAccessLinkDatasource {
  async resolvePublicAccessLink(param: ResolvePublicAccessLinkParam): Promise<PublicAccessLink> {
    try {
      const route = ApiRoutes.publicAccessLink.replace('{token}', encodeURIComponent(param.token));
      const response = await fetch(LaravelEndpoint.url(route), {
        method: 'GET',
        headers: { ...LaravelEndpoint.headers() },
        
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de charger le lien d’accès.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return { expiresAt: data.access_link.expires_at, remainingScans: data.access_link.remaining_scans, event: data.access_link.event };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
