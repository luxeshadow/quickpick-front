import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../../domain/entities/access_link';
import type { GetEventAccessLinksParam } from '../params/get_event_access_links_param';
import type { GetEventAccessLinksRepository } from '../../domain/repository/get_event_access_links_repository';
export class GetEventAccessLinksUseCase implements UseCase<AccessLink[], GetEventAccessLinksParam> {
  constructor(private readonly repository: GetEventAccessLinksRepository) {}
  async execute(param: GetEventAccessLinksParam): Promise<AccessLink[] | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les liens.');
    return this.repository.getEventAccessLinks(param);
  }
}
