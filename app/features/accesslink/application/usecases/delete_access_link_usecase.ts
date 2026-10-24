import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { DeleteAccessLinkParam } from '../params/delete_access_link_param';
import type { DeleteAccessLinkRepository } from '../../domain/repository/delete_access_link_repository';
export class DeleteAccessLinkUseCase implements UseCase<string, DeleteAccessLinkParam> {
  constructor(private readonly repository: DeleteAccessLinkRepository) {}
  async execute(param: DeleteAccessLinkParam): Promise<string | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les liens.');
    return this.repository.deleteAccessLink(param);
  }
}
