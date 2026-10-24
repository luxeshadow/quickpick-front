import type { UseCase } from '../../../../core/usecase/usecase';
import type { Failure } from '../../../../core/error/failure';
import type { LogoutParam } from '../params/logout_param';
import type { LogoutRepository } from '../../domain/repository/logout_repository';

export class LogoutUseCase implements UseCase<void, LogoutParam> {
  private repository: LogoutRepository;

  constructor(repository: LogoutRepository) {
    this.repository = repository;
  }

  async execute(param: LogoutParam): Promise<void | Failure> {
    const result = await this.repository.logout(param);
    return result;
  }
}
