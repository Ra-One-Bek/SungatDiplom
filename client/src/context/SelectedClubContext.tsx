export type SelectedClub = {
  teamId: number;
  leagueId: number;
  season: number;
  name: string;
  logo?: string;
};

type SelectedClubContextValue = {
  selectedClub: SelectedClub | null;
  setSelectedClub: (club: SelectedClub | null) => void;
  clearSelectedClub: () => void;
};