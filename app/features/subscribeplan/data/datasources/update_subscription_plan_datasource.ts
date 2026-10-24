import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import { SubscriptionPlanModel } from '../model/subscription_plan_model';
import type { UpdateSubscriptionPlanParam } from '../../application/params/update_subscription_plan_param';
export class UpdateSubscriptionPlanDatasource {
  async updateSubscriptionPlan(param: UpdateSubscriptionPlanParam): Promise<SubscriptionPlan> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.subscriptionPlans + '/' + param.id), {
        method: 'PATCH',
        headers: { ...LaravelEndpoint.headers(param.token), 'Content-Type': 'application/json' },
        body: JSON.stringify(param.data),
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de gérer ce plan d’abonnement.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return SubscriptionPlanModel.fromJson(data.subscription_plan).toEntity();
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
