import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Importar páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageAreas from './pages/ManageAreas';
import Charts from './pages/Charts';
import ChartDetails from './pages/ChartDetails';
import Reports from './pages/Reports';
import ReportView from './pages/ReportView';
import History from './pages/HistoryPage';
import FullHistory from './pages/FullHistory';
import Notifications from './pages/Notifications';
import AllNotifications from './pages/AllNotifications'; // ⬅️ NOVA IMPORTAÇÃO
import Profile from './pages/Profile';
import About from './pages/About';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* PÁGINA INICIAL - HOME */}
      <Route path="/" element={<Home />} />
      
      {/* PÁGINAS PÚBLICAS */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/cadastro" 
        element={user ? <Navigate to="/dashboard" /> : <Register />} 
      />
      <Route path="/about" element={<About />} />

      {/* PÁGINAS PROTEGIDAS - DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/areas"
        element={
          <PrivateRoute>
            <ManageAreas />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/graficos"
        element={
          <PrivateRoute>
            <Charts />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/graficos/:tipo"
        element={
          <PrivateRoute>
            <ChartDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/relatorios"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/relatorios/view/:id"
        element={
          <PrivateRoute>
            <ReportView />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/historico"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/historico/completo"
        element={
          <PrivateRoute>
            <FullHistory />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/notificacoes"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />
      {/* ⬇️ NOVA ROTA - TODAS AS NOTIFICAÇÕES */}
      <Route
        path="/dashboard/notificacoes/todas"
        element={
          <PrivateRoute>
            <AllNotifications />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/perfil"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* ROTAS INVÁLIDAS REDIRECIONAM PARA HOME */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
