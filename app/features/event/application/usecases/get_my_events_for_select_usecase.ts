import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { GetMyEventsForSelectParam } from '../params/get_my_events_for_select_param';
import type { GetMyEventsForSelectRepository } from '../../domain/repository/get_my_events_for_select_repository';
import { validateGetMyEventsForSelect } from '../../presentation/validators/get_my_events_for_select_validator';
export class GetMyEventsForSelectUseCase implements UseCase<{ id: number; name: string; status: 'active' | 'inactive' }[], GetMyEventsForSelectParam> {
  private repository: GetMyEventsForSelectRepository;
  constructor(repository: GetMyEventsForSelectRepository) { this.repository = repository; }
  async execute(param: GetMyEventsForSelectParam): Promise<{ id: number; name: string; status: 'active' | 'inactive' }[] | Failure> {
    const error = validateGetMyEventsForSelect(param);
    if (error) return new Failure(error);
    return await this.repository.getMyEventsForSelect(param);
  }
}
