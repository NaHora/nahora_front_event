import { Routes, Route } from 'react-router-dom';
import { Panel } from '../pages/Panel';
import { Wod } from '../pages/Wod';
import { WodDescription } from '../pages/WodDescription';
import { PairCreate } from '../pages/PairCreate';
import { Category } from '../pages/Category';
import { CreateAccount } from '../pages/CreateAccount';
import { RegisteredTeams } from '../pages/RegisteredTeams';
import { Events } from '../pages/Events';
import { SignIn } from '../pages/SignIn';
import { Ranking } from '../pages/Ranking';
import { ProtectedRoute } from './Route';
import { Payments } from '../pages/Payments';
import { Filter } from '../pages/Filter';
import { Lots } from '../pages/Lots';
import SortTeam from '../pages/SortTeam';
import { Dashboard } from '../pages/Dashboard';
import { Athletes } from '../pages/Athletes';
import { Teams } from '../pages/Teams';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}

      <Route
        path="/"
        element={
          <ProtectedRoute type="public" redirectTo="/eventos">
            <SignIn />
          </ProtectedRoute>
        }
      />

      {/* Rotas privadas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/painel"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Panel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wod"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Wod />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wod-descricao"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <WodDescription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/duplas"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <PairCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categorias"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Category />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventos"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lotes"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Lots />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pagamentos"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inscritos"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <RegisteredTeams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/atletas"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Athletes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/times"
        element={
          <ProtectedRoute type="private" redirectTo="/">
            <Teams />
          </ProtectedRoute>
        }
      />
      {/* rotas totalmente publicas */}
      <Route path="/resultados/:eventId" element={<Filter />} />
      <Route path="/rank/:eventId" element={<Ranking />} />
      <Route path="/pelada" element={<SortTeam />} />
      <Route path="/inscricoes/:eventId" element={<CreateAccount />} />
    </Routes>
  );
}
