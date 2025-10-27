import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Filter,
  Search,
  ArrowLeft,
  Calendar,
} from "lucide-react";

const AllNotifications = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("notificacoes");
  const [notifications, setNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todas");
  const [allNotifications, setAllNotifications] = useState([]);
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

  // ⬇️ BUSCAR DADOS REAIS DO BACKEND
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/historicos");
        
        // Transformar os dados do backend no formato da página
        const formattedNotifications = response.data.data.map((item, index) => {
          const date = new Date(item.dataHora);
          const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const data = date.toLocaleDateString('pt-BR');

          // Determinar tipo e cor com base no nível de contaminação
          let tipo, icon, color, bgColor, titulo;
          
          if (item.nivel_contaminacao === 'alto') {
            tipo = 'alerta';
            icon = AlertTriangle;
            color = '#FF6B6B';
            bgColor = '#FFE5E5';
            titulo = `Alerta de Contaminação Alta - Sensor ${item.sensor?.tipo || item.sensorId}`;
          } else if (item.nivel_contaminacao === 'medio') {
            tipo = 'info';
            icon = Info;
            color = '#FFB74D';
            bgColor = '#FFF3E0';
            titulo = `Contaminação Média - Sensor ${item.sensor?.tipo || item.sensorId}`;
          } else {
            tipo = 'sucesso';
            icon = CheckCircle;
            color = '#5ADB62';
            bgColor = '#E8F5E9';
            titulo = `Contaminação Normal - Sensor ${item.sensor?.tipo || item.sensorId}`;
          }

          return {
            id: item.id,
            tipo,
            titulo,
            descricao: `Temp: ${item.temperatura}°C | Umid: ${item.umidade}% | Área: ${item.sensor?.area?.nome || 'N/A'}`,
            hora,
            data,
            lida: index > 2, // Primeiros 3 não lidos
            icon,
            color,
            bgColor,
          };
        });

        setAllNotifications(formattedNotifications);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  const markAsRead = (id) => {
    setAllNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, lida: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setAllNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = allNotifications.filter(notif => {
    const matchesSearch = notif.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "todas" || notif.tipo === filterType;
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
                onClick={() => navigate("/dashboard/notificacoes")}
                className="p-2 hover:bg-white/30 rounded-full transition-all duration-300"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Todas as Notificações 🔔
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Histórico completo de alertas e atualizações
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Busca */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-xl border border-white/50">
                <Search size={18} className="text-gray-600" />
                <input
                  type="text"
                  placeholder="Buscar notificações..."
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
                  <option value="todas">Todas</option>
                  <option value="alerta">Alertas</option>
                  <option value="info">Informações</option>
                  <option value="sucesso">Sucessos</option>
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
                {filteredNotifications.length} notificações encontradas
              </h3>
            </div>

            {/* Loading / Vazio / Lista */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-4">Carregando notificações...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma notificação encontrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => {
                  const NotifIcon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 hover:scale-[1.01] transition-all duration-300 ${notif.lida ? 'opacity-60' : ''}`}
                      style={{
                        backgroundColor: notif.bgColor,
                        borderColor: notif.color,
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: notif.color,
                          boxShadow: `0 4px 12px ${notif.color}66`,
                        }}
                      >
                        <NotifIcon size={20} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="font-bold text-gray-800">{notif.titulo}</h4>
                            {notif.lida && <span className="text-xs text-gray-500">Lida</span>}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar size={12} />
                              <span>{notif.data}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={12} />
                              <span>{notif.hora}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{notif.descricao}</p>
                        <div className="flex items-center gap-2">
                          {!notif.lida && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs px-3 py-1.5 bg-white/60 hover:bg-white/80 rounded-lg font-medium text-gray-700 transition-all"
                            >
                              Marcar como lida
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-xs px-3 py-1.5 bg-white/60 hover:bg-red-50 rounded-lg font-medium text-red-600 transition-all flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllNotifications;
