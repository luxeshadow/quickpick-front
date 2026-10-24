export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string | null;
  price: string;
  durationDays: number | null;
  maxEvents: number | null;
  maxPhotos: number | null;
  isActive: boolean;
  acceptVideo: boolean;
  maxVideos: number | null;
}
