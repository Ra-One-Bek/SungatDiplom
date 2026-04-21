import { NavLink } from 'react-router-dom';
import { useSelectedClub } from '../../context/SelectedClubContext';

const navItems = [
  { label: 'Главная', path: '/' },
  { label: 'Игроки', path: '/players' },
  { label: 'Матчи', path: '/matches' },
  { label: 'Травмы', path: '/injuries' },
  { label: 'Статистика клуба', path: '/club-stats' },
  { label: 'О клубе', path: '/about' },
  { label: 'Менеджер состава', path: '/squad-manager' },
  { label: 'Тренировки AI', path: '/training-recommendations' },
];

const clubDescriptions = {
  astana: 'Голубой + золотой стиль',
  kairat: 'Жёлто-чёрная энергия',
  kaisar: 'Красно-белый характер',
};

export default function Sidebar() {
  const { selectedClubId, currentTheme } = useSelectedClub();

  return (
    <aside className="hidden w-[310px] shrink-0 border-r border-slate-200 bg-white xl:block">
      <div className="flex h-full flex-col">
        <div
          className="m-4 rounded-[28px] p-6 text-white shadow-xl"
          style={{ background: 'var(--club-gradient)' }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-lg font-black backdrop-blur">
              {currentTheme?.shortName ?? 'KPL'}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/80">
                Coach Suite
              </p>
              <h2 className="text-2xl font-black">
                {currentTheme?.name ?? 'Kazakhstan Premier League'}
              </h2>
            </div>
          </div>

          <p className="text-sm leading-6 text-white/90">
            {selectedClubId
              ? clubDescriptions[selectedClubId]
              : 'Выберите клуб, чтобы загрузить персонализированную аналитику.'}
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4 pb-6">
          <div className='sticky top-10 '>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: 'var(--club-gradient)' }
                    : undefined
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}