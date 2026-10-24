import type { Failure } from '../../../../core/error/failure';
import type { CreateSubscriptionPlanParam } from '../../application/params/create_subscription_plan_param';
export interface CreateSubscriptionPlanRepository { createSubscriptionPlan(param: CreateSubscriptionPlanParam): Promise<string | Failure>; }
