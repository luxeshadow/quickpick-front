import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { UpdatedProfile } from '../../domain/repository/update_my_profile_repository';
import type { UpdateMyProfileParam } from '../../application/params/update_my_profile_param';
import type { UpdateMyProfileRepository } from '../../domain/repository/update_my_profile_repository';
import { UpdateMyProfileDatasource } from '../datasources/update_my_profile_datasource';
export class UpdateMyProfileRepositoryImpl implements UpdateMyProfileRepository {
  constructor(private readonly datasource: UpdateMyProfileDatasource = new UpdateMyProfileDatasource()) {}
  async updateMyProfile(param: UpdateMyProfileParam): Promise<UpdatedProfile | Failure> {
    try {
      const result = await this.datasource.updateMyProfile(param);
      return { user: result.user.toEntity(), message: result.message };
    }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
