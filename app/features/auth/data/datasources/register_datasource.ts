import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { RegisterParam } from '../../application/params/register_param';

export class RegisterDatasource {
  async register(params: RegisterParam): Promise<unknown> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.register), {
        method: 'POST',
        headers: {
          ...LaravelEndpoint.headers(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: params.fullName,
          email: params.email,
          phone: params.phone,
          password: params.password,
          password_confirmation: params.confirmPassword,
        }),
      });

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        throw new ApiException(
          response.ok ? 'La réponse du serveur est invalide' : "Erreur lors de l'inscription",
          response.status,
        );
      }

      if (!response.ok) {
        const message = data && typeof data === 'object' && 'message' in data
          && typeof data.message === 'string' ? data.message : "Erreur lors de l'inscription";
        throw new ApiException(message, response.status);
      }

      if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        throw new ApiException('La réponse du serveur est invalide', response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur');
    }
  }
}
