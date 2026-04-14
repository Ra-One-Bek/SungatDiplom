import { Navigate } from 'react-router-dom';
import { useSelectedClub } from '../../context/SelectedClubContext';

export default function RequireSelectedClub({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedClubId } = useSelectedClub();

  if (!selectedClubId) {
    return <Navigate to="/select-club" replace />;
  }

  return <>{children}</>;
}