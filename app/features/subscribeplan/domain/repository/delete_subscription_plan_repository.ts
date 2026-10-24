import type { Failure } from '../../../../core/error/failure';
import type { DeleteSubscriptionPlanParam } from '../../application/params/delete_subscription_plan_param';
export interface DeleteSubscriptionPlanRepository { deleteSubscriptionPlan(param: DeleteSubscriptionPlanParam): Promise<string | Failure>; }
