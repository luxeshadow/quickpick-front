import { EventModel } from '../model/event_model';
import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { ShowEventParam } from '../../application/params/show_event_param';
export class ShowEventDatasource {
  async showEvent(param: ShowEventParam): Promise<EventModel> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.showEvent + '/' + param.id), { headers: LaravelEndpoint.headers(param.token) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new ApiException(typeof data?.message === 'string' ? data.message : 'Impossible de charger les événements.', response.status);
      if (data?.status !== 'success' || typeof data.event?.id !== 'number' || typeof data.event?.name !== 'string' || !['active','inactive'].includes(data.event?.status)) throw new ApiException('La réponse du serveur est invalide.');
      return EventModel.fromJson(data.event);
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
