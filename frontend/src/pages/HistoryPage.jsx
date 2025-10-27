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
  Clock,
  AlertTriangle,
  Thermometer,
  Droplet,
  Activity,
} from "lucide-react";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("historico");
  const [notifications, setNotifications] = useState(0);
  
  // Estados
  const [ultimosEventos, setUltimosEventos] = useState([]);
  const [stats, setStats] = useState({
    totalEventos: 0,
    alertasGerados: 0,
    leiturasTemp: 0,
    leiturasUmid: 0,
  });
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

  useEffect(() => {
    fetchHistoricoResumo();
    
    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchHistoricoResumo, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistoricoResumo = async () => {
    try {
      setLoading(true);
      
      // Buscar últimos 3 eventos
      const responseEventos = await api.get('/historicos?limit=3');
      const dados = responseEventos.data.data || responseEventos.data;
      setUltimosEventos(Array.isArray(dados) ? dados.slice(0, 3) : []);
      
      // Buscar estatísticas
      const responseStats = await api.get('/historicos/stats');
      setStats({
        totalEventos: responseStats.data.totalEventos || 0,
        alertasGerados: responseStats.data.alertasGerados || 0,
        leiturasTemp: responseStats.data.leiturasTemp || 0,
        leiturasUmid: responseStats.data.leiturasUmid || 0,
      });
      
      // Buscar notificações não lidas
      const responseNotif = await api.get('/dashboard/stats');
      setNotifications(responseNotif.data.alertasAtivos || 0);
      
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  const getEventIcon = (event) => {
    const tipo = event.sensor?.tipo || '';
    if (tipo.includes('temperatura')) return Thermometer;
    if (tipo.includes('umidade')) return Droplet;
    return AlertTriangle;
  };

  const getEventColor = (event) => {
    const nivel = event.nivel_contaminacao || 'baixo';
    if (nivel === 'alto') return { color: '#FF6B6B', colorEnd: '#FF8E53' };
    if (nivel === 'medio') return { color: '#FFA726', colorEnd: '#FFB74D' };
    return { color: '#4FC3F7', colorEnd: '#29B6F6' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="min-h-screen h-screen flex relative overflow-hidden" 
      style={{ fontFamily: "Albert Sans, sans-serif" }}
    >
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #E0F7FA 0%, #E8F5E9 50%, #B2EBF2 100%)",
        }}
      ></div>

      {/* Sidebar */}
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
        <div className="p-6 border-b border-white/20">
          <h1 className="font-title text-2xl font-bold bg-gradient-to-r from-blue to-green text-transparent bg-clip-text">
            UmiVita
          </h1>
          <p className="text-xs text-gray-700 mt-1">Monitoramento Ambiental</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                Histórico 🕐
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">
                  Acompanhe todos os eventos do sistema
                </p>
                <Activity size={14} className={loading ? "animate-pulse text-green-500" : "text-gray-400"} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 hover:bg-white/30 rounded-full transition-all duration-300">
                <Bell size={20} className="text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue to-green flex items-center justify-center text-white font-bold">
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Timeline */}
          <div
            className="col-span-8 rounded-2xl p-5 flex flex-col"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #5ADB62 0%, #2EE9B4 100%)",
                    boxShadow: "0 4px 12px rgba(90, 219, 98, 0.4)",
                  }}
                >
                  <Clock size={20} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Linha do Tempo - Últimos Eventos</h3>
              </div>
              <button
                onClick={() => navigate("/dashboard/historico/completo")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Ver Histórico Completo →
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : ultimosEventos.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Nenhum evento registrado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ultimosEventos.map((event) => {
                  const EventIcon = getEventIcon(event);
                  const colors = getEventColor(event);
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all duration-300"
                    >
                      <div 
                        className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${colors.color} 0%, ${colors.colorEnd} 100%)`,
                          boxShadow: `0 4px 12px ${colors.color}66`,
                        }}
                      >
                        <EventIcon size={20} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">
                          Sensor {event.sensorId} - {event.sensor?.tipo || 'Desconhecido'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Temp: {event.temperatura}°C | Umid: {event.umidade}% | Contam: {event.nivel_contaminacao}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>{formatDate(event.dataHora)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div
            className="col-span-4 rounded-2xl p-5"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Total de Eventos</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEventos}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Alertas Gerados</p>
                <p className="text-2xl font-bold text-red-600">{stats.alertasGerados}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Leituras de Temp.</p>
                <p className="text-2xl font-bold text-blue-600">{stats.leiturasTemp}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Leituras de Umid.</p>
                <p className="text-2xl font-bold text-cyan-600">{stats.leiturasUmid}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
