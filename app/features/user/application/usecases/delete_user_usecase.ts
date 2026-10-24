import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { DeleteUserParam } from '../params/delete_user_param';
import type { DeleteUserRepository } from '../../domain/repository/delete_user_repository';
export class DeleteUserUseCase implements UseCase<string, DeleteUserParam> {
  constructor(private readonly repository: DeleteUserRepository) {}
  async execute(param: DeleteUserParam): Promise<string | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour continuer.');
    return this.repository.deleteUser(param);
  }
}
