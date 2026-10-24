export interface MyStats {
  user_id: number;
  statistics: { events: number; photos: number; videos: number; total_media: number };
  events: { id: number; name: string; event_date: string | null; photos_count: number; videos_count: number; total_media: number }[];
  events_by_month: {
    year: number;
    total: number;
    date_basis: string;
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
}
