import type { UseCase } from '../../../../core/usecase/usecase';
import { Failure } from '../../../../core/error/failure';
import type { GuestScanResult } from '../../domain/entities/guest_scan';
import type { CreateGuestScanParam } from '../params/create_guest_scan_param';
import type { CreateGuestScanRepository } from '../../domain/repository/create_guest_scan_repository';
export class CreateGuestScanUseCase implements UseCase<GuestScanResult, CreateGuestScanParam> {
  constructor(private readonly repository: CreateGuestScanRepository) {}
  async execute(param: CreateGuestScanParam): Promise<GuestScanResult | Failure> {
    if (!param.token.trim()) return new Failure('Le token du lien est manquant.');
    if (!param.consent) return new Failure('Votre consentement est nécessaire avant la recherche.');
    return this.repository.createGuestScan(param);
  }
}
