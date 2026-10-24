import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../../domain/entities/access_link';
import type { ShowAccessLinkParam } from '../params/show_access_link_param';
import type { ShowAccessLinkRepository } from '../../domain/repository/show_access_link_repository';
export class ShowAccessLinkUseCase implements UseCase<AccessLink, ShowAccessLinkParam> {
  constructor(private readonly repository: ShowAccessLinkRepository) {}
  async execute(param: ShowAccessLinkParam): Promise<AccessLink | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les liens.');
    return this.repository.showAccessLink(param);
  }
}
