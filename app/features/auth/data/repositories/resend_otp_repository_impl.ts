import { ApiException } from '../../../../core/error/exception';
import { Failure } from '../../../../core/error/failure';
import type { ResendOtpParam } from '../../application/params/resend_otp_param';
import type { ResendOtpRepository } from '../../domain/repository/resend_otp_repository';
import { ResendOtpDatasource } from '../datasources/resend_otp_datasource';

export class ResendOtpRepositoryImpl implements ResendOtpRepository {
  constructor(private readonly datasource: ResendOtpDatasource = new ResendOtpDatasource()) {}

  async resendOtp(params: ResendOtpParam): Promise<void | Failure> {
    try {
      await this.datasource.resendOtp(params);
    } catch (error) {
      if (error instanceof ApiException) {
        return new Failure(error.message);
      }

      return new Failure('Une erreur inattendue est survenue.');
    }
  }
}
