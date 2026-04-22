import { apiGet } from './api';

export type AdminActionType =
  | 'CREATE_LOCAL_PLAYER'
  | 'UPDATE_LOCAL_PLAYER'
  | 'DEACTIVATE_LOCAL_PLAYER'
  | 'RESTORE_LOCAL_PLAYER'
  | 'UPSERT_PLAYER_OVERRIDE'
  | 'UPDATE_USER_ROLE';

export type AdminLogItem = {
  id: number;
  adminUserId: number;
  actionType: AdminActionType;
  entityType: string;
  entityId: string;
  message: string | null;
  payloadJson: string | null;
  createdAt: string;
  adminUser: {
    id: number;
    email: string;
    name: string;
    role: 'ADMIN' | 'EDITOR' | 'USER';
  };
};

export function getAdminLogs(limit = 50) {
  return apiGet<AdminLogItem[]>(`/admin/logs?limit=${limit}`);
}