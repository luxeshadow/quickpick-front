import type { Subscription } from '../../domain/entities/subscription';
import { SubscriptionPlanModel } from '../../../subscribeplan/data/model/subscription_plan_model';
import type { SubscriptionPlanJson } from '../../../subscribeplan/data/model/subscription_plan_model';

export interface SubscriptionJson {
  id: number;
  user_id: number;
  subscription_plan_id: number;
  status: string;
  starts_at: string;
  ends_at: string | null;
  cancelled_at: string | null;
  subscription_plan: SubscriptionPlanJson;
}

export class SubscriptionModel {
  constructor(private readonly subscription: Subscription) {}

  static fromJson(json: SubscriptionJson): SubscriptionModel {
    return new SubscriptionModel({
      id: json.id,
      userId: json.user_id,
      subscriptionPlanId: json.subscription_plan_id,
      status: json.status,
      startsAt: json.starts_at,
      endsAt: json.ends_at,
      cancelledAt: json.cancelled_at,
      subscriptionPlan: SubscriptionPlanModel.fromJson(json.subscription_plan).toEntity(),
    });
  }

  toEntity(): Subscription { return { ...this.subscription }; }
}
