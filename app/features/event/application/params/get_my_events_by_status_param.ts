export interface GetMyEventsByStatusParam {
  token: string;
  page: number;
  status: 'active' | 'inactive';
}
