import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { UserPage } from '../../domain/repository/get_users_repository';
import type { SearchUsersParam } from '../params/search_users_param';
import type { SearchUsersRepository } from '../../domain/repository/search_users_repository';
export class SearchUsersUseCase implements UseCase<UserPage, SearchUsersParam> {
  constructor(private readonly repository: SearchUsersRepository) {}
  async execute(param: SearchUsersParam): Promise<UserPage | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour continuer.');
    return this.repository.searchUsers(param);
  }
}
