import type { Event } from '../entities/event';
import type { Failure } from '../../../../core/error/failure';
import type { ShowEventParam } from '../../application/params/show_event_param';
export interface ShowEventRepository {
  showEvent(param: ShowEventParam): Promise<Event | Failure>;
}
