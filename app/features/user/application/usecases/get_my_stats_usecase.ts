import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { MyStats } from '../../domain/entities/my_stats';
import type { GetMyStatsParam } from '../params/get_my_stats_param';
import type { GetMyStatsRepository } from '../../domain/repository/get_my_stats_repository';

export class GetMyStatsUseCase implements UseCase<MyStats, GetMyStatsParam> {
  constructor(private readonly repository: GetMyStatsRepository) {}

  async execute(param: GetMyStatsParam): Promise<MyStats | Failure> {
    if (!param.token.trim()) {
      return new Failure('Connectez-vous pour consulter vos statistiques.');
    }

    return this.repository.getMyStats(param);
  }
}
