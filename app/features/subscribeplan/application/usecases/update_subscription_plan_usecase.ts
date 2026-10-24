import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import type { UpdateSubscriptionPlanParam } from '../params/update_subscription_plan_param';
import type { UpdateSubscriptionPlanRepository } from '../../domain/repository/update_subscription_plan_repository';
export class UpdateSubscriptionPlanUseCase implements UseCase<SubscriptionPlan, UpdateSubscriptionPlanParam> {
  constructor(private readonly repository: UpdateSubscriptionPlanRepository) {}
  async execute(param: UpdateSubscriptionPlanParam): Promise<SubscriptionPlan | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les plans d’abonnement.');
    return this.repository.updateSubscriptionPlan(param);
  }
}
