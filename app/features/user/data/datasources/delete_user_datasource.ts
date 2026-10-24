import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { DeleteUserParam } from '../../application/params/delete_user_param';
export class DeleteUserDatasource {
  async deleteUser(param: DeleteUserParam): Promise<string> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.users + '/' + param.id), {
        method: 'DELETE',
        headers: { ...LaravelEndpoint.headers(param.token) },
        
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de traiter cette demande.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return data.message;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
