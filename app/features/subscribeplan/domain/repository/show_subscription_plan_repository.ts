import type { Failure } from '../../../../core/error/failure';
import type { SubscriptionPlan } from '../entities/subscription_plan';
import type { ShowSubscriptionPlanParam } from '../../application/params/show_subscription_plan_param';
export interface ShowSubscriptionPlanRepository { showSubscriptionPlan(param: ShowSubscriptionPlanParam): Promise<SubscriptionPlan | Failure>; }
