export interface UpdateEventStatusParam {
  token: string;
  id: number;
  status: 'active' | 'inactive';
}
