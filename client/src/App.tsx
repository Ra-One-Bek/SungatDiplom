import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import RequireSelectedClub from './components/routing/RequireSelectedClub';

import Home from './pages/Home';
import Players from './pages/Players';
import PlayerDetails from './pages/PlayerDetails';
import ClubStats from './pages/ClubStats';
import SquadManager from './pages/SquadManager';
import Matches from './pages/Matches';
import Injuries from './pages/Injuries';
import TrainingRecommendations from './pages/TrainingRecommendations';
import SelectClub from './pages/SelectClub';
import AboutClub from './pages/AboutClub';
import ClubIntro from './pages/ClubIntro';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlayers from './pages/AdminPlayers';
import AdminRoute from './auth/AdminRoute';
import AdminOverrides from './pages/AdminOverrides';

export default function App() {
  return (
    <Routes>
      <Route path="/select-club" element={<SelectClub />} />

      <Route
        path="/club-intro"
        element={
          <RequireSelectedClub>
            <ClubIntro />
          </RequireSelectedClub>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <Home />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/players"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <Players />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/players/:id"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <PlayerDetails />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/club-stats"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <ClubStats />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/about"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <AboutClub />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/squad-manager"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <SquadManager />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/matches"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <Matches />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/injuries"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <Injuries />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/training-recommendations"
        element={
          <RequireSelectedClub>
            <MainLayout>
              <TrainingRecommendations />
            </MainLayout>
          </RequireSelectedClub>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <RequireSelectedClub>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </RequireSelectedClub>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/players"
        element={
          <AdminRoute>
            <RequireSelectedClub>
              <MainLayout>
                <AdminPlayers />
              </MainLayout>
            </RequireSelectedClub>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/overrides"
        element={
          <AdminRoute>
            <RequireSelectedClub>
              <MainLayout>
                <AdminOverrides />
              </MainLayout>
            </RequireSelectedClub>
          </AdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}