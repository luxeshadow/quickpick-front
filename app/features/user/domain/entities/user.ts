export interface User {
  readonly id: number;
  readonly full_name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly status: string;
  readonly registered_at: string;
  readonly email_verified_at: string | null;
  readonly roles?: string[];
  readonly current_subscription?: {
    id: number;
    status: string;
    starts_at: string;
    ends_at: string | null;
    subscription_plan: { id: number; name: string; price: string };
  } | null;
  readonly statistics?: { events: number; photos: number; videos: number; total_media: number };
  readonly subscriptions?: {
    id: number;
    status: string;
    starts_at: string;
    ends_at: string | null;
    subscription_plan: { id: number; name: string; price: string };
  }[];
  readonly payments?: {
    id: number;
    provider: string;
    payment_method: string;
    amount: string;
    currency: string;
    status: string;
    external_reference: string | null;
    paid_at: string | null;
  }[];
  readonly events?: {
    id: number;
    name: string;
    event_date: string | null;
    photos_count: number;
    videos_count: number;
    total_media: number;
  }[];
}
