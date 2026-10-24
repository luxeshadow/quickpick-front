import type { CurrentSubscription } from '../../domain/entities/subscription';
import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { GetCurrentSubscriptionParam } from '../params/get_current_subscription_param';
import type { GetCurrentSubscriptionRepository } from '../../domain/repository/get_current_subscription_repository';

export class GetCurrentSubscriptionUseCase implements UseCase<CurrentSubscription, GetCurrentSubscriptionParam> {
  private repository: GetCurrentSubscriptionRepository;
  constructor(repository: GetCurrentSubscriptionRepository) { this.repository = repository; }
  async execute(param: GetCurrentSubscriptionParam): Promise<CurrentSubscription | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour consulter votre abonnement.');
    return await this.repository.getCurrentSubscription(param);
  }
}
