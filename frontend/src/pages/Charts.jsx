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
  Thermometer,
  Droplet,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const Charts = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("graficos");
  const [notifications, setNotifications] = useState(0);
  const [stats, setStats] = useState({
    temperaturaAtual: 0,
    umidadeAtual: 0,
    areasMonitoradas: 0,
    alertasAtivos: 0,
    temperaturaMedia: 0,
    umidadeMedia: 0,
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
    const fetchData = async () => {
      try {
        // Buscar áreas
        const areasResponse = await api.get('/areas');
        const areas = areasResponse.data;

        // Buscar histórico de leituras
        const historicoResponse = await api.get('/historicos');
        const historico = historicoResponse.data.data || [];

        // Buscar notificações não lidas
        const notificacoesResponse = await api.get('/notificacoes');
        const notificacoesNaoLidas = notificacoesResponse.data.filter(
          n => n.status === 'nao_visualizada'
        ).length;
        setNotifications(notificacoesNaoLidas);

        // Calcular estatísticas
        const temperaturas = historico.map(l => l.temperatura).filter(t => t != null);
        const umidades = historico.map(l => l.umidade).filter(u => u != null);

        const tempMedia = temperaturas.length > 0 
          ? (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(1)
          : 0;

        const umidMedia = umidades.length > 0 
          ? (umidades.reduce((a, b) => a + b, 0) / umidades.length).toFixed(1)
          : 0;

        const tempAtual = temperaturas.length > 0 ? temperaturas[temperaturas.length - 1].toFixed(1) : 0;
        const umidAtual = umidades.length > 0 ? umidades[umidades.length - 1].toFixed(1) : 0;

        // Contar alertas
        const alertas = areas.filter(a => a.status_risco === 'alto' || a.status_risco === 'medio').length;

        setStats({
          temperaturaAtual: tempAtual,
          umidadeAtual: umidAtual,
          areasMonitoradas: areas.length,
          alertasAtivos: alertas,
          temperaturaMedia: tempMedia,
          umidadeMedia: umidMedia,
        });

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
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
                Gráficos 📊
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualize os dados de temperatura e umidade
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard/notificacoes')}
                className="relative p-3 hover:bg-white/30 rounded-full transition-all duration-300"
              >
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

        <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          ) : (
            <>
              {/* 3 Cards de Gráficos */}
              <div className="grid grid-cols-3 gap-6 flex-shrink-0">
                {/* Card 1 - Temperatura */}
                <div
                  className="rounded-2xl p-5 hover:scale-105 transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={() => navigate("/dashboard/graficos/temperatura")}
                  style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
                        boxShadow: "0 8px 20px rgba(79, 195, 247, 0.5)",
                      }}
                    >
                      <Thermometer size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Temperatura</h3>
                      <p className="text-xs text-gray-600">Dados completos e estatísticas</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, rgba(79, 195, 247, 0.1) 0%, rgba(41, 182, 246, 0.1) 100%)", borderRadius: "16px" }}>
                    <div className="text-center py-6">
                      <p className="text-4xl font-bold text-gray-800 mb-1">{stats.temperaturaAtual}°C</p>
                      <p className="text-xs text-gray-600">Temperatura Atual</p>
                    </div>
                  </div>

                  <button 
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-xl hover:brightness-110 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
                      boxShadow: "0 4px 12px rgba(79, 195, 247, 0.5)",
                    }}
                  >
                    <span className="text-sm font-medium">Ver Detalhes</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Card 2 - Umidade */}
                <div
                  className="rounded-2xl p-5 hover:scale-105 transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={() => navigate("/dashboard/graficos/umidade")}
                  style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
                        boxShadow: "0 8px 20px rgba(79, 195, 247, 0.5)",
                      }}
                    >
                      <Droplet size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Umidade</h3>
                      <p className="text-xs text-gray-600">Dados completos e estatísticas</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, rgba(79, 195, 247, 0.1) 0%, rgba(41, 182, 246, 0.1) 100%)", borderRadius: "16px" }}>
                    <div className="text-center py-6">
                      <p className="text-4xl font-bold text-gray-800 mb-1">{stats.umidadeAtual}%</p>
                      <p className="text-xs text-gray-600">Umidade Atual</p>
                    </div>
                  </div>

                  <button 
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-xl hover:brightness-110 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
                      boxShadow: "0 4px 12px rgba(79, 195, 247, 0.5)",
                    }}
                  >
                    <span className="text-sm font-medium">Ver Detalhes</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Card 3 - Comparativo */}
                <div
                  className="rounded-2xl p-5 hover:scale-105 transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={() => navigate("/dashboard/graficos/comparativo")}
                  style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #5ADB62 0%, #2EE9B4 100%)",
                        boxShadow: "0 8px 20px rgba(90, 219, 98, 0.6)",
                      }}
                    >
                      <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Comparativo</h3>
                      <p className="text-xs text-gray-600">Análise Temp x Umidade</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, rgba(90, 219, 98, 0.1) 0%, rgba(46, 233, 180, 0.1) 100%)", borderRadius: "16px" }}>
                    <div className="text-center py-6">
                      <p className="text-3xl font-bold text-gray-800 mb-1">{stats.temperaturaAtual}°C / {stats.umidadeAtual}%</p>
                      <p className="text-xs text-gray-600">Relação Atual</p>
                    </div>
                  </div>

                  <button 
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-xl hover:brightness-110 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #5ADB62 0%, #2EE9B4 100%)",
                      boxShadow: "0 4px 12px rgba(90, 219, 98, 0.6)",
                    }}
                  >
                    <span className="text-sm font-medium">Ver Detalhes</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Resumo Geral */}
              <div
                className="rounded-2xl p-5 flex-shrink-0"
                style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Resumo Geral das Áreas</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Áreas Monitoradas</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.areasMonitoradas}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Alertas Ativos</p>
                    <p className="text-3xl font-bold text-red-600">{stats.alertasAtivos}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Temp. Média Geral</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.temperaturaMedia}°C</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                    <p className="text-xs text-gray-600 mb-1">Umid. Média Geral</p>
                    <p className="text-3xl font-bold text-cyan-600">{stats.umidadeMedia}%</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Charts;
