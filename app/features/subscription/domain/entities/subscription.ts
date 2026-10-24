import type { SubscriptionPlan } from '../../../subscribeplan/domain/entities/subscription_plan';

export interface Subscription {
  id: number;
  userId: number;
  subscriptionPlanId: number;
  status: string;
  startsAt: string;
  endsAt: string | null;
  cancelledAt: string | null;
  subscriptionPlan: SubscriptionPlan;
}

export interface CurrentSubscription {
  hasActiveSubscription: boolean;
  subscription: Subscription | null;
  message: string;
}
