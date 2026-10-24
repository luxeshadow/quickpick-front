import type { PublicMedia } from './public_media';
export interface GuestScanResult {
  scan: { id: number; status: string; matches_count: number };
  media: (PublicMedia & { similarity: number })[];
}
