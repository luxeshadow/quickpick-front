import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { Event } from '../../domain/entities/event';
import type { GetMyEventsByStatusRepository } from '../../domain/repository/get_my_events_by_status_repository';
import type { GetMyEventsByStatusParam } from '../params/get_my_events_by_status_param';
import { validateGetMyEventsByStatus } from '../../presentation/validators/get_my_events_by_status_validator';

export class GetMyEventsByStatusUseCase implements UseCase<{ events: Event[]; currentPage: number; lastPage: number; total: number }, GetMyEventsByStatusParam> {
  private repository: GetMyEventsByStatusRepository;
  constructor(repository: GetMyEventsByStatusRepository) { this.repository = repository; }
  async execute(param: GetMyEventsByStatusParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure> {
    const error = validateGetMyEventsByStatus(param);
    if (error) return new Failure(error);
    return await this.repository.getMyEventsByStatus(param);
  }
}
