import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { CreateSubscriptionPlanParam } from '../../application/params/create_subscription_plan_param';
import type { CreateSubscriptionPlanRepository } from '../../domain/repository/create_subscription_plan_repository';
import { CreateSubscriptionPlanDatasource } from '../datasources/create_subscription_plan_datasource';
export class CreateSubscriptionPlanRepositoryImpl implements CreateSubscriptionPlanRepository {
  constructor(private readonly datasource: CreateSubscriptionPlanDatasource = new CreateSubscriptionPlanDatasource()) {}
  async createSubscriptionPlan(param: CreateSubscriptionPlanParam): Promise<string | Failure> {
    try { return await this.datasource.createSubscriptionPlan(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
