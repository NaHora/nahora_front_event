import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Panel } from "../pages/Panel";
import { Filter } from "../pages/Filter";
import { Ranking } from "../pages/Ranking";
import { SignIn } from "../pages/SignIn";
import PrivateRoute, { ProtectedRouteProps } from "./Route";

const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
  authenticationPath: "/admin",
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<SignIn />} />

      <Route path="/rank" element={<Ranking />} />

      <Route
        path="/panel"
        element={
          <PrivateRoute {...defaultProtectedRouteProps} outlet={<Panel />} />
        }
      />
      <Route path="/" element={<Filter />} />
    </Routes>
  );
}
