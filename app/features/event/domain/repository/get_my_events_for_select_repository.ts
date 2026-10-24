import type { Failure } from '../../../../core/error/failure';
import type { GetMyEventsForSelectParam } from '../../application/params/get_my_events_for_select_param';
export interface GetMyEventsForSelectRepository {
  getMyEventsForSelect(param: GetMyEventsForSelectParam): Promise<{ id: number; name: string; status: 'active' | 'inactive' }[] | Failure>;
}
