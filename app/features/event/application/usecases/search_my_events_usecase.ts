import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { Event } from '../../domain/entities/event';
import type { SearchMyEventsRepository } from '../../domain/repository/search_my_events_repository';
import type { SearchMyEventsParam } from '../params/search_my_events_param';
import { validateSearchMyEvents } from '../../presentation/validators/search_my_events_validator';

export class SearchMyEventsUseCase implements UseCase<{ events: Event[]; currentPage: number; lastPage: number; total: number }, SearchMyEventsParam> {
  private repository: SearchMyEventsRepository;
  constructor(repository: SearchMyEventsRepository) { this.repository = repository; }
  async execute(param: SearchMyEventsParam): Promise<{ events: Event[]; currentPage: number; lastPage: number; total: number } | Failure> {
    const error = validateSearchMyEvents(param);
    if (error) return new Failure(error);
    return await this.repository.searchMyEvents(param);
  }
}
