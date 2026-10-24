import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { PublicMediaPage } from '../../domain/entities/public_media';
import type { GetPublicMediaRepository } from '../../domain/repository/get_public_media_repository';
import type { GetPublicMediaParam } from '../params/get_public_media_param';
export class GetPublicMediaUseCase implements UseCase<PublicMediaPage, GetPublicMediaParam> {
  constructor(private readonly repository: GetPublicMediaRepository) {}
  async execute(param: GetPublicMediaParam): Promise<PublicMediaPage | Failure> {
    if (!param.token.trim()) return new Failure('Le token du lien est manquant.');
    return this.repository.getPublicMedia(param);
  }
}
