import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { VerifyOtpParam } from '../../application/params/verify_otp_param';

export class VerifyOtpDatasource {
  async verifyOtp(params: VerifyOtpParam): Promise<unknown> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.verifyOtp), {
        method: 'POST',
        headers: { ...LaravelEndpoint.headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: params.email, otp: params.code }),
      });
      let data: unknown;
      try { data = await response.json(); }
      catch { throw new ApiException('La réponse du serveur est invalide.', response.status); }
      if (!response.ok) {
        const message = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
          ? data.message : 'La vérification du code a échoué.';
        throw new ApiException(message, response.status);
      }
      return data;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
