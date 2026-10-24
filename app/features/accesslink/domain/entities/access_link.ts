export interface AccessLink {
  id: number;
  eventId: number;
  token: string;
  source: string;
  expiresAt: string | null;
  isActive: boolean;
  maxScans: number | null;
  scansCount: number;
  publicUrl: string;
}
export interface PublicAccessLink {
  expiresAt: string | null;
  remainingScans: number | null;
  event: { id: number; name: string; description: string | null; location: string | null; event_date: string | null; status: string };
}
