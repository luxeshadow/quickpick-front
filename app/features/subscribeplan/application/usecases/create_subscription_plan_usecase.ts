import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { CreateSubscriptionPlanParam } from '../params/create_subscription_plan_param';
import type { CreateSubscriptionPlanRepository } from '../../domain/repository/create_subscription_plan_repository';
export class CreateSubscriptionPlanUseCase implements UseCase<string, CreateSubscriptionPlanParam> {
  constructor(private readonly repository: CreateSubscriptionPlanRepository) {}
  async execute(param: CreateSubscriptionPlanParam): Promise<string | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les plans d’abonnement.');
    return this.repository.createSubscriptionPlan(param);
  }
}
