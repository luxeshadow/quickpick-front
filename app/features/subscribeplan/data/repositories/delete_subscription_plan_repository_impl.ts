import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { DeleteSubscriptionPlanParam } from '../../application/params/delete_subscription_plan_param';
import type { DeleteSubscriptionPlanRepository } from '../../domain/repository/delete_subscription_plan_repository';
import { DeleteSubscriptionPlanDatasource } from '../datasources/delete_subscription_plan_datasource';
export class DeleteSubscriptionPlanRepositoryImpl implements DeleteSubscriptionPlanRepository {
  constructor(private readonly datasource: DeleteSubscriptionPlanDatasource = new DeleteSubscriptionPlanDatasource()) {}
  async deleteSubscriptionPlan(param: DeleteSubscriptionPlanParam): Promise<string | Failure> {
    try { return await this.datasource.deleteSubscriptionPlan(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
