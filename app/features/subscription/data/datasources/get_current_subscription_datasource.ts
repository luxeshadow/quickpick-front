import { SubscriptionModel } from '../model/subscription_model';
import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { GetCurrentSubscriptionParam } from '../../application/params/get_current_subscription_param';

export class GetCurrentSubscriptionDatasource {
  async getCurrentSubscription(param: GetCurrentSubscriptionParam): Promise<{ hasActiveSubscription: boolean; subscription: SubscriptionModel | null; message: string }> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.currentSubscription), {
        headers: LaravelEndpoint.headers(param.token),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new ApiException(typeof data?.message === 'string' ? data.message : 'Impossible de vérifier votre abonnement.', response.status);
      }
      if (data?.status !== 'success' || typeof data.has_active_subscription !== 'boolean' || typeof data.message !== 'string') {
        throw new ApiException('La réponse du serveur est invalide.');
      }
      return {
        hasActiveSubscription: data.has_active_subscription,
        subscription: data.subscription ? SubscriptionModel.fromJson(data.subscription) : null,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
