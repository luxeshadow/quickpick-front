import type { AccessLink } from '../../domain/entities/access_link';
export interface AccessLinkJson {
  id: number; event_id: number; token: string; source: string;
  expires_at: string | null; is_active: boolean; max_scans: number | null;
  scans_count: number; public_url: string;
}
export class AccessLinkModel {
  constructor(private readonly link: AccessLink) {}
  static fromJson(json: AccessLinkJson): AccessLinkModel {
    return new AccessLinkModel({ id: json.id, eventId: json.event_id, token: json.token,
      source: json.source, expiresAt: json.expires_at, isActive: json.is_active,
      maxScans: json.max_scans, scansCount: json.scans_count, publicUrl: json.public_url });
  }
  toEntity(): AccessLink { return { ...this.link }; }
}
