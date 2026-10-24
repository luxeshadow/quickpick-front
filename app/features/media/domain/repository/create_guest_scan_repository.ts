import type { Failure } from '../../../../core/error/failure';
import type { GuestScanResult } from '../entities/guest_scan';
import type { CreateGuestScanParam } from '../../application/params/create_guest_scan_param';
export interface CreateGuestScanRepository { createGuestScan(param: CreateGuestScanParam): Promise<GuestScanResult | Failure>; }
