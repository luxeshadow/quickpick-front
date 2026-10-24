import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { GetSubscriptionPlansParam } from '../../application/params/get_subscription_plans_param';
import { SubscriptionPlanModel } from '../model/subscription_plan_model';
import type { SubscriptionPlanJson } from '../model/subscription_plan_model';

export class GetSubscriptionPlansDatasource {
  async getSubscriptionPlans(param: GetSubscriptionPlansParam): Promise<SubscriptionPlanModel[]> {
    try {
      const response = await fetch(LaravelEndpoint.url(ApiRoutes.subscriptionPlans), {
        headers: LaravelEndpoint.headers(param.token),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new ApiException(data.message ?? 'Impossible de charger les plans.', response.status);
      }
      if (data.status !== 'success' || !Array.isArray(data.subscription_plans)) {
        throw new ApiException('La réponse du serveur est invalide.');
      }
      return data.subscription_plans.map((plan: SubscriptionPlanJson) => SubscriptionPlanModel.fromJson(plan));
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException('Impossible de contacter le serveur.');
    }
  }
}
