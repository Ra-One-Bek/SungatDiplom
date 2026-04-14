import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedClub, type SelectedClubId } from '../context/SelectedClubContext';
import { getSupportedClubs } from '../services/club';

type SupportedClub = {
  id: SelectedClubId;
  name: string;
  shortName: string;
  league: string;
  season: number;
  teamId: number;
  leagueId: number;
  country: string;
  stadium?: string;
  founded?: number;
  logo?: string;
};

export default function SelectClub() {
  const navigate = useNavigate();
  const { selectedClubId, setSelectedClubId } = useSelectedClub();
  const [clubs, setClubs] = useState<SupportedClub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClubs() {
      try {
        const data = await getSupportedClubs();
        setClubs(data);
      } catch (error) {
        console.error('Failed to load clubs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadClubs();
  }, []);

  useEffect(() => {
    if (selectedClubId) {
      navigate('/', { replace: true });
    }
  }, [selectedClubId, navigate]);

  function handleSelectClub(clubId: SelectedClubId) {
    setSelectedClubId(clubId);
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Выберите клуб КПЛ</h1>
          <p className="text-slate-400">
            Доступные команды: Астана, Кайрат, Кайсар
          </p>
        </div>

        {loading ? (
          <div className="text-center text-slate-300">Загрузка клубов...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">{club.name}</h2>
                  <p className="text-slate-400">{club.shortName}</p>
                </div>

                <div className="space-y-2 text-sm text-slate-300 mb-6">
                  <p>Лига: {club.league}</p>
                  <p>Сезон: {club.season}</p>
                  <p>Страна: {club.country}</p>
                  <p>Стадион: {club.stadium ?? '—'}</p>
                </div>

                <button
                  onClick={() => handleSelectClub(club.id)}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-3 font-medium"
                >
                  Выбрать
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}