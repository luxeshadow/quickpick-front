import type { Failure } from '../../../../core/error/failure';
import type { Event } from '../entities/event';
import type { GetMyEventsParam } from '../../application/params/get_my_events_param';
export interface GetMyEventsRepository {
  getMyEvents(param: GetMyEventsParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure>;
}
