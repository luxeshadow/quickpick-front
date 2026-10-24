import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { Event } from '../../domain/entities/event';
import type { GetMyEventsRepository } from '../../domain/repository/get_my_events_repository';
import type { GetMyEventsParam } from '../params/get_my_events_param';
import { validateGetMyEvents } from '../../presentation/validators/get_my_events_validator';

export class GetMyEventsUseCase implements UseCase<{ events: Event[]; currentPage: number; lastPage: number; total: number }, GetMyEventsParam> {
  private repository: GetMyEventsRepository;
  constructor(repository: GetMyEventsRepository) { this.repository = repository; }
  async execute(param: GetMyEventsParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure> {
    const error = validateGetMyEvents(param);
    if (error) return new Failure(error);
    return await this.repository.getMyEvents(param);
  }
}
