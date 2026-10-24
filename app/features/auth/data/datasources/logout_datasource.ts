import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { LogoutParam } from '../../application/params/logout_param';

export class LogoutDatasource {
  async logout(param: LogoutParam): Promise<void> {
    if (!param.token.trim()) return;
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.logout), {
        method: 'POST',
        headers: LaravelEndpoint.headers(param.token),
      });
      if (response.ok || response.status === 401) return;

      const data = await response.json().catch(() => null);
      throw new ApiException(typeof data?.message === 'string' ? data.message : 'La déconnexion a échoué.', response.status);
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
