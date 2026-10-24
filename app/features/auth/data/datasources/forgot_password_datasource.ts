import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { ForgotPasswordParam } from '../../application/params/forgot_password_param';

export class ForgotPasswordDatasource {
  async forgotPassword(param: ForgotPasswordParam): Promise<string> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.forgotPassword), {
        method: 'POST',
        headers: { ...LaravelEndpoint.headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: param.email }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new ApiException(typeof data?.message === 'string' ? data.message : 'Impossible d’envoyer le lien de réinitialisation.', response.status);
      }
      if (data?.status !== 'success' || typeof data.message !== 'string') {
        throw new ApiException('La réponse du serveur est invalide.');
      }
      return data.message;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
