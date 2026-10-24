export interface SubscriptionPlanInput {
  name: string;
  description: string | null;
  price: string;
  duration_days: number | null;
  max_events: number | null;
  max_photos: number | null;
  accept_video: boolean;
  max_videos: number | null;
  is_active: boolean;
}
