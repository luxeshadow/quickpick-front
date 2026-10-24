import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import type { UpdateSubscriptionPlanParam } from '../../application/params/update_subscription_plan_param';
import type { UpdateSubscriptionPlanRepository } from '../../domain/repository/update_subscription_plan_repository';
import { UpdateSubscriptionPlanDatasource } from '../datasources/update_subscription_plan_datasource';
export class UpdateSubscriptionPlanRepositoryImpl implements UpdateSubscriptionPlanRepository {
  constructor(private readonly datasource: UpdateSubscriptionPlanDatasource = new UpdateSubscriptionPlanDatasource()) {}
  async updateSubscriptionPlan(param: UpdateSubscriptionPlanParam): Promise<SubscriptionPlan | Failure> {
    try { return await this.datasource.updateSubscriptionPlan(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
