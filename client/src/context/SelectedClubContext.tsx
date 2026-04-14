import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clubThemes } from '../theme/clubThemes';

export type SelectedClubId = 'astana' | 'kairat' | 'kaisar';

type SelectedClubContextValue = {
  selectedClubId: SelectedClubId | null;
  setSelectedClubId: (clubId: SelectedClubId) => void;
  clearSelectedClubId: () => void;
};

const STORAGE_KEY = 'selectedClubId';

const SelectedClubContext = createContext<SelectedClubContextValue | undefined>(
  undefined,
);

export function SelectedClubProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedClubId, setSelectedClubIdState] = useState<SelectedClubId | null>(
    null,
  );

  useEffect(() => {
    const savedClubId = localStorage.getItem(STORAGE_KEY) as SelectedClubId | null;

    if (savedClubId === 'astana' || savedClubId === 'kairat' || savedClubId === 'kaisar') {
      setSelectedClubIdState(savedClubId);
    }
  }, []);

  useEffect(() => {
    if (!selectedClubId) return;

    const theme = clubThemes[selectedClubId];

    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);
  }, [selectedClubId]);

  const value = useMemo(
    () => ({
      selectedClubId,
      setSelectedClubId: (clubId: SelectedClubId) => {
        localStorage.setItem(STORAGE_KEY, clubId);
        setSelectedClubIdState(clubId);
      },
      clearSelectedClubId: () => {
        localStorage.removeItem(STORAGE_KEY);
        setSelectedClubIdState(null);
      },
    }),
    [selectedClubId],
  );

  return (
    <SelectedClubContext.Provider value={value}>
      {children}
    </SelectedClubContext.Provider>
  );
}

export function useSelectedClub() {
  const context = useContext(SelectedClubContext);

  if (!context) {
    throw new Error('useSelectedClub must be used within SelectedClubProvider');
  }

  return context;
}