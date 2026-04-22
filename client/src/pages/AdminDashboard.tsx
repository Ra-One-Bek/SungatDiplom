import Card from '../components/ui/Card';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Админ-панель"
        subtitle="Управление данными, игроками и журналом изменений"
      />

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Добро пожаловать, {user?.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Роль: {user?.role} • {user?.email}
            </p>
          </div>

          <Button onClick={logout}>Выйти</Button>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/admin/players">
          <Card className="h-full transition hover:border-[var(--club-primary)]">
            <h3 className="text-lg font-black text-slate-900">
              Игроки
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Локальные игроки и изменения API-игроков
            </p>
          </Card>
        </Link>

        <Link to="/admin/logs">
          <Card className="h-full transition hover:border-[var(--club-primary)]">
            <h3 className="text-lg font-black text-slate-900">
              Журнал действий
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              История действий администратора
            </p>
          </Card>
        </Link>

        <Card>
          <h3 className="text-lg font-black text-slate-900">
            Статус системы
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Backend авторизация и RBAC уже подключены
          </p>
        </Card>
      </div>
    </div>
  );
}