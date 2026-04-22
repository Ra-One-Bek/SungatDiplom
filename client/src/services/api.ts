const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `${options.method || 'GET'} ${endpoint} failed`);
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(endpoint: string) {
  return request<T>(endpoint, { method: 'GET' });
}

export function apiPost<T, B = unknown>(endpoint: string, body: B) {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPatch<T, B = unknown>(endpoint: string, body: B) {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(endpoint: string) {
  return request<T>(endpoint, {
    method: 'DELETE',
  });
}