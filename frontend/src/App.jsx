import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Support from "./pages/Support";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import ManageAreas from "./pages/ManageAreas";
import Charts from "./pages/Charts";
import ChartDetails from "./pages/ChartDetails";
import Reports from "./pages/Reports";
import HistoryPage from "./pages/HistoryPage";
import FullHistory from "./pages/FullHistory";
import Notifications from "./pages/Notifications";
import AllNotifications from "./pages/AllNotifications";
import Profile from "./pages/Profile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/recuperar-senha" element={<ResetPassword />} />
        <Route path="/suporte" element={<Support />} />
        <Route path="/quem-somos" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/areas" element={<ManageAreas />} />
        <Route path="/dashboard/graficos" element={<Charts />} />
        <Route path="/dashboard/graficos/:tipo" element={<ChartDetails />} />
        <Route path="/dashboard/relatorios" element={<Reports />} />
        <Route path="/dashboard/historico" element={<HistoryPage />} />
        <Route path="/dashboard/historico/completo" element={<FullHistory />} />
        <Route path="/dashboard/notificacoes" element={<Notifications />} />
        <Route path="/dashboard/notificacoes/todas" element={<AllNotifications />} />
        <Route path="/dashboard/perfil" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
