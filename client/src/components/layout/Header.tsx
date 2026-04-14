import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedClub } from '../../context/SelectedClubContext';

const clubLabels = {
  astana: 'FC Astana',
  kairat: 'Kairat Almaty',
  kaisar: 'Kaisar',
};

export default function Header() {
  const navigate = useNavigate();
  const { selectedClubId, clearSelectedClubId, currentTheme } = useSelectedClub();

  const subtitle = useMemo(() => {
    if (!selectedClubId) return 'Аналитическая платформа тренера';
    return `AI-анализ состава, игроков и матчей — ${clubLabels[selectedClubId]}`;
  }, [selectedClubId]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 xl:px-8">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg"
            style={{ background: 'var(--club-gradient)' }}
          >
            {currentTheme?.shortName ?? 'KPL'}
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              KPL Coach Platform
            </h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedClubId ? (
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 md:block">
              Активный клуб: {clubLabels[selectedClubId]}
            </div>
          ) : null}

          <button
            onClick={() => {
              clearSelectedClubId();
              navigate('/select-club');
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            Сменить клуб
          </button>
        </div>
      </div>
    </header>
  );
}