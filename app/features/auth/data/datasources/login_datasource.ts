import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { LoginParam } from '../../application/params/login_param';

export class LoginDatasource {
  async login(credentials: LoginParam): Promise<any> {
    try {
      const response = await fetch(
        LaravelEndpoint.url(ApiRoutes.login),
        {
          method: 'POST',
          headers: {
            ...LaravelEndpoint.headers(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new ApiException(
          data.message ?? 'Erreur de connexion',
          response.status,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      throw new ApiException(
        'Impossible de contacter le serveur',
      );
    }
  }
}