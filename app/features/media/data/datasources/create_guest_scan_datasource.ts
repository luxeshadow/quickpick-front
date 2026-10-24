import { ApiRoutes } from '../../../../core/constants/api_routes';
import { LaravelEndpoint } from '../../../../core/constants/laravel_endpoint';
import { ApiException } from '../../../../core/error/exception';
import type { GuestScanResult } from '../../domain/entities/guest_scan';
import type { CreateGuestScanParam } from '../../application/params/create_guest_scan_param';
export class CreateGuestScanDatasource {
  async createGuestScan(param: CreateGuestScanParam): Promise<GuestScanResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90000);
    try {
      const body = new FormData();
      body.append('selfie', param.selfie, param.selfie.name);
      body.append('consent', '1');
      const route = ApiRoutes.publicGuestScans.replace('{token}', encodeURIComponent(param.token));
      const response = await fetch(LaravelEndpoint.url(route), {
        method: 'POST', headers: LaravelEndpoint.headers(), body: body, signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new ApiException(data.message ?? 'La requête a échoué. Veuillez réessayer.', response.status);
      if (data.status !== 'success') throw new ApiException(data.message ?? 'La réponse du serveur est invalide.');
      return { scan: data.scan, media: data.media };
    } catch (error) {
      if (error instanceof ApiException) throw error;
      if (controller.signal.aborted) throw new ApiException('La recherche a dépassé le délai de 90 secondes.');
      throw new ApiException('Impossible de contacter le serveur.');
    } finally { clearTimeout(timer); }
  }
}
