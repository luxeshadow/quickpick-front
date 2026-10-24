export interface Event {
  readonly mediaCount: number;
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly location: string | null;
  readonly eventDate: string | null;
  readonly status: 'active' | 'inactive';
}
