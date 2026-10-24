import type { Failure } from '../../../../core/error/failure';
import type { SubscriptionPlan } from '../entities/subscription_plan';
import type { UpdateSubscriptionPlanParam } from '../../application/params/update_subscription_plan_param';
export interface UpdateSubscriptionPlanRepository { updateSubscriptionPlan(param: UpdateSubscriptionPlanParam): Promise<SubscriptionPlan | Failure>; }
