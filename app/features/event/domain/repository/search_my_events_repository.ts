import type { Failure } from '../../../../core/error/failure';
import type { Event } from '../entities/event';
import type { SearchMyEventsParam } from '../../application/params/search_my_events_param';
export interface SearchMyEventsRepository {
  searchMyEvents(param: SearchMyEventsParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure>;
}
