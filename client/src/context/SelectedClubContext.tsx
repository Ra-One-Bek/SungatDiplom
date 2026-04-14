import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { clubThemes, type ClubThemeId } from '../theme/clubThemes';

export type SelectedClubId = ClubThemeId;

type SelectedClubContextValue = {
  selectedClubId: SelectedClubId | null;
  setSelectedClubId: (clubId: SelectedClubId) => void;
  clearSelectedClubId: () => void;
  currentTheme: (typeof clubThemes)[ClubThemeId] | null;
};

const STORAGE_KEY = 'selectedClubId';

const SelectedClubContext = createContext<
  SelectedClubContextValue | undefined
>(undefined);

export function SelectedClubProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedClubId, setSelectedClubIdState] =
    useState<SelectedClubId | null>(null);

  useEffect(() => {
    const savedClubId = localStorage.getItem(STORAGE_KEY) as SelectedClubId | null;

    if (
      savedClubId === 'astana' ||
      savedClubId === 'kairat' ||
      savedClubId === 'kaisar'
    ) {
      setSelectedClubIdState(savedClubId);
    }
  }, []);

  useEffect(() => {
    const fallback = clubThemes.astana;
    const theme = selectedClubId ? clubThemes[selectedClubId] : fallback;

    document.documentElement.style.setProperty('--club-primary', theme.primary);
    document.documentElement.style.setProperty('--club-secondary', theme.secondary);
    document.documentElement.style.setProperty('--club-accent', theme.accent);
    document.documentElement.style.setProperty('--club-surface', theme.surface);
    document.documentElement.style.setProperty('--club-text', theme.text);
    document.documentElement.style.setProperty('--club-muted', theme.muted);
    document.documentElement.style.setProperty('--club-gradient', theme.gradient);
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
      currentTheme: selectedClubId ? clubThemes[selectedClubId] : null,
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