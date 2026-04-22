import { apiDelete, apiGet, apiPatch, apiPost } from './api';

export type AdminPlayer = {
  id: number;
  clubId: string;
  name: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  number: number | null;
  position: string;
  nationality: string | null;
  photo: string | null;
  isActive: boolean;
  createdById: number;
  createdAt: string;
  updatedAt: string;
};

export function getAdminPlayers(clubId?: string, includeInactive = false) {
  const params = new URLSearchParams();

  if (clubId) params.set('clubId', clubId);
  if (includeInactive) params.set('includeInactive', 'true');

  const query = params.toString();

  return apiGet<AdminPlayer[]>(
    `/admin/players/local${query ? `?${query}` : ''}`,
  );
}

export function createAdminPlayer(body: {
  clubId: string;
  name: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  number?: number;
  position: string;
  nationality?: string;
  photo?: string;
}) {
  return apiPost<AdminPlayer, typeof body>('/admin/players/local', body);
}

export function updateAdminPlayer(
  id: number,
  body: Partial<{
    clubId: string;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    number: number;
    position: string;
    nationality: string;
    photo: string;
  }>,
) {
  return apiPatch<AdminPlayer, typeof body>(`/admin/players/local/${id}`, body);
}

export function deactivateAdminPlayer(id: number) {
  return apiDelete<AdminPlayer>(`/admin/players/local/${id}`);
}

export function restoreAdminPlayer(id: number) {
  return apiPatch<AdminPlayer, Record<string, never>>(
    `/admin/players/local/${id}/restore`,
    {},
  );
}