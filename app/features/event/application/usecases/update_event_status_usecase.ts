import type { Event } from '../../domain/entities/event';
import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { UpdateEventStatusParam } from '../params/update_event_status_param';
import type { UpdateEventStatusRepository } from '../../domain/repository/update_event_status_repository';
import { validateUpdateEventStatus } from '../../presentation/validators/update_event_status_validator';

export class UpdateEventStatusUseCase implements UseCase<Event, UpdateEventStatusParam> {
  private repository: UpdateEventStatusRepository;

  constructor(repository: UpdateEventStatusRepository) {
    this.repository = repository;
  }

  async execute(param: UpdateEventStatusParam): Promise<Event | Failure> {
    const validationError = validateUpdateEventStatus(param);
    if (validationError) return new Failure(validationError);
    return await this.repository.updateEventStatus(param);
  }
}
