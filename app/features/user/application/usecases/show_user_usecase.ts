import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { User } from '../../domain/entities/user';
import type { ShowUserParam } from '../params/show_user_param';
import type { ShowUserRepository } from '../../domain/repository/show_user_repository';
export class ShowUserUseCase implements UseCase<User, ShowUserParam> {
  constructor(private readonly repository: ShowUserRepository) {}
  async execute(param: ShowUserParam): Promise<User | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour continuer.');
    return this.repository.showUser(param);
  }
}
