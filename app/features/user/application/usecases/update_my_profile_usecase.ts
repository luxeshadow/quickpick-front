import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { UpdatedProfile } from '../../domain/repository/update_my_profile_repository';
import type { UpdateMyProfileParam } from '../params/update_my_profile_param';
import type { UpdateMyProfileRepository } from '../../domain/repository/update_my_profile_repository';
export class UpdateMyProfileUseCase implements UseCase<UpdatedProfile, UpdateMyProfileParam> {
  constructor(private readonly repository: UpdateMyProfileRepository) {}
  async execute(param: UpdateMyProfileParam): Promise<UpdatedProfile | Failure> {
    if (!param.token.trim()) return new Failure('Connectez-vous pour continuer.');
    return this.repository.updateMyProfile(param);
  }
}
