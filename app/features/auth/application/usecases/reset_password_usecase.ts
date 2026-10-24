import type { UseCase } from '../../../../core/usecase/usecase';
import type { ResetPasswordRepository } from '../../domain/repository/reset_password_repository';
import type { ResetPasswordParam } from '../params/reset_password_param';
import { Failure } from '../../../../core/error/failure';
import { validateResetPassword } from '../../presentation/validators/reset_password_validator';

export class ResetPasswordUseCase implements UseCase<string, ResetPasswordParam> {
  private repository: ResetPasswordRepository;

  constructor(repository: ResetPasswordRepository) {
    this.repository = repository;
  }

  async execute(param: ResetPasswordParam): Promise<string | Failure> {
    const validationError = validateResetPassword(param);
    if (validationError) return new Failure(validationError);

    const result = await this.repository.resetPassword(param);
    return result;
  }
}
