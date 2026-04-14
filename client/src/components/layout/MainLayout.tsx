import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSelectedClub } from '../../context/SelectedClubContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const { selectedClubId, clearSelectedClubId } = useSelectedClub();

  function handleChangeClub() {
    clearSelectedClubId();
    navigate('/select-club');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <p className="text-sm text-slate-400">Выбранный клуб</p>
            <p className="text-lg font-semibold capitalize">{selectedClubId ?? '—'}</p>
          </div>

          <button
            onClick={handleChangeClub}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 transition"
          >
            Сменить клуб
          </button>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}