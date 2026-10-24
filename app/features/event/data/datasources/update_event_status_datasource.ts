import { EventModel } from '../model/event_model';
import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { UpdateEventStatusParam } from '../../application/params/update_event_status_param';

export class UpdateEventStatusDatasource {
  async updateEventStatus(param: UpdateEventStatusParam): Promise<EventModel> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.updateEvent + '/' + param.id), {
        method: 'PATCH',
        headers: { ...LaravelEndpoint.headers(param.token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: param.status }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const fieldError = data?.errors?.status?.[0];
        const message = typeof fieldError === 'string' ? fieldError
          : typeof data?.message === 'string' ? data.message : 'Impossible de modifier le statut de cet événement.';
        throw new ApiException(message, response.status);
      }
      if (data?.status !== 'success' || typeof data.event?.id !== 'number' || typeof data.event?.name !== 'string' || !['active', 'inactive'].includes(data.event?.status)) {
        throw new ApiException('La réponse du serveur est invalide.');
      }
      return EventModel.fromJson(data.event);
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
