import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ArrowLeft,
  Calendar,
  Download,
} from "lucide-react";

const ChartDetails = () => {
  const navigate = useNavigate();
  const { tipo } = useParams(); // temperatura, umidade ou comparativo
  const [activePage, setActivePage] = useState("graficos");
  const [notifications, setNotifications] = useState(3);
  const [selectedPeriod, setSelectedPeriod] = useState("7dias");

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes", badge: notifications },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  // Configuração dinâmica baseada no tipo
  const chartConfig = {
    temperatura: {
      title: "Temperatura",
      icon: Thermometer,
      color: "#4FC3F7",
      colorEnd: "#29B6F6",
      emoji: "🌡️",
      currentValue: "24.5°C",
      maxValue: "32°C",
      minValue: "18°C",
      avgValue: "24.5°C",
    },
    umidade: {
      title: "Umidade",
      icon: Droplet,
      color: "#4FC3F7",
      colorEnd: "#29B6F6",
      emoji: "💧",
      currentValue: "68.2%",
      maxValue: "85%",
      minValue: "45%",
      avgValue: "68.2%",
    },
    comparativo: {
      title: "Comparativo",
      icon: TrendingUp,
      color: "#5ADB62",
      colorEnd: "#2EE9B4",
      emoji: "📈",
      currentValue: "24.5°C / 68%",
      maxValue: "32°C / 85%",
      minValue: "18°C / 45%",
      avgValue: "24.5°C / 68%",
    },
  };

  const config = chartConfig[tipo] || chartConfig.temperatura;
  const Icon = config.icon;

  const handleLogout = () => {
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
            const MenuIcon = item.icon;
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
                <MenuIcon size={20} />
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge && (
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
            <div className="flex items-center gap-4">
              {/* Botão Voltar */}
              <button 
                onClick={() => navigate("/dashboard/graficos")}
                className="p-2 hover:bg-white/30 rounded-full transition-all duration-300"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {config.title} {config.emoji}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Análise detalhada e estatísticas completas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Filtro de Período */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-xl border border-white/50">
                <Calendar size={18} className="text-gray-600" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="24h">Últimas 24h</option>
                  <option value="7dias">Últimos 7 dias</option>
                  <option value="30dias">Últimos 30 dias</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>

              {/* Botão Exportar */}
              <button 
                className="flex items-center gap-2 px-4 py-2 text-white rounded-xl hover:brightness-110 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${config.color} 0%, ${config.colorEnd} 100%)`,
                  boxShadow: `0 4px 12px ${config.color}66`,
                }}
              >
                <Download size={18} />
                <span className="text-sm font-medium">Exportar</span>
              </button>
              
              {/* Notificações */}
              <button className="relative p-3 hover:bg-white/30 rounded-full transition-all duration-300">
                <Bell size={20} className="text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue to-green flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content - Gráfico Grande + Estatísticas */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Gráfico Principal */}
          <div
            className="col-span-8 rounded-2xl p-6 flex flex-col"
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
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${config.color} 0%, ${config.colorEnd} 100%)`,
                    boxShadow: `0 4px 12px ${config.color}66`,
                  }}
                >
                  <Icon size={24} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Gráfico de {config.title}</h3>
                  <p className="text-xs text-gray-600">Últimos 7 dias</p>
                </div>
              </div>
            </div>
            
            {/* Placeholder para Gráfico */}
            <div 
              className="flex-1 flex items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${config.color}1A 0%, ${config.colorEnd}1A 100%)`,
              }}
            >
              <div className="text-center">
                <BarChart3 size={80} style={{ color: config.color }} className="mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Gráfico de {config.title}</p>
                <p className="text-gray-400 text-sm mt-2">Integração Chart.js / Recharts</p>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div
            className="col-span-4 rounded-2xl p-6 overflow-y-auto"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Valor Atual</p>
                <p className="text-3xl font-bold text-gray-800">{config.currentValue}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Máxima (7 dias)</p>
                <p className="text-2xl font-bold text-red-600">{config.maxValue}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Mínima (7 dias)</p>
                <p className="text-2xl font-bold text-blue-600">{config.minValue}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Média (7 dias)</p>
                <p className="text-2xl font-bold text-gray-800">{config.avgValue}</p>
              </div>

              {/* Áreas Críticas */}
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-xs text-red-700 font-semibold mb-2">⚠️ Áreas em Alerta</p>
                <div className="space-y-2">
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Área Portuária B</p>
                    <p className="text-xs">Status: Crítico</p>
                  </div>
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Área Portuária D</p>
                    <p className="text-xs">Status: Alerta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChartDetails;
