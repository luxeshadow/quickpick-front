import type { Failure } from '../../../../core/error/failure';
import type { Event } from '../entities/event';
import type { GetMyEventsByStatusParam } from '../../application/params/get_my_events_by_status_param';
export interface GetMyEventsByStatusRepository {
  getMyEventsByStatus(param: GetMyEventsByStatusParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure>;
}
