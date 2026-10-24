import { ApiException } from '../../../../core/error/exception';
import { Failure } from '../../../../core/error/failure';
import type { GetSubscriptionPlansParam } from '../../application/params/get_subscription_plans_param';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import type { GetSubscriptionPlansRepository } from '../../domain/repository/get_subscription_plans_repository';
import { GetSubscriptionPlansDatasource } from '../datasources/get_subscription_plans_datasource';

export class GetSubscriptionPlansRepositoryImpl implements GetSubscriptionPlansRepository {
  constructor(private readonly datasource: GetSubscriptionPlansDatasource = new GetSubscriptionPlansDatasource()) {}

  async getSubscriptionPlans(param: GetSubscriptionPlansParam): Promise<SubscriptionPlan[] | Failure> {
    try {
      const plans = await this.datasource.getSubscriptionPlans(param);
      return plans.map(plan => plan.toEntity());
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
