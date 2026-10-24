import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { DeleteSubscriptionPlanParam } from '../params/delete_subscription_plan_param';
import type { DeleteSubscriptionPlanRepository } from '../../domain/repository/delete_subscription_plan_repository';
export class DeleteSubscriptionPlanUseCase implements UseCase<string, DeleteSubscriptionPlanParam> {
  constructor(private readonly repository: DeleteSubscriptionPlanRepository) {}
  async execute(param: DeleteSubscriptionPlanParam): Promise<string | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour gérer les plans d’abonnement.');
    return this.repository.deleteSubscriptionPlan(param);
  }
}
