import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { MyStats } from '../../domain/entities/my_stats';
import type { GetMyStatsParam } from '../../application/params/get_my_stats_param';
import type { GetMyStatsRepository } from '../../domain/repository/get_my_stats_repository';
import { GetMyStatsDatasource } from '../datasources/get_my_stats_datasource';

export class GetMyStatsRepositoryImpl implements GetMyStatsRepository {
  constructor(private readonly datasource: GetMyStatsDatasource = new GetMyStatsDatasource()) {}

  async getMyStats(param: GetMyStatsParam): Promise<MyStats | Failure> {
    try {
      const stats = await this.datasource.getMyStats(param);
      return stats.toEntity();
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
