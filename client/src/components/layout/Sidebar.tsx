import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Главная', path: '/' },
  { label: 'Игроки', path: '/players' },
  { label: 'Матчи', path: '/matches' },
  { label: 'Травмы', path: '/injuries' },
  { label: 'Статистика клуба', path: '/club-stats' },
  { label: 'Менеджер состава', path: '/squad-manager' },
  { label: 'Тренировки AI', path: '/training-recommendations' },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-950 p-4 md:block">
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-lg font-bold text-white">ATM Panel</h2>
        <p className="mt-1 text-sm text-slate-400">
          Football analytics dashboard
        </p>
      </div>

      <nav className="space-y-2 sticky top-20">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}