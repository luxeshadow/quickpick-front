import { Failure } from '../../../../core/error/failure';
import { ApiException } from '../../../../core/error/exception';
import type { GuestScanResult } from '../../domain/entities/guest_scan';
import type { CreateGuestScanParam } from '../../application/params/create_guest_scan_param';
import type { CreateGuestScanRepository } from '../../domain/repository/create_guest_scan_repository';
import { CreateGuestScanDatasource } from '../datasources/create_guest_scan_datasource';
export class CreateGuestScanRepositoryImpl implements CreateGuestScanRepository {
  constructor(private readonly datasource: CreateGuestScanDatasource = new CreateGuestScanDatasource()) {}
  async createGuestScan(param: CreateGuestScanParam): Promise<GuestScanResult | Failure> {
    try { return await this.datasource.createGuestScan(param); }
    catch (error) { return new Failure(error instanceof ApiException ? error.message : 'Une erreur inattendue est survenue.'); }
  }
}
