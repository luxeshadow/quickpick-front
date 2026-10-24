import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { UserPage } from '../../domain/repository/get_users_repository';
import type { GetUsersParam } from '../params/get_users_param';
import type { GetUsersRepository } from '../../domain/repository/get_users_repository';
export class GetUsersUseCase implements UseCase<UserPage, GetUsersParam> {
  constructor(private readonly repository: GetUsersRepository) {}
  async execute(param: GetUsersParam): Promise<UserPage | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour continuer.');
    return this.repository.getUsers(param);
  }
}
