import { apiGet, apiPatch, apiPost } from './api';

export type PlayerOverride = {
  id: number;
  externalPlayerId: number;
  clubId: string;

  customName: string | null;
  customNumber: number | null;
  customPosition: string | null;
  customNationality: string | null;
  customPhoto: string | null;

  note: string | null;
  isHidden: boolean;

  updatedById: number;
  updatedAt: string;
};

export function getOverrides(clubId: string) {
  return apiGet<PlayerOverride[]>(`/admin/players/overrides?clubId=${clubId}`);
}

export function upsertOverride(body: {
  externalPlayerId: number;
  clubId: string;

  customName?: string;
  customNumber?: number;
  customPosition?: string;
  customNationality?: string;
  customPhoto?: string;

  note?: string;
  isHidden?: boolean;
}) {
  return apiPost<PlayerOverride, typeof body>(
    '/admin/players/overrides',
    body,
  );
}

export function updateOverride(
  id: number,
  body: Partial<PlayerOverride>,
) {
  return apiPatch<PlayerOverride, typeof body>(
    `/admin/players/overrides/${id}`,
    body,
  );
}