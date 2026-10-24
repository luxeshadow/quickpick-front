import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { PublicAccessLink } from '../../domain/entities/access_link';
import type { ResolvePublicAccessLinkParam } from '../params/resolve_public_access_link_param';
import type { ResolvePublicAccessLinkRepository } from '../../domain/repository/resolve_public_access_link_repository';
export class ResolvePublicAccessLinkUseCase implements UseCase<PublicAccessLink, ResolvePublicAccessLinkParam> {
  constructor(private readonly repository: ResolvePublicAccessLinkRepository) {}
  async execute(param: ResolvePublicAccessLinkParam): Promise<PublicAccessLink | Failure> {
    if (!param.token.trim()) return new Failure('Le token du lien est manquant.');
    return this.repository.resolvePublicAccessLink(param);
  }
}
