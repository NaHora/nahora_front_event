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
import { Filter } from '../pages/Filter';
import { Lots } from '../pages/Lots';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute type="public" redirectTo="/eventos">
            <SignIn />
          </ProtectedRoute>
        }
      />

      {/* Rotas privadas */}
      <Route
        path="/painel"
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
        path="/lotes"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <Lots />
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
        path="/inscritos"
        element={
          <ProtectedRoute type="private" redirectTo="/admin">
            <RegisteredTeams />
          </ProtectedRoute>
        }
      />
      {/* rotas totalmente publicas */}
      <Route path="/resultados" element={<Filter />} />
      <Route path="/rank" element={<Ranking />} />
      <Route path="/pelada" element={<SortTeam />} />
      <Route path="/inscricoes/:eventId" element={<CreateAccount />} />
    </Routes>
  );
}
