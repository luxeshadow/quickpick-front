import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import type { ShowSubscriptionPlanParam } from '../../application/params/show_subscription_plan_param';
import type { ShowSubscriptionPlanRepository } from '../../domain/repository/show_subscription_plan_repository';
import { ShowSubscriptionPlanDatasource } from '../datasources/show_subscription_plan_datasource';
export class ShowSubscriptionPlanRepositoryImpl implements ShowSubscriptionPlanRepository {
  constructor(private readonly datasource: ShowSubscriptionPlanDatasource = new ShowSubscriptionPlanDatasource()) {}
  async showSubscriptionPlan(param: ShowSubscriptionPlanParam): Promise<SubscriptionPlan | Failure> {
    try { return await this.datasource.showSubscriptionPlan(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
