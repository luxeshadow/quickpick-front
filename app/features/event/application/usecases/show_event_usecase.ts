import type { Event } from '../../domain/entities/event';
import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { ShowEventParam } from '../params/show_event_param';
import type { ShowEventRepository } from '../../domain/repository/show_event_repository';
import { validateShowEvent } from '../../presentation/validators/show_event_validator';
export class ShowEventUseCase implements UseCase<Event, ShowEventParam> {
  private repository: ShowEventRepository;
  constructor(repository: ShowEventRepository) { this.repository = repository; }
  async execute(param: ShowEventParam): Promise<Event | Failure> {
    const error = validateShowEvent(param);
    if (error) return new Failure(error);
    return await this.repository.showEvent(param);
  }
}
