import type { Failure } from '../../../../core/error/failure';
import type { MyStats } from '../entities/my_stats';
import type { GetMyStatsParam } from '../../application/params/get_my_stats_param';

export interface GetMyStatsRepository {
  getMyStats(param: GetMyStatsParam): Promise<MyStats | Failure>;
}
