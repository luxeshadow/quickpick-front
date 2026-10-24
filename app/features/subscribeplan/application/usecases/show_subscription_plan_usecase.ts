import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import type { ShowSubscriptionPlanParam } from '../params/show_subscription_plan_param';
import type { ShowSubscriptionPlanRepository } from '../../domain/repository/show_subscription_plan_repository';
export class ShowSubscriptionPlanUseCase implements UseCase<SubscriptionPlan, ShowSubscriptionPlanParam> {
  constructor(private readonly repository: ShowSubscriptionPlanRepository) {}
  async execute(param: ShowSubscriptionPlanParam): Promise<SubscriptionPlan | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les plans d’abonnement.');
    return this.repository.showSubscriptionPlan(param);
  }
}
