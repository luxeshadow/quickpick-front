import type { Event } from '../../domain/entities/event';
import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { CreateEventParam } from '../params/create_event_param';
import type { CreateEventRepository } from '../../domain/repository/create_event_repository';
import { validateCreateEvent } from '../../presentation/validators/create_event_validator';

export class CreateEventUseCase implements UseCase<Event, CreateEventParam> {
  private repository: CreateEventRepository;

  constructor(repository: CreateEventRepository) {
    this.repository = repository;
  }

  async execute(param: CreateEventParam): Promise<Event | Failure> {
    const validationError = validateCreateEvent(param);
    if (validationError) return new Failure(validationError);
    return await this.repository.createEvent(param);
  }
}
