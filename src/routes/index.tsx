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
import SortTeam from '../pages/sortTeam';
import { Payments } from '../pages/Payments';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute type="public" redirectTo="/events">
            <SignIn />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute type="public" redirectTo="/events">
            <CreateAccount />
          </ProtectedRoute>
        }
      />

      {/* Rotas privadas */}
      <Route
        path="/panel"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <Panel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wod"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <Wod />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wod-descricao"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <WodDescription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/duplas"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <PairCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categorias"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <Category />
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventos"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inscritos"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <RegisteredTeams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pagamentos"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pelada"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <SortTeam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rank"
        element={
          <ProtectedRoute type="public" redirectTo="/events">
            <Ranking />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
