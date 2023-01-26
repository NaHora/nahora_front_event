import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Panel } from "../pages/Panel";
import { Ranking } from "../pages/Ranking";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Ranking />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>
  );
}
