import { useSelectedClub } from '../context/SelectedClubContext';
import { clubThemes } from '../theme/clubThemes';
import SectionTitle from '../components/ui/SectionTitle';

const clubInfo = {
  astana: {
    name: 'FC Astana',
    description:
      'ФК Астана — один из сильнейших клубов Казахстана, многократный чемпион страны и участник еврокубков.',
  },
  kairat: {
    name: 'Kairat Almaty',
    description:
      'Кайрат — исторический клуб из Алматы, известный своей атакующей игрой и развитием молодых игроков.',
  },
  kaisar: {
    name: 'Kaisar',
    description:
      'Кайсар — крепкий клуб из Кызылорды, известный дисциплиной и командной игрой.',
  },
};

export default function AboutClub() {
  const { selectedClubId } = useSelectedClub();

  if (!selectedClubId) return null;

  const club = clubInfo[selectedClubId];

  return (
    <div className="space-y-6">
      <SectionTitle title="О клубе" subtitle={club.name} />

      <div
        className="p-6 rounded-2xl"
        style={{ backgroundColor: 'var(--secondary)' }}
      >
        <p className="text-lg">{club.description}</p>
      </div>
    </div>
  );
}