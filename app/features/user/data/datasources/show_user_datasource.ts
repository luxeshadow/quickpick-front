import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import { UserModel } from '../model/user_model';
import type { ShowUserParam } from '../../application/params/show_user_param';
export class ShowUserDatasource {
  async showUser(param: ShowUserParam): Promise<UserModel> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.users + '/' + param.id), {
        method: 'GET',
        headers: { ...LaravelEndpoint.headers(param.token) },
        
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de traiter cette demande.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return UserModel.fromJson(data.user);
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
