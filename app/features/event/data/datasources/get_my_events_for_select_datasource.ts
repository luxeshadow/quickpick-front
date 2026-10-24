import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { GetMyEventsForSelectParam } from '../../application/params/get_my_events_for_select_param';
export class GetMyEventsForSelectDatasource {
  async getMyEventsForSelect(param: GetMyEventsForSelectParam): Promise<{ id: number; name: string; status: 'active' | 'inactive' }[]> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.myEventsForSelect), { headers: LaravelEndpoint.headers(param.token) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new ApiException(typeof data?.message === 'string' ? data.message : 'Impossible de charger les événements.', response.status);
      if (data?.status !== 'success' || !Array.isArray(data.events) || data.events.some((event: { id: number; name: string; status: string } | null) => !event || typeof event.id !== 'number' || typeof event.name !== 'string' || !['active','inactive'].includes(event.status))) throw new ApiException('La réponse du serveur est invalide.');
      return data.events.map((event: { id: number; name: string; status: 'active' | 'inactive' }) => ({ id: event.id, name: event.name, status: event.status }));
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
