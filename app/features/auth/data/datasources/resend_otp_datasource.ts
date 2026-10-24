import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { ResendOtpParam } from '../../application/params/resend_otp_param';

export class ResendOtpDatasource {
  async resendOtp(params: ResendOtpParam): Promise<void> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.resendOtp), {
        method: 'POST',
        headers: {
          ...LaravelEndpoint.headers(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: params.email }),
      });

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null);
        const message =
          data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
            ? data.message
            : 'Impossible de renvoyer le code.';

        throw new ApiException(message, response.status);
      }
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
