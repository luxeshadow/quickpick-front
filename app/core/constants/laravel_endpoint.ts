export class LaravelEndpoint {
  static readonly baseUrl = 'https://quickpick-back.onrender.com';

  static url(path: string): string {
    return this.baseUrl + '/' + path.replace(/^\/+/, '');
  }

  static headers(token?: string | null): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (token?.trim()) {
      headers.Authorization = 'Bearer ' + token.trim();
    }

    return headers;
  }
}
