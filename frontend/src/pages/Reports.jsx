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
  Download,
  Eye,
  Calendar,
  Plus,
} from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("relatorios");
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

  const reports = [
    {
      id: 1,
      titulo: "Relatório Mensal",
      subtitulo: "Outubro 2025",
      tipo: "Mensal",
      data: "01/10/2025",
      tamanho: "2.5 MB",
      color: "#4FC3F7",
      colorEnd: "#29B6F6",
    },
    {
      id: 2,
      titulo: "Relatório Semanal",
      subtitulo: "Semana 40",
      tipo: "Semanal",
      data: "28/09/2025",
      tamanho: "850 KB",
      color: "#5ADB62",
      colorEnd: "#2EE9B4",
    },
    {
      id: 3,
      titulo: "Relatório de Alertas",
      subtitulo: "Setembro 2025",
      tipo: "Alertas",
      data: "30/09/2025",
      tamanho: "1.2 MB",
      color: "#FF6B6B",
      colorEnd: "#FF8E53",
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
                Relatórios 📄
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualize e baixe relatórios do sistema
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Botão Gerar Novo Relatório */}
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all duration-300"
                style={{ boxShadow: "0 4px 12px rgba(90, 219, 98, 0.3)" }}
              >
                <Plus size={18} />
                <span className="text-sm font-medium">Novo Relatório</span>
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

        {/* Content - 3 Cards de Relatórios SEM SCROLL */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          {/* Row 1 - 3 Cards de Relatórios */}
          <div className="grid grid-cols-3 gap-6 flex-shrink-0">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl p-5 hover:scale-105 transition-all duration-300 flex flex-col"
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
                      background: `linear-gradient(135deg, ${report.color} 0%, ${report.colorEnd} 100%)`,
                      boxShadow: `0 4px 12px ${report.color}66`,
                    }}
                  >
                    <FileText size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{report.titulo}</h3>
                    <p className="text-xs text-gray-600">{report.subtitulo}</p>
                  </div>
                </div>

                <div 
                  className="flex-1 p-4 rounded-xl mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${report.color}1A 0%, ${report.colorEnd}1A 100%)`,
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-semibold text-gray-800">{report.tipo}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-semibold text-gray-800">{report.data}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tamanho:</span>
                      <span className="font-semibold text-gray-800">{report.tamanho}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                  >
                    <Eye size={16} />
                    <span className="text-sm font-medium">Ver</span>
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white rounded-xl hover:brightness-110 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${report.color} 0%, ${report.colorEnd} 100%)`,
                      boxShadow: `0 4px 12px ${report.color}66`,
                    }}
                  >
                    <Download size={16} />
                    <span className="text-sm font-medium">Baixar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - Estatísticas de Relatórios */}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas de Relatórios</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                <p className="text-xs text-gray-600 mb-1">Total de Relatórios</p>
                <p className="text-3xl font-bold text-gray-800">45</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                <p className="text-xs text-gray-600 mb-1">Gerados Este Mês</p>
                <p className="text-3xl font-bold text-blue-600">8</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                <p className="text-xs text-gray-600 mb-1">Downloads</p>
                <p className="text-3xl font-bold text-green-600">156</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50 text-center">
                <p className="text-xs text-gray-600 mb-1">Último Gerado</p>
                <p className="text-lg font-bold text-gray-800">Hoje</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
