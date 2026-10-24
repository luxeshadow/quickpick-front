import type { Event } from '../../domain/entities/event';

export interface EventJson {
  media_count?: number | null;
  id: number;
  name: string;
  description?: string | null;
  location?: string | null;
  event_date?: string | null;
  status?: 'active' | 'inactive';
}

export class EventModel implements Event {
  readonly mediaCount: number;
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly location: string | null;
  readonly eventDate: string | null;
  readonly status: 'active' | 'inactive';

  constructor(event: Event) {
    this.mediaCount = event.mediaCount;
    this.id = event.id;
    this.name = event.name;
    this.description = event.description;
    this.location = event.location;
    this.eventDate = event.eventDate;
    this.status = event.status;
  }

  static fromJson(json: EventJson): EventModel {
    return new EventModel({
      mediaCount: json.media_count ?? 0,
      id: json.id,
      name: json.name,
      description: json.description ?? null,
      location: json.location ?? null,
      eventDate: json.event_date ?? null,
      status: json.status ?? 'active',
    });
  }

  toEntity(): Event {
    return {
      mediaCount: this.mediaCount,
      id: this.id,
      name: this.name,
      description: this.description,
      location: this.location,
      eventDate: this.eventDate,
      status: this.status,
    };
  }
}
