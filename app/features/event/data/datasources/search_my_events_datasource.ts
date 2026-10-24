import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { SearchMyEventsParam } from '../../application/params/search_my_events_param';
import { EventModel } from '../model/event_model';
import type { EventJson } from '../model/event_model';

export class SearchMyEventsDatasource {
  async searchMyEvents(param: SearchMyEventsParam) {
    try {
      const route = ApiRoutes.searchMyEvents + '?search=' + encodeURIComponent(param.search.trim()) + '&page=' + param.page;
      const response = await fetch(LaravelEndpoint.url(route), { headers: LaravelEndpoint.headers(param.token) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new ApiException(typeof data?.message === 'string' ? data.message : 'Impossible de charger les événements.', response.status);
      const items = data?.events?.data;
      if (data?.status !== 'success' || !Array.isArray(items)
        || items.some(item => !item || typeof item.id !== 'number' || typeof item.name !== 'string')) {
        throw new ApiException('La réponse du serveur est invalide.');
      }
      if (!Number.isInteger(data.events.current_page) || data.events.current_page < 1
        || !Number.isInteger(data.events.last_page) || data.events.last_page < 1
        || !Number.isInteger(data.events.total) || data.events.total < 0) {
        throw new ApiException('La pagination du serveur est invalide.');
      }
      return {
        events: items.map((item: EventJson) => EventModel.fromJson(item)),
        currentPage: data.events.current_page,
        lastPage: data.events.last_page,
        total: data.events.total,
      };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
