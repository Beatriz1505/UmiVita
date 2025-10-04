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
  AlertTriangle,
  Thermometer,
  Droplet,
  Map,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [notifications, setNotifications] = useState(3);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes", badge: notifications },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
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
                Bem-vindo, André! 👋
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
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content - SEM SCROLL, 5 CARDS APENAS */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Card 1 - Temperatura Média (AZUL BRILHANTE) */}
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
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +2.3%
              </span>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Temperatura Média</h3>
              <p className="text-3xl font-bold text-gray-800">24.5°C</p>
            </div>
          </div>

          {/* Card 2 - Umidade Média (AZUL BRILHANTE) */}
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
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                -1.5%
              </span>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Umidade Média</h3>
              <p className="text-3xl font-bold text-gray-800">68.2%</p>
            </div>
          </div>

          {/* Card 3 - Áreas Monitoradas (VERDE DO PROJETO COM BRILHO) */}
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
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +2
              </span>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Áreas Monitoradas</h3>
              <p className="text-3xl font-bold text-gray-800">12</p>
            </div>
          </div>

          {/* Card 4 - Alertas Ativos (VERDE DO PROJETO COM BRILHO) */}
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
                <AlertTriangle size={26} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                +1
              </span>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-1">Alertas Ativos</h3>
              <p className="text-3xl font-bold text-gray-800">3</p>
            </div>
          </div>

          {/* Card 5 - Gráfico Principal (ocupa toda a linha de baixo) */}
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
              <h3 className="text-lg font-bold text-gray-800">Resumo de Monitoramento</h3>
              <button className="text-sm text-blue-500 hover:underline">Ver detalhes</button>
            </div>
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
              <div className="text-center">
                <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Gráfico de Monitoramento em Tempo Real</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
