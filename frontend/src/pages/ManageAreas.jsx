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
  Plus,
  Edit,
  Trash2,
  MapPinned,
} from "lucide-react";

const ManageAreas = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("areas");
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

  const areas = [
    { id: 1, nome: "Área Portuária A", status: "Normal", temp: "24°C", umid: "65%", localizacao: "Porto Santos - SP" },
    { id: 2, nome: "Área Portuária B", status: "Alerta", temp: "32°C", umid: "45%", localizacao: "Porto Santos - SP" },
    { id: 3, nome: "Área Portuária C", status: "Normal", temp: "22°C", umid: "70%", localizacao: "Porto Santos - SP" },
    { id: 4, nome: "Área Portuária D", status: "Crítico", temp: "35°C", umid: "40%", localizacao: "Porto Santos - SP" },
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
                Gerenciar Áreas 
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualize e gerencie todas as áreas monitoradas
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Botão Adicionar Área */}
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all duration-300"
                style={{ boxShadow: "0 4px 12px rgba(90, 219, 98, 0.3)" }}
              >
                <Plus size={18} />
                <span className="text-sm font-medium">Nova Área</span>
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

        {/* Content - Mapa + Lista de Áreas */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Mapa de Áreas */}
          <div
            className="col-span-8 rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Mapa de Áreas</h3>
              <button className="text-sm text-blue-500 hover:underline">Visualizar em tela cheia</button>
            </div>
            <div 
              className="h-full flex items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #E8F5E9 0%, #B2EBF2 100%)",
              }}
            >
              <div className="text-center">
                <MapPinned size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Mapa Interativo das Áreas</p>
                <p className="text-gray-400 text-sm mt-2">Integração com Google Maps / Leaflet</p>
              </div>
            </div>
          </div>

          {/* Lista de Áreas */}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">Áreas Monitoradas</h3>
            <div className="space-y-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-all duration-300 border border-white/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{area.nome}</h4>
                    <span 
                      className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                        area.status === "Normal" 
                          ? "bg-green-100 text-green-700"
                          : area.status === "Alerta"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {area.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{area.localizacao}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs text-gray-700">🌡️ {area.temp}</span>
                    <span className="text-xs text-gray-700">💧 {area.umid}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-all">
                      <Edit size={14} />
                      Editar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-all">
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageAreas;
