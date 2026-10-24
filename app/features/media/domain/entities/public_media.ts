export interface PublicMedia { id: number; filename: string; width: number; height: number; url: string; }
export interface PublicMediaPage {
  media: PublicMedia[];
  pagination: { per_page: number; next_cursor: string | null; previous_cursor: string | null; has_more: boolean };
}
