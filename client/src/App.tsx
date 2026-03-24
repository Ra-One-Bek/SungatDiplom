import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Players from './pages/Players';
import PlayerDetails from './pages/PlayerDetails';
import ClubStats from './pages/ClubStats';
import SquadManager from './pages/SquadManager';
import Matches from './pages/Matches';
import NotFound from './pages/NotFound';
import Injuries from './pages/Injuries';
import TrainingRecommendations from './pages/TrainingRecommendations';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerDetails />} />
        <Route path="/club-stats" element={<ClubStats />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/injuries" element={<Injuries />} />
        <Route path="/training-recommendations" element={<TrainingRecommendations />} />
        <Route path="/squad-manager" element={<SquadManager />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}