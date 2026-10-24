import type { UseCase } from '../../../../core/usecase/usecase';
import type { ForgotPasswordRepository } from '../../domain/repository/forgot_password_repository';
import type { ForgotPasswordParam } from '../params/forgot_password_param';
import { Failure } from '../../../../core/error/failure';
import { validateForgotPassword } from '../../presentation/validators/forgot_password_validator';

export class ForgotPasswordUseCase implements UseCase<string, ForgotPasswordParam> {
  private repository: ForgotPasswordRepository;

  constructor(repository: ForgotPasswordRepository) {
    this.repository = repository;
  }

  async execute(param: ForgotPasswordParam): Promise<string | Failure> {
    const validationError = validateForgotPassword(param);
    if (validationError) return new Failure(validationError);

    const result = await this.repository.forgotPassword(param);
    return result;
  }
}
