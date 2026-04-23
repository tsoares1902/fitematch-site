export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
  cache?: RequestCache;
}

export async function apiClient<T>(
  baseUrl: string,
  endpoint: string,
  { method = 'GET', token, body, cache = 'no-store' }: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache,
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseBody?.message ??
        `Request failed with status ${response.status}`,
    );
  }

  return responseBody as T;
}
