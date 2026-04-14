import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ClubIntroScene from '../components/preloader/ClubIntroScene';
import { useSelectedClub } from '../context/SelectedClubContext';
import { clubThemes } from '../theme/clubThemes';

const introContent = {
  astana: {
    subtitle:
      'Добро пожаловать в цифровую тренерскую платформу FC Astana. Аналитика, состав, AI-рекомендации и клубная тема загружены.',
  },
  kairat: {
    subtitle:
      'Добро пожаловать в цифровую тренерскую платформу Kairat Almaty. Атмосфера, стиль и аналитика адаптированы под клуб.',
  },
  kaisar: {
    subtitle:
      'Добро пожаловать в цифровую тренерскую платформу Kaisar. Система готова к работе с составом, матчами и клубной аналитикой.',
  },
};

export default function ClubIntro() {
  const navigate = useNavigate();
  const { selectedClubId } = useSelectedClub();

  const data = useMemo(() => {
    if (!selectedClubId) return null;

    const theme = clubThemes[selectedClubId];
    return {
      clubId: selectedClubId,
      logo: `/logos/${selectedClubId}.png`,
      title: theme.name,
      subtitle: introContent[selectedClubId].subtitle,
    };
  }, [selectedClubId]);

  if (!data) return null;

  return (
    <ClubIntroScene
      clubId={data.clubId}
      logo={data.logo}
      title={data.title}
      subtitle={data.subtitle}
      onContinue={() => navigate('/')}
    />
  );
}