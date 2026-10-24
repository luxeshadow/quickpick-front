import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';

export interface SubscriptionPlanJson {
  id: number;
  name: string;
  description: string | null;
  price: string;
  duration_days: number | null;
  max_events: number | null;
  max_photos: number | null;
  is_active: boolean;
  accept_video: boolean;
  max_videos: number | null;
}

export class SubscriptionPlanModel {
  constructor(private readonly plan: SubscriptionPlan) {}

  static fromJson(json: SubscriptionPlanJson): SubscriptionPlanModel {
    return new SubscriptionPlanModel({
      id: json.id,
      name: json.name,
      description: json.description,
      price: json.price,
      durationDays: json.duration_days,
      maxEvents: json.max_events,
      maxPhotos: json.max_photos,
      isActive: json.is_active,
      acceptVideo: json.accept_video,
      maxVideos: json.max_videos,
    });
  }

  toEntity(): SubscriptionPlan { return { ...this.plan }; }
}
