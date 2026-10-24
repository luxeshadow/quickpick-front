import type { CurrentSubscription } from '../entities/subscription';
import type { Failure } from '../../../../core/error/failure';
import type { GetCurrentSubscriptionParam } from '../../application/params/get_current_subscription_param';

export interface GetCurrentSubscriptionRepository {
  getCurrentSubscription(param: GetCurrentSubscriptionParam): Promise<CurrentSubscription | Failure>;
}
