import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { CreateSubscriptionPlanParam } from '../../application/params/create_subscription_plan_param';
export class CreateSubscriptionPlanDatasource {
  async createSubscriptionPlan(param: CreateSubscriptionPlanParam): Promise<string> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.subscriptionPlans), {
        method: 'POST',
        headers: { ...LaravelEndpoint.headers(param.token), 'Content-Type': 'application/json' },
        body: JSON.stringify(param.data),
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'Impossible de gérer ce plan d’abonnement.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return data.message;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
