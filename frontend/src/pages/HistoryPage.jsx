import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Calendar,
} from "lucide-react";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("historico");
  const [notifications, setNotifications] = useState(3);
  const [selectedPeriod, setSelectedPeriod] = useState("hoje");

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes", badge: notifications },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  const historyEvents = [
    {
      id: 1,
      tipo: "alerta",
      titulo: "Alerta de Temperatura",
      descricao: "Área Portuária B atingiu 35°C",
      hora: "14:30",
      icon: AlertTriangle,
      color: "#FF6B6B",
      colorEnd: "#FF8E53",
    },
    {
      id: 2,
      tipo: "temperatura",
      titulo: "Leitura de Temperatura",
      descricao: "Nova leitura registrada: 24.5°C",
      hora: "13:15",
      icon: Thermometer,
      color: "#4FC3F7",
      colorEnd: "#29B6F6",
    },
    {
      id: 3,
      tipo: "umidade",
      titulo: "Leitura de Umidade",
      descricao: "Nova leitura registrada: 68.2%",
      hora: "13:15",
      icon: Droplet,
      color: "#4FC3F7",
      colorEnd: "#29B6F6",
    },
  ];

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
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Histórico 🕐
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Acompanhe todos os eventos do sistema
              </p>
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
                  <option value="hoje">Hoje</option>
                  <option value="ontem">Ontem</option>
                  <option value="7dias">Últimos 7 dias</option>
                  <option value="30dias">Últimos 30 dias</option>
                </select>
              </div>
              
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

        {/* Content - Timeline + Estatísticas SEM SCROLL */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Timeline */}
          <div
            className="col-span-8 rounded-2xl p-5"
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

            {/* Timeline Items - APENAS 3 */}
            <div className="space-y-3">
              {historyEvents.map((event) => {
                const EventIcon = event.icon;
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all duration-300"
                  >
                    <div 
                      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${event.color} 0%, ${event.colorEnd} 100%)`,
                        boxShadow: `0 4px 12px ${event.color}66`,
                      }}
                    >
                      <EventIcon size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">{event.titulo}</h4>
                      <p className="text-sm text-gray-600">{event.descricao}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>{event.hora}</span>
                    </div>
                  </div>
                );
              })}
            </div>
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas do Dia</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Total de Eventos</p>
                <p className="text-3xl font-bold text-gray-800">47</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Alertas Gerados</p>
                <p className="text-2xl font-bold text-red-600">8</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Leituras de Temp.</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Leituras de Umid.</p>
                <p className="text-2xl font-bold text-cyan-600">156</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
