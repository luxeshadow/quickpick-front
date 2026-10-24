import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { ResetPasswordParam } from '../../application/params/reset_password_param';

export class ResetPasswordDatasource {
  async resetPassword(param: ResetPasswordParam): Promise<string> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.resetPassword), {
        method: 'POST',
        headers: { ...LaravelEndpoint.headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: param.email,
          token: param.token,
          password: param.password,
          password_confirmation: param.confirmPassword,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const fieldError = data?.errors?.token?.[0] || data?.errors?.password?.[0] || data?.errors?.email?.[0];
        const message = typeof fieldError === 'string' ? fieldError
          : typeof data?.message === 'string' ? data.message : 'Impossible de réinitialiser le mot de passe.';
        throw new ApiException(message, response.status);
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
