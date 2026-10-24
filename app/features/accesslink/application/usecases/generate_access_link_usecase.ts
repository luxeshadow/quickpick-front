import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { AccessLink } from '../../domain/entities/access_link';
import type { GenerateAccessLinkParam } from '../params/generate_access_link_param';
import type { GenerateAccessLinkRepository } from '../../domain/repository/generate_access_link_repository';
export class GenerateAccessLinkUseCase implements UseCase<AccessLink, GenerateAccessLinkParam> {
  constructor(private readonly repository: GenerateAccessLinkRepository) {}
  async execute(param: GenerateAccessLinkParam): Promise<AccessLink | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les liens.');
    if (param.maxScans !== null && (!Number.isInteger(param.maxScans) || param.maxScans < 1)) {
      return new Failure('Le nombre maximal de scans doit être un entier supérieur à zéro.');
    }
    return this.repository.generateAccessLink(param);
  }
}
