import type { UseCase } from '../../../../core/usecase/usecase';
import type { Failure } from '../../../../core/error/failure';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import type { GetSubscriptionPlansRepository } from '../../domain/repository/get_subscription_plans_repository';
import type { GetSubscriptionPlansParam } from '../params/get_subscription_plans_param';

export class GetSubscriptionPlansUseCase implements UseCase<SubscriptionPlan[], GetSubscriptionPlansParam> {
  constructor(private readonly repository: GetSubscriptionPlansRepository) {}

  async execute(param: GetSubscriptionPlansParam): Promise<SubscriptionPlan[] | Failure> {
    return this.repository.getSubscriptionPlans(param);
  }
}
