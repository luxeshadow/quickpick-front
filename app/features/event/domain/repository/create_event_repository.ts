import type { Event } from '../entities/event';
import type { Failure } from '../../../../core/error/failure';
import type { CreateEventParam } from '../../application/params/create_event_param';

export interface CreateEventRepository {
  createEvent(param: CreateEventParam): Promise<Event | Failure>;
}
