import type { CurrentSubscription } from '../../domain/entities/subscription';
import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { GetCurrentSubscriptionParam } from '../../application/params/get_current_subscription_param';
import type { GetCurrentSubscriptionRepository } from '../../domain/repository/get_current_subscription_repository';
import { GetCurrentSubscriptionDatasource } from '../datasources/get_current_subscription_datasource';

export class GetCurrentSubscriptionRepositoryImpl implements GetCurrentSubscriptionRepository {
  private datasource: GetCurrentSubscriptionDatasource;
  constructor(datasource: GetCurrentSubscriptionDatasource = new GetCurrentSubscriptionDatasource()) {
    this.datasource = datasource;
  }
  async getCurrentSubscription(param: GetCurrentSubscriptionParam): Promise<CurrentSubscription | Failure> {
    try {
      const result = await this.datasource.getCurrentSubscription(param);
      return { ...result, subscription: result.subscription ? result.subscription.toEntity() : null };
    } catch (error) {
      return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.');
    }
  }
}
