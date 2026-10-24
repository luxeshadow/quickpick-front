import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import { UserModel } from '../model/user_model';
import type { UpdateMyProfileParam } from '../../application/params/update_my_profile_param';
export class UpdateMyProfileDatasource {
  async updateMyProfile(param: UpdateMyProfileParam): Promise<{ user: UserModel; message: string }> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.myProfile), {
        method: 'PATCH',
        headers: { ...LaravelEndpoint.headers(param.token), 'Content-Type': 'application/json' },
        body: JSON.stringify(param.data),
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de traiter cette demande.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return { user: UserModel.fromJson(data.user), message: data.message };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
