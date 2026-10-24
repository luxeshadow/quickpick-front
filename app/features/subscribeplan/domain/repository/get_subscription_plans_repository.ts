import type { Failure } from '../../../../core/error/failure';
import type { GetSubscriptionPlansParam } from '../../application/params/get_subscription_plans_param';
import type { SubscriptionPlan } from '../entities/subscription_plan';

export interface GetSubscriptionPlansRepository {
  getSubscriptionPlans(param: GetSubscriptionPlansParam): Promise<SubscriptionPlan[] | Failure>;
}
