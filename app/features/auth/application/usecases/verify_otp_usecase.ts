import { Failure } from '../../../../core/error/failure';
import type { UseCase } from '../../../../core/usecase/usecase';
import type { VerifyOtpParam } from '../params/verify_otp_param';
import type { VerifyOtpRepository, VerifyOtpResponse } from '../../domain/repository/verify_otp_repository';
import { VerifyOtpValidator } from '../../presentation/validators/verify_otp_validator';

export class VerifyOtpUseCase implements UseCase<VerifyOtpResponse, VerifyOtpParam> {
  private repository: VerifyOtpRepository;

  constructor(repository: VerifyOtpRepository) {
    this.repository = repository;
  }

  async execute(param: VerifyOtpParam): Promise<VerifyOtpResponse | Failure> {
    const validationError = VerifyOtpValidator.validate(param);
    if (validationError) return new Failure(validationError);

    const result = await this.repository.verifyOtp(param);
    return result;
  }
}
