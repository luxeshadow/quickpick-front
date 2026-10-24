import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import { MyStatsModel } from '../model/my_stats_model';
import type { GetMyStatsParam } from '../../application/params/get_my_stats_param';

export class GetMyStatsDatasource {
  async getMyStats(param: GetMyStatsParam): Promise<MyStatsModel> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.myStats + '?year=' + param.year), {
        headers: LaravelEndpoint.headers(param.token),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new ApiException(data.message ?? 'Impossible de charger vos statistiques.', response.status);
      }

      if (data.status !== 'success') {
        throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      }

      return MyStatsModel.fromJson(data);
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
