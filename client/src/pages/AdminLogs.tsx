import { useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { getAdminLogs, type AdminActionType, type AdminLogItem } from '../services/adminLogs';

const actionLabels: Record<AdminActionType, string> = {
  CREATE_LOCAL_PLAYER: 'Создание локального игрока',
  UPDATE_LOCAL_PLAYER: 'Изменение локального игрока',
  DEACTIVATE_LOCAL_PLAYER: 'Отключение локального игрока',
  RESTORE_LOCAL_PLAYER: 'Восстановление локального игрока',
  UPSERT_PLAYER_OVERRIDE: 'Изменение API игрока',
  UPDATE_USER_ROLE: 'Изменение роли пользователя',
};

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(50);
  const [selectedAction, setSelectedAction] = useState<'ALL' | AdminActionType>('ALL');

  async function loadLogs(nextLimit = limit) {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminLogs(nextLimit);
      setLogs(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить журнал действий');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs(limit);
  }, [limit]);

  const filteredLogs = useMemo(() => {
    if (selectedAction === 'ALL') return logs;
    return logs.filter((log) => log.actionType === selectedAction);
  }, [logs, selectedAction]);

  function formatDate(value: string) {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  function formatPayload(payloadJson: string | null) {
    if (!payloadJson) return null;

    try {
      const parsed = JSON.parse(payloadJson);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return payloadJson;
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Админ · Журнал действий"
        subtitle="История действий администратора по игрокам, ролям и overrides"
      />

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedAction}
              onChange={(e) =>
                setSelectedAction(e.target.value as 'ALL' | AdminActionType)
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
            >
              <option value="ALL">Все действия</option>
              {Object.entries(actionLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
            >
              <option value={20}>20 записей</option>
              <option value={50}>50 записей</option>
              <option value={100}>100 записей</option>
            </select>
          </div>

          <Button onClick={() => loadLogs(limit)} disabled={loading}>
            {loading ? 'Обновление...' : 'Обновить'}
          </Button>
        </div>
      </Card>

      {error ? (
        <Card>
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        </Card>
      ) : null}

      <Card>
        <h3 className="text-lg font-black text-slate-900">
          Записи журнала
        </h3>

        {loading ? (
          <p className="mt-4 text-slate-500">Загрузка...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="mt-4 text-slate-500">Записей пока нет.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {actionLabels[log.actionType] ?? log.actionType}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {log.entityType}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        ID: {log.entityId}
                      </span>
                    </div>

                    <p className="mt-3 font-semibold text-slate-900">
                      {log.message || 'Без описания'}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {log.adminUser.name} ({log.adminUser.email}) •{' '}
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>

                {log.payloadJson ? (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Payload
                    </p>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-slate-700">
                      {formatPayload(log.payloadJson)}
                    </pre>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}