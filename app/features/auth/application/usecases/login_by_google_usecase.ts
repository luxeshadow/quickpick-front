import type { UseCase } from '../../../../core/usecase/usecase';
import type { LoginByGoogleRepository, LoginByGoogleResponse } from '../../domain/repository/login_by_google_repository';
import type { LoginByGoogleParam } from '../params/login_by_google_param';
import { Failure } from '../../../../core/error/failure';
import { LoginByGoogleValidator } from '../../presentation/validators/login_by_google_validator';

export class LoginByGoogleUseCase implements UseCase<LoginByGoogleResponse, LoginByGoogleParam> {
  private repository: LoginByGoogleRepository;

  constructor(repository: LoginByGoogleRepository) {
    this.repository = repository;
  }

  async execute(param: LoginByGoogleParam): Promise<LoginByGoogleResponse | Failure> {
    const validationError = LoginByGoogleValidator.validate(param);

    if (validationError) {
      return new Failure(validationError);
    }

    const result = await this.repository.loginByGoogle(param);
    return result;
  }
}
