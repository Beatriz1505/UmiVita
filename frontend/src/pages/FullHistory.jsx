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
  Calendar,
  Search,
  Download,
  Filter,
  ArrowLeft,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const FullHistory = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("historico");
  const [notifications, setNotifications] = useState(0);
  
  // Estados
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [filterSensor, setFilterSensor] = useState("todos");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

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
    fetchHistoricoCompleto();
  }, [page, filterType, filterSensor, searchTerm]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchHistoricoCompleto, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setNotifications(response.data.alertasAtivos || 0);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const fetchHistoricoCompleto = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (filterSensor !== 'todos') params.append('sensorId', filterSensor);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get(`/historicos?${params.toString()}`);
      
      let dados = response.data.data || response.data;
      
      // Garantir que seja array
      if (!Array.isArray(dados)) {
        dados = [];
      }
      
      // Filtrar por tipo localmente (se necessário)
      if (filterType !== 'todos') {
        dados = dados.filter(e => {
          const tipo = e.sensor?.tipo || '';
          return tipo.toLowerCase().includes(filterType.toLowerCase());
        });
      }
      
      setEventos(dados);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || dados.length) / limit) || 1);
      
    } catch (error) {
      console.error('Erro ao buscar histórico completo:', error);
      setEventos([]);
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

  const handleExport = async () => {
    try {
      const response = await api.get('/historicos/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `historico_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar histórico:', error);
      alert('Erro ao exportar dados');
    }
  };

  const getEventIcon = (event) => {
    const tipo = event.sensor?.tipo || '';
    if (tipo.includes('temperatura')) return Thermometer;
    if (tipo.includes('umidade')) return Droplet;
    return AlertTriangle;
  };

  const getEventColor = (event) => {
    const nivel = event.nivel_contaminacao || 'baixo';
    if (nivel === 'alto') return '#FF6B6B';
    if (nivel === 'medio') return '#FFA726';
    return '#4FC3F7';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString) => {
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
        {/* Header */}
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-600">
                    Todos os eventos do sistema
                  </p>
                  <Activity size={14} className={loading ? "animate-pulse text-green-500" : "text-gray-400"} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all duration-300"
                style={{ boxShadow: "0 4px 12px rgba(90, 219, 98, 0.3)" }}
              >
                <Download size={18} />
                <span className="text-sm font-medium">Exportar CSV</span>
              </button>
              
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

          {/* Filtros */}
          <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-xl border border-white/50">
              <Filter size={18} className="text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="temperatura">Temperatura</option>
                <option value="umidade">Umidade</option>
                <option value="contaminacao">Contaminação</option>
              </select>
            </div>

            <select
              value={filterSensor}
              onChange={(e) => setFilterSensor(e.target.value)}
              className="px-4 py-2 bg-white/40 rounded-xl border border-white/50 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Sensores</option>
              <option value="1">Sensor 1</option>
              <option value="2">Sensor 2</option>
              <option value="3">Sensor 3</option>
            </select>
          </div>
        </header>

        {/* Content */}
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
                {eventos.length} eventos encontrados
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : eventos.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <History size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold mb-2">Nenhum evento encontrado</p>
                  <p className="text-gray-500 text-sm">Tente ajustar os filtros</p>
                </div>
              </div>
            ) : (
              <>
                {/* Lista de Eventos */}
                <div className="space-y-3 mb-6">
                  {eventos.map((event) => {
                    const EventIcon = getEventIcon(event);
                    const color = getEventColor(event);
                    return (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all duration-300"
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`,
                            boxShadow: `0 4px 12px ${color}66`,
                          }}
                        >
                          <EventIcon size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-800">
                              Sensor {event.sensorId} - {event.sensor?.tipo || 'Desconhecido'}
                            </h4>
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-lg">
                              {event.sensor?.area?.nome || 'Área Desconhecida'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Temp: {event.temperatura}°C | Umid: {event.umidade}% | Contam: {event.nivel_contaminacao}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>{formatDate(event.dataHora)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>{formatTime(event.dataHora)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paginação */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 bg-white/40 rounded-lg hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="px-4 py-2 bg-white/40 rounded-lg text-sm font-medium">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 bg-white/40 rounded-lg hover:bg-white/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullHistory;
