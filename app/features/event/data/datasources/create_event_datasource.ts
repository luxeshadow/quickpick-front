import { EventModel } from '../model/event_model';
import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { CreateEventParam } from '../../application/params/create_event_param';

export class CreateEventDatasource {
  async createEvent(param: CreateEventParam): Promise<EventModel> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.createEvent), {
        method: 'POST',
        headers: { ...LaravelEndpoint.headers(param.token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: param.name.trim(),
          description: param.description?.trim() || null,
          location: param.location?.trim() || null,
          event_date: param.event_date || null,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const fieldError = data?.errors?.name?.[0] || data?.errors?.description?.[0]
          || data?.errors?.location?.[0] || data?.errors?.event_date?.[0] || data?.errors?.event?.[0];
        const message = typeof fieldError === 'string' ? fieldError
          : typeof data?.message === 'string' ? data.message : 'Impossible de créer cet événement.';
        throw new ApiException(message, response.status);
      }
      if (data?.status !== 'success' || typeof data.event?.id !== 'number' || typeof data.event?.name !== 'string') {
        throw new ApiException('La réponse du serveur est invalide.');
      }
      return EventModel.fromJson(data.event);
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
