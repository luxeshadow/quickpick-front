import type { UseCase } from '../../../../core/usecase/usecase';
import type { LoginRepository } from '../../domain/repository/login_repository';
import type { LoginParam } from '../params/login_param';
import { Failure } from '../../../../core/error/failure';
import { LoginValidator } from '../../presentation/validators/login_validator';

export class LoginUseCase implements UseCase<{ email: string; message: string }, LoginParam> {
  constructor(private readonly repository: LoginRepository) {}

  async execute(param: LoginParam): Promise<{ email: string; message: string } | Failure> {
    const error = LoginValidator.validate(param);

    if (error) {
      return new Failure(error);
    }

    return this.repository.login(param);
  }
}