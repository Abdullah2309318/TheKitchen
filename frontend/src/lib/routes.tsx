import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Callback from "../pages/Callback";
import CreateTeam from "../pages/CreateTeam";
import EditTeams from "../pages/EditTeams";
import Teams from "../pages/Teams";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
      <Route path="/one" element={<CreateTeam />} />
      <Route path="/two" element={<EditTeams />} />
      <Route path="/three" element={<Teams />} />
    </Routes>
  );
}
