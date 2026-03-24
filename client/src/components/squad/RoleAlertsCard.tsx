import Card from '../ui/Card';

interface RoleAlertItem {
  slotId: number;
  playerId: number;
  playerName: string;
  naturalPosition: string;
  assignedRole: string;
  compatibility: number;
  alertLevel: 'ok' | 'warning' | 'danger';
  message: string;
}

interface RoleAlertsCardProps {
  alerts: RoleAlertItem[];
}

export default function RoleAlertsCard({ alerts }: RoleAlertsCardProps) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-white">Ролевые предупреждения</h3>

      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.slotId}
            className={`rounded-2xl border p-4 ${
              alert.alertLevel === 'ok'
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : alert.alertLevel === 'warning'
                ? 'border-amber-500/30 bg-amber-500/10'
                : 'border-rose-500/30 bg-rose-500/10'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{alert.playerName}</p>
                <p className="mt-1 text-sm text-slate-300">
                  Естественная позиция: {alert.naturalPosition}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Роль в схеме: {alert.assignedRole}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-300">Совместимость</p>
                <p className="text-lg font-bold text-white">
                  {alert.compatibility}%
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}