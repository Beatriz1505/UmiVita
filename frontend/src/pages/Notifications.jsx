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
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2,
  Filter,
  Activity,
  Droplet,
  Thermometer,
} from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("notificacoes");
  
  // Estados
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [filtroRisco, setFiltroRisco] = useState("todos");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes" },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  // Buscar notificações (inicial e a cada minuto)
  useEffect(() => {
    fetchNotificacoes();
    
    const interval = setInterval(() => {
      fetchNotificacoes();
      setUltimaAtualizacao(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [filtroStatus, filtroRisco]);

  const fetchNotificacoes = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filtroStatus !== 'todas') params.append('status', filtroStatus);
      
      const response = await api.get(`/notificacoes?${params.toString()}`);
      
      let dados = response.data;
      
      if (filtroRisco !== 'todos') {
        dados = dados.filter(n => n.nivelRisco === filtroRisco);
      }
      
      setNotificacoes(dados);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
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

  const marcarComoVisualizada = async (id) => {
    try {
      await api.put(`/notificacoes/${id}`, { status: 'visualizada' });
      fetchNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar como visualizada:', error);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const naoLidasIds = notificacoes
        .filter(n => n.status === 'nao_visualizada')
        .map(n => n.id);
      
      await Promise.all(
        naoLidasIds.map(id => api.put(`/notificacoes/${id}`, { status: 'visualizada' }))
      );
      
      fetchNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const deletarNotificacao = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta notificação?')) return;
    
    try {
      await api.delete(`/notificacoes/${id}`);
      fetchNotificacoes();
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const getRiscoColor = (risco) => {
    switch (risco) {
      case 'alto':
        return 'bg-red-100 text-red-600 border-red-300';
      case 'medio':
        return 'bg-orange-100 text-orange-600 border-orange-300';
      case 'baixo':
        return 'bg-green-100 text-green-600 border-green-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getTipoIcon = (mensagem) => {
    if (mensagem.includes('temperatura') || mensagem.includes('Temperatura')) {
      return <Thermometer size={24} />;
    }
    if (mensagem.includes('umidade') || mensagem.includes('Umidade')) {
      return <Droplet size={24} />;
    }
    return <AlertTriangle size={24} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const formatTempoDecorrido = (dateString) => {
    const agora = new Date();
    const data = new Date(dateString);
    const diff = Math.floor((agora - data) / 1000);
    
    if (diff < 60) return 'agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  const naoLidas = notificacoes.filter(n => n.status === 'nao_visualizada').length;

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
            const badge = item.id === "notificacoes" ? naoLidas : null;
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
                {badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {badge}
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Notificações 🔔
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">
                  {naoLidas} não lida{naoLidas !== 1 ? 's' : ''} de {notificacoes.length} total
                </p>
                <Activity size={14} className={loading ? "animate-pulse text-green-500" : "text-gray-400"} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* ⬇️ BOTÃO PARA VER TODAS AS NOTIFICAÇÕES */}
              <button
                onClick={() => navigate("/dashboard/notificacoes/todas")}
                className="px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <Bell size={16} />
                Ver Histórico Completo
              </button>

              {naoLidas > 0 && (
                <button
                  onClick={marcarTodasComoLidas}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-sm font-medium"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/40 rounded-xl p-2">
              <Filter size={18} className="text-gray-600" />
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
              >
                <option value="todas">Todas</option>
                <option value="nao_visualizada">Não Lidas</option>
                <option value="visualizada">Lidas</option>
              </select>
            </div>

            <select
              value={filtroRisco}
              onChange={(e) => setFiltroRisco(e.target.value)}
              className="bg-white/40 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option value="todos">Todos os Riscos</option>
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
            </select>

            <div className="ml-auto text-xs text-gray-500">
              Última atualização: {formatTempoDecorrido(ultimaAtualizacao)}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando notificações...</p>
              </div>
            </div>
          ) : notificacoes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bell size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold mb-2">Nenhuma notificação encontrada</p>
                <p className="text-gray-500 text-sm">Tente ajustar os filtros</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-5xl mx-auto">
              {notificacoes.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className={`rounded-2xl p-5 transition-all hover:scale-[1.01] ${
                    notificacao.status === 'nao_visualizada'
                      ? 'ring-2 ring-blue-400 animate-pulse'
                      : ''
                  }`}
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${getRiscoColor(notificacao.nivelRisco)} border-2`}>
                      {getTipoIcon(notificacao.mensagem)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {notificacao.area?.nome || 'Área Desconhecida'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(notificacao.dataHora)} • {formatTempoDecorrido(notificacao.dataHora)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${getRiscoColor(
                              notificacao.nivelRisco
                            )}`}
                          >
                            {notificacao.nivelRisco.toUpperCase()}
                          </span>
                          {notificacao.status === 'nao_visualizada' && (
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-600 border-2 border-blue-300">
                              NOVA
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{notificacao.mensagem}</p>

                      <div className="flex items-center gap-2">
                        {notificacao.status === 'nao_visualizada' && (
                          <button
                            onClick={() => marcarComoVisualizada(notificacao.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                          >
                            <Eye size={16} />
                            Marcar como Lida
                          </button>
                        )}
                        {notificacao.status === 'visualizada' && (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle size={16} />
                            <span>Visualizada</span>
                          </div>
                        )}
                        <button
                          onClick={() => deletarNotificacao(notificacao.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm ml-auto"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
