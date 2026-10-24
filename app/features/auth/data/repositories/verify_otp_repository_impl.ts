import { ApiException } from '../../../../core/error/exception';
import { Failure } from '../../../../core/error/failure';
import type { VerifyOtpParam } from '../../application/params/verify_otp_param';
import type { VerifyOtpRepository, VerifyOtpResponse } from '../../domain/repository/verify_otp_repository';
import { VerifyOtpDatasource } from '../datasources/verify_otp_datasource';

export class VerifyOtpRepositoryImpl implements VerifyOtpRepository {
  constructor(private readonly datasource: VerifyOtpDatasource = new VerifyOtpDatasource()) {}

  async verifyOtp(params: VerifyOtpParam): Promise<VerifyOtpResponse | Failure> {
    try {
      const data = await this.datasource.verifyOtp(params);
      if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'success'
        || !('token' in data) || typeof data.token !== 'string' || !data.token.trim()
        || !('user' in data) || !data.user || typeof data.user !== 'object' || Array.isArray(data.user)) {
        return new Failure('La réponse du serveur est invalide.');
      }
      return {
        token: data.token,
        user: data.user as Record<string, unknown>,
        message: 'message' in data && typeof data.message === 'string' ? data.message : 'Code vérifié avec succès.',
      };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
