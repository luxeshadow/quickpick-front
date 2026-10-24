import type { UseCase } from '../../../../core/usecase/usecase';
import type { ResendOtpRepository } from '../../domain/repository/resend_otp_repository';
import type { ResendOtpParam } from '../params/resend_otp_param';
import { Failure } from '../../../../core/error/failure';
import { validateResendOtp } from '../../presentation/validators/resend_otp_validator';

export class ResendOtpUseCase implements UseCase<void, ResendOtpParam> {
  private repository: ResendOtpRepository;

  constructor(repository: ResendOtpRepository) {
    this.repository = repository;
  }

  async execute(param: ResendOtpParam): Promise<void | Failure> {
    const validationError = validateResendOtp(param);
    if (validationError) {
      return new Failure(validationError);
    }

    const result = await this.repository.resendOtp(param);
    return result;
  }
}