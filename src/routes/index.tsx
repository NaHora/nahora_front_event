import { Route, Routes } from 'react-router-dom';

import { Panel } from '../pages/Panel';
import { Filter } from '../pages/Filter';
import { Ranking } from '../pages/Ranking';
import { SignIn } from '../pages/SignIn';
import PrivateRoute, { ProtectedRouteProps } from './Route';
import { Wod } from '../pages/Wod';
import { WodDescription } from '../pages/WodDescription';
import { PairCreate } from '../pages/PairCreate';
import { Category } from '../pages/Category';
import { CreateAccount } from '../pages/CreateAccount';
import { RegisteredTeams } from '../pages/RegisteredTeams';
import { Events } from '../pages/Events';

const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
  authenticationPath: '/admin',
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<SignIn />} />
      <Route path="/" element={<CreateAccount />} />

      <Route path="/rank" element={<Ranking />} />
      <Route path="/inscritos" element={<RegisteredTeams />} />

      <Route
        path="/panel"
        element={
          <PrivateRoute {...defaultProtectedRouteProps} outlet={<Panel />} />
        }
      />

      <Route
        path="/wod"
        element={
          <PrivateRoute {...defaultProtectedRouteProps} outlet={<Wod />} />
        }
      />

      <Route
        path="/wod-descricao"
        element={
          <PrivateRoute
            {...defaultProtectedRouteProps}
            outlet={<WodDescription />}
          />
        }
      />
      <Route
        path="/duplas"
        element={
          <PrivateRoute
            {...defaultProtectedRouteProps}
            outlet={<PairCreate />}
          />
        }
      />

      <Route
        path="/categorias"
        element={
          <PrivateRoute {...defaultProtectedRouteProps} outlet={<Category />} />
        }
      />

      <Route
        path="/events"
        element={
          <PrivateRoute {...defaultProtectedRouteProps} outlet={<Events />} />
        }
      />

      {/* <Route path="/" element={<Filter />} /> */}
    </Routes>
  );
}
