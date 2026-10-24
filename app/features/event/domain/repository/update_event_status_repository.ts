import type { Event } from '../entities/event';
import type { Failure } from '../../../../core/error/failure';
import type { UpdateEventStatusParam } from '../../application/params/update_event_status_param';

export interface UpdateEventStatusRepository {
  updateEventStatus(param: UpdateEventStatusParam): Promise<Event | Failure>;
}
