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
  TrendingUp,
  Calendar,
  Search,
  Download,
  Filter,
  ArrowLeft,
} from "lucide-react";

const FullHistory = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("historico");
  const [notifications, setNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes", badge: notifications },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  // Dados de exemplo - 20 eventos
  const allEvents = [
    { id: 1, tipo: "alerta", titulo: "Alerta de Temperatura", descricao: "Área Portuária B atingiu 35°C", hora: "14:30", data: "04/10/2025", area: "Área B", icon: AlertTriangle, color: "#FF6B6B" },
    { id: 2, tipo: "temperatura", titulo: "Leitura de Temperatura", descricao: "Nova leitura registrada: 24.5°C", hora: "13:15", data: "04/10/2025", area: "Área A", icon: Thermometer, color: "#4FC3F7" },
    { id: 3, tipo: "umidade", titulo: "Leitura de Umidade", descricao: "Nova leitura registrada: 68.2%", hora: "13:15", data: "04/10/2025", area: "Área A", icon: Droplet, color: "#4FC3F7" },
    { id: 4, tipo: "sistema", titulo: "Sistema Atualizado", descricao: "Novos sensores foram ativados", hora: "10:00", data: "04/10/2025", area: "Sistema", icon: TrendingUp, color: "#5ADB62" },
    { id: 5, tipo: "alerta", titulo: "Alerta de Umidade Baixa", descricao: "Área C registrou 35% de umidade", hora: "09:45", data: "04/10/2025", area: "Área C", icon: AlertTriangle, color: "#FF6B6B" },
    { id: 6, tipo: "temperatura", titulo: "Leitura de Temperatura", descricao: "Nova leitura registrada: 22.8°C", hora: "09:30", data: "04/10/2025", area: "Área D", icon: Thermometer, color: "#4FC3F7" },
    { id: 7, tipo: "umidade", titulo: "Leitura de Umidade", descricao: "Nova leitura registrada: 72.5%", hora: "09:30", data: "04/10/2025", area: "Área D", icon: Droplet, color: "#4FC3F7" },
    { id: 8, tipo: "sistema", titulo: "Backup Realizado", descricao: "Backup automático concluído com sucesso", hora: "08:00", data: "04/10/2025", area: "Sistema", icon: TrendingUp, color: "#5ADB62" },
    { id: 9, tipo: "alerta", titulo: "Alerta de Temperatura Alta", descricao: "Área A atingiu 33°C", hora: "16:20", data: "03/10/2025", area: "Área A", icon: AlertTriangle, color: "#FF6B6B" },
    { id: 10, tipo: "temperatura", titulo: "Leitura de Temperatura", descricao: "Nova leitura registrada: 26.1°C", hora: "15:45", data: "03/10/2025", area: "Área B", icon: Thermometer, color: "#4FC3F7" },
    { id: 11, tipo: "umidade", titulo: "Leitura de Umidade", descricao: "Nova leitura registrada: 65.8%", hora: "15:45", data: "03/10/2025", area: "Área B", icon: Droplet, color: "#4FC3F7" },
    { id: 12, tipo: "sistema", titulo: "Manutenção Programada", descricao: "Sensores da Área C em manutenção", hora: "14:00", data: "03/10/2025", area: "Sistema", icon: TrendingUp, color: "#5ADB62" },
    { id: 13, tipo: "alerta", titulo: "Alerta de Umidade Alta", descricao: "Área D registrou 88% de umidade", hora: "12:30", data: "03/10/2025", area: "Área D", icon: AlertTriangle, color: "#FF6B6B" },
    { id: 14, tipo: "temperatura", titulo: "Leitura de Temperatura", descricao: "Nova leitura registrada: 23.2°C", hora: "11:00", data: "03/10/2025", area: "Área C", icon: Thermometer, color: "#4FC3F7" },
    { id: 15, tipo: "umidade", titulo: "Leitura de Umidade", descricao: "Nova leitura registrada: 70.1%", hora: "11:00", data: "03/10/2025", area: "Área C", icon: Droplet, color: "#4FC3F7" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "todos" || event.tipo === filterType;
    return matchesSearch && matchesType;
  });

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
            <div className="flex items-center gap-4">
              {/* Botão Voltar */}
              <button 
                onClick={() => navigate("/dashboard/historico")}
                className="p-2 hover:bg-white/30 rounded-full transition-all duration-300"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Histórico Completo 📋
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Todos os eventos do sistema
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Busca */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-xl border border-white/50">
                <Search size={18} className="text-gray-600" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 focus:outline-none w-48"
                />
              </div>

              {/* Filtro por Tipo */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-xl border border-white/50">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="todos">Todos</option>
                  <option value="alerta">Alertas</option>
                  <option value="temperatura">Temperatura</option>
                  <option value="umidade">Umidade</option>
                  <option value="sistema">Sistema</option>
                </select>
              </div>

              {/* Botão Exportar */}
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all duration-300"
                style={{ boxShadow: "0 4px 12px rgba(90, 219, 98, 0.3)" }}
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

        {/* Content - Lista Completa COM SCROLL */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {filteredEvents.length} eventos encontrados
              </h3>
            </div>

            {/* Lista de Eventos */}
            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const EventIcon = event.icon;
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all duration-300"
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${event.color} 0%, ${event.color}DD 100%)`,
                        boxShadow: `0 4px 12px ${event.color}66`,
                      }}
                    >
                      <EventIcon size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800">{event.titulo}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-lg">
                          {event.area}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{event.descricao}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{event.data}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{event.hora}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullHistory;
