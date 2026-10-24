import type { UseCase } from '../../../../core/usecase/usecase';
import type { RegisterRepository } from '../../domain/repository/register_repository';
import type { RegisterParam } from '../params/register_param';
import { Failure } from '../../../../core/error/failure';
import { RegisterValidator } from '../../presentation/validators/register_validator';

export class RegisterUseCase implements UseCase<{ email: string; message: string }, RegisterParam> {
  private repository: RegisterRepository;

  constructor(repository: RegisterRepository) {
    this.repository = repository;
  }

  async execute(param: RegisterParam): Promise<{ email: string; message: string } | Failure> {
    const validationError = RegisterValidator.validate(param);

    if (validationError) {
      return new Failure(validationError);
    }

    const result = await this.repository.register(param);
    return result;
  }
}
