import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { LoginByGoogleParam } from '../../application/params/login_by_google_param';

export class LoginByGoogleDatasource {
  async loginByGoogle(params: LoginByGoogleParam): Promise<unknown> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.loginByGoogle), {
        method: 'POST',
        headers: { ...LaravelEndpoint.headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.idToken }),
      });
      let data: unknown;
      try { data = await response.json(); }
      catch { throw new ApiException('La réponse du serveur est invalide.', response.status); }
      if (!response.ok) {
        const message = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
          ? data.message : 'La connexion Google a échoué.';
        throw new ApiException(message, response.status);
      }
      return data;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
