import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../../domain/entities/access_link';
import type { UpdateAccessLinkParam } from '../params/update_access_link_param';
import type { UpdateAccessLinkRepository } from '../../domain/repository/update_access_link_repository';
export class UpdateAccessLinkUseCase implements UseCase<AccessLink, UpdateAccessLinkParam> {
  constructor(private readonly repository: UpdateAccessLinkRepository) {}
  async execute(param: UpdateAccessLinkParam): Promise<AccessLink | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les liens.');
    if (param.maxScans !== null && (!Number.isInteger(param.maxScans) || param.maxScans < 1)) {
      return new Failure('Le nombre maximal de scans doit être un entier supérieur à zéro.');
    }
    return this.repository.updateAccessLink(param);
  }
}
