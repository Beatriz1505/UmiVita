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
  Info,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("notificacoes");
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

  const notificationsList = [
    {
      id: 1,
      tipo: "alerta",
      titulo: "Alerta de Temperatura Crítica",
      descricao: "Área Portuária B atingiu 35°C - Ação imediata necessária",
      hora: "14:30",
      lida: false,
      icon: AlertTriangle,
      color: "#FF6B6B",
      bgColor: "#FFE5E5",
    },
    {
      id: 2,
      tipo: "info",
      titulo: "Relatório Mensal Disponível",
      descricao: "O relatório de outubro está pronto para download",
      hora: "10:15",
      lida: false,
      icon: Info,
      color: "#4FC3F7",
      bgColor: "#E3F2FD",
    },
    {
      id: 3,
      tipo: "sucesso",
      titulo: "Backup Concluído",
      descricao: "Backup automático realizado com sucesso",
      hora: "08:00",
      lida: false,
      icon: CheckCircle,
      color: "#5ADB62",
      bgColor: "#E8F5E9",
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  const markAsRead = (id) => {
    console.log(`Marcando notificação ${id} como lida`);
  };

  const deleteNotification = (id) => {
    console.log(`Deletando notificação ${id}`);
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
                Notificações 🔔
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Acompanhe alertas e atualizações importantes
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Botão Marcar Todas como Lidas */}
              <button 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Marcar todas como lidas
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

        {/* Content - Notificações + Estatísticas SEM SCROLL */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Lista de Notificações */}
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
              <h3 className="text-lg font-bold text-gray-800">Notificações Recentes</h3>
              <button
                onClick={() => navigate("/dashboard/notificacoes/todas")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Ver Todas Notificações →
              </button>
            </div>

            {/* Lista de Notificações - APENAS 3 */}
            <div className="space-y-3">
              {notificationsList.map((notif) => {
                const NotifIcon = notif.icon;
                return (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 p-3 rounded-xl border-2 hover:scale-[1.02] transition-all duration-300"
                    style={{
                      backgroundColor: notif.bgColor,
                      borderColor: notif.color,
                    }}
                  >
                    <div 
                      className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: notif.color,
                        boxShadow: `0 4px 12px ${notif.color}66`,
                      }}
                    >
                      <NotifIcon size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-gray-800 text-sm">{notif.titulo}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{notif.hora}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{notif.descricao}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs px-2 py-1 bg-white/60 hover:bg-white/80 rounded-lg font-medium text-gray-700 transition-all"
                        >
                          Marcar como lida
                        </button>
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-xs px-2 py-1 bg-white/60 hover:bg-red-50 rounded-lg font-medium text-red-600 transition-all flex items-center gap-1"
                        >
                          <Trash2 size={11} />
                          Excluir
                        </button>
                      </div>
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Total de Notificações</p>
                <p className="text-3xl font-bold text-gray-800">28</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Não Lidas</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Alertas Críticos</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Informações</p>
                <p className="text-2xl font-bold text-blue-600">2</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
