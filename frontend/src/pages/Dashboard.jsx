import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  Home,
  MapPin,
  BarChart3,
  FileText,
  History,
  Bell,
  User,
  LogOut,
  AlertTriangle,
  Thermometer,
  Droplet,
  Map,
  TrendingUp,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [notifications, setNotifications] = useState(0);
  
  // Estados para dados do backend
  const [stats, setStats] = useState({
    temperaturaMedia: 0,
    umidadeMedia: 0,
    totalAreas: 0,
    alertasAtivos: 0,
  });
  const [sensoresLive, setSensoresLive] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes", badge: notifications },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  // Buscar dados do backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Buscar estatísticas gerais
        const statsResponse = await api.get('/dashboard/stats');
        setStats({
          temperaturaMedia: statsResponse.data.temperaturaMedia || 0,
          umidadeMedia: statsResponse.data.umidadeMedia || 0,
          totalAreas: statsResponse.data.totalAreas || 0,
          alertasAtivos: statsResponse.data.alertasAtivos || 0,
        });
        setNotifications(statsResponse.data.alertasAtivos || 0);

        // Buscar dados dos 3 sensores em tempo real
        const sensoresResponse = await api.get('/dashboard/sensores-live');
        setSensoresLive(sensoresResponse.data || []);
        
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Atualizar dados a cada 60 segundos (1 minuto)
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'Sem dados';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para obter cor do status
  const getStatusColor = (tipo, valor) => {
    if (tipo === 'umidade') {
      if (valor < 30) return 'text-red-600';
      if (valor < 60) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (tipo === 'temperatura') {
      if (valor > 30) return 'text-red-600';
      if (valor > 25) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  return (
    <div 
      className="min-h-screen h-screen flex relative overflow-hidden" 
      style={{ fontFamily: "Albert Sans, sans-serif" }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #E0F7FA 0%, #E8F5E9 50%, #B2EBF2 100%)",
        }}
      ></div>

      {/* Sidebar com Glassmorphism */}
      <aside 
        className="w-64 flex flex-col"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h1 className="font-title text-2xl font-bold bg-gradient-to-r from-blue to-green text-transparent bg-clip-text">
            UmiVita
          </h1>
          <p className="text-xs text-gray-700 mt-1">Monitoramento Ambiental</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activePage === item.id
                    ? "bg-gradient-to-r from-blue to-green text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/30"
                }`}
              >
                <Icon size={20} />
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-white/30 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header com Glassmorphism */}
        <header 
          className="p-6 shrink-0"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Bem-vindo, {user?.nome || 'Usuário'}! 👋
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Aqui está o resumo do seu monitoramento hoje
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notificações */}
              <button className="relative p-3 hover:bg-white/30 rounded-full transition-all duration-300">
                <Bell size={20} className="text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue to-green flex items-center justify-center text-white font-bold">
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Card 1 - Temperatura Média */}
          <div
            className="col-span-3 rounded-2xl p-6 hover:scale-105 transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
                  boxShadow: "0 8px 20px rgba(79, 195, 247, 0.5)",
                }}
              >
                <Thermometer size={26} className="text-white" strokeWidth={2.5} />
              </div>
              <Activity size={16} className={loading ? "animate-pulse text-green-500" : "text-gray-400"} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Temperatura Média</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : `${stats.temperaturaMedia.toFixed(1)}°C`}
              </p>
            </div>
          </div>

          {/* Card 2 - Umidade Média */}
          <div
            className="col-span-3 rounded-2xl p-6 hover:scale-105 transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
                  boxShadow: "0 8px 20px rgba(79, 195, 247, 0.5)",
                }}
              >
                <Droplet size={26} className="text-white" strokeWidth={2.5} />
              </div>
              <Activity size={16} className={loading ? "animate-pulse text-green-500" : "text-gray-400"} />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Umidade Média</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : `${stats.umidadeMedia.toFixed(1)}%`}
              </p>
            </div>
          </div>

          {/* Card 3 - Áreas Monitoradas */}
          <div
            className="col-span-3 rounded-2xl p-6 hover:scale-105 transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #5ADB62 0%, #2EE9B4 100%)",
                  boxShadow: "0 8px 20px rgba(90, 219, 98, 0.6)",
                }}
              >
                <Map size={26} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Áreas Monitoradas</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.totalAreas}
              </p>
            </div>
          </div>

          {/* Card 4 - Alertas Ativos */}
          <div
            className="col-span-3 rounded-2xl p-6 hover:scale-105 transition-all duration-300 flex flex-col justify-between"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: stats.alertasAtivos > 0 
                    ? "linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)"
                    : "linear-gradient(135deg, #5ADB62 0%, #2EE9B4 100%)",
                  boxShadow: stats.alertasAtivos > 0
                    ? "0 8px 20px rgba(255, 107, 107, 0.6)"
                    : "0 8px 20px rgba(90, 219, 98, 0.6)",
                }}
              >
                <AlertTriangle size={26} className="text-white" strokeWidth={2.5} />
              </div>
              {stats.alertasAtivos > 0 && (
                <span className="animate-pulse text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                  ATENÇÃO
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Alertas Ativos</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? '...' : stats.alertasAtivos}
              </p>
            </div>
          </div>

          {/* Card 5 - Sensores em Tempo Real */}
          <div
            className="col-span-12 rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Sensores em Tempo Real</h3>
              <div className="flex items-center gap-2">
                <Activity size={16} className={loading ? "animate-pulse text-green-500" : "text-green-500"} />
                <span className="text-xs text-gray-600">Atualizado agora</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {sensoresLive.length > 0 ? (
                sensoresLive.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="bg-white/40 rounded-xl p-4 border border-white/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-gray-700 capitalize">
                        Sensor {sensor.id} - {sensor.tipo}
                      </h4>
                      <div className={`w-2 h-2 rounded-full ${sensor.dataHora ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    </div>
                    
                    <div className="space-y-2">
                      {sensor.temperatura > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Temperatura:</span>
                          <span className={`text-sm font-bold ${getStatusColor('temperatura', sensor.temperatura)}`}>
                            {sensor.temperatura.toFixed(1)}°C
                          </span>
                        </div>
                      )}
                      
                      {sensor.umidade > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Umidade:</span>
                          <span className={`text-sm font-bold ${getStatusColor('umidade', sensor.umidade)}`}>
                            {sensor.umidade}%
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Contaminação:</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          sensor.nivel_contaminacao === 'alto' ? 'bg-red-100 text-red-600' :
                          sensor.nivel_contaminacao === 'medio' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {sensor.nivel_contaminacao}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        {formatDate(sensor.dataHora)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aguardando dados dos sensores...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
