import { apiGet, apiPost } from './api';

type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  createdAt: string;
};

type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

export function loginRequest(body: { email: string; password: string }) {
  return apiPost<LoginResponse, typeof body>('/auth/login', body);
}

export function getMe() {
  return apiGet<AuthUser>('/auth/me');
}