import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import { UserModel } from '../model/user_model';
import type { User } from '../../domain/entities/user';
import type { UserPage } from '../../domain/repository/get_users_repository';
import type { GetUsersParam } from '../../application/params/get_users_param';
export class GetUsersDatasource {
  async getUsers(param: GetUsersParam): Promise<{ users: UserModel[]; pagination: UserPage['pagination'] }> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.users + '?page=' + param.page + '&per_page=' + param.perPage), {
        method: 'GET',
        headers: { ...LaravelEndpoint.headers(param.token) },
        
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de traiter cette demande.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return { users: data.users.map((user: User) => UserModel.fromJson(user)), pagination: data.pagination };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
