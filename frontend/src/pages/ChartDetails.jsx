import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
  const { user, logout } = useAuth();
  const { tipo } = useParams();
  const [activePage, setActivePage] = useState("graficos");
  const [notifications, setNotifications] = useState(3);
  const [selectedPeriod, setSelectedPeriod] = useState("7dias");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    currentValue: "0",
    maxValue: "0",
    minValue: "0",
    avgValue: "0",
  });
  const [alertAreas, setAlertAreas] = useState([]);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes", badge: notifications },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  const chartConfig = {
    temperatura: {
      title: "Temperatura",
      icon: Thermometer,
      color: "#4FC3F7",
      colorEnd: "#29B6F6",
      emoji: "🌡️",
      unit: "°C",
      dataKey: "temperatura",
    },
    umidade: {
      title: "Umidade",
      icon: Droplet,
      color: "#4FC3F7",
      colorEnd: "#29B6F6",
      emoji: "💧",
      unit: "%",
      dataKey: "umidade",
    },
    comparativo: {
      title: "Comparativo",
      icon: TrendingUp,
      color: "#5ADB62",
      colorEnd: "#2EE9B4",
      emoji: "📈",
      unit: "",
      dataKey: "both",
    },
  };

  const config = chartConfig[tipo] || chartConfig.temperatura;
  const Icon = config.icon;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados históricos
        const historicoResponse = await api.get('/historicos');
        const historico = historicoResponse.data.data || [];

        // Buscar áreas
        const areasResponse = await api.get('/areas');
        const areas = areasResponse.data;

        // Filtrar áreas em alerta
        const areasAlerta = areas.filter(a => a.status_risco === 'alto' || a.status_risco === 'medio');
        setAlertAreas(areasAlerta);

        // ⬇️ FILTRAR DADOS BASEADO NO TIPO (CORRIGIDO!)
        const dadosFiltrados = historico.filter(item => {
          // Para temperatura, só pega registros com temperatura > 0
          if (tipo === 'temperatura') return item.temperatura != null && item.temperatura > 0;
          // Para umidade, só pega registros com umidade > 0
          if (tipo === 'umidade') return item.umidade != null && item.umidade > 0;
          // Para comparativo, pega registros com ambos > 0
          return item.temperatura != null && item.temperatura > 0 && 
                 item.umidade != null && item.umidade > 0;
        });

        // Formatar dados para o gráfico
        const formattedData = dadosFiltrados
          .slice(-20) // Últimos 20 registros válidos
          .map(item => ({
            hora: new Date(item.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            temperatura: item.temperatura || 0,
            umidade: item.umidade || 0,
          }));

        setChartData(formattedData);

        // Calcular estatísticas baseado no tipo
        if (tipo === 'temperatura') {
          const temperaturas = dadosFiltrados.map(l => l.temperatura).filter(t => t != null && t > 0);
          
          const current = temperaturas.length > 0 ? temperaturas[temperaturas.length - 1].toFixed(1) : 0;
          const max = temperaturas.length > 0 ? Math.max(...temperaturas).toFixed(1) : 0;
          const min = temperaturas.length > 0 ? Math.min(...temperaturas).toFixed(1) : 0;
          const avg = temperaturas.length > 0 
            ? (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(1)
            : 0;

          setStats({
            currentValue: `${current}${config.unit}`,
            maxValue: `${max}${config.unit}`,
            minValue: `${min}${config.unit}`,
            avgValue: `${avg}${config.unit}`,
          });
        } else if (tipo === 'umidade') {
          const umidades = dadosFiltrados.map(l => l.umidade).filter(u => u != null && u > 0);
          
          const current = umidades.length > 0 ? umidades[umidades.length - 1].toFixed(1) : 0;
          const max = umidades.length > 0 ? Math.max(...umidades).toFixed(1) : 0;
          const min = umidades.length > 0 ? Math.min(...umidades).toFixed(1) : 0;
          const avg = umidades.length > 0 
            ? (umidades.reduce((a, b) => a + b, 0) / umidades.length).toFixed(1)
            : 0;

          setStats({
            currentValue: `${current}${config.unit}`,
            maxValue: `${max}${config.unit}`,
            minValue: `${min}${config.unit}`,
            avgValue: `${avg}${config.unit}`,
          });
        } else if (tipo === 'comparativo') {
          const temperaturas = dadosFiltrados.map(l => l.temperatura).filter(t => t != null && t > 0);
          const umidades = dadosFiltrados.map(l => l.umidade).filter(u => u != null && u > 0);
          
          const tempCurrent = temperaturas.length > 0 ? temperaturas[temperaturas.length - 1].toFixed(1) : 0;
          const umidCurrent = umidades.length > 0 ? umidades[umidades.length - 1].toFixed(1) : 0;
          
          const tempMax = temperaturas.length > 0 ? Math.max(...temperaturas).toFixed(1) : 0;
          const umidMax = umidades.length > 0 ? Math.max(...umidades).toFixed(1) : 0;
          
          const tempMin = temperaturas.length > 0 ? Math.min(...temperaturas).toFixed(1) : 0;
          const umidMin = umidades.length > 0 ? Math.min(...umidades).toFixed(1) : 0;
          
          const tempAvg = temperaturas.length > 0 
            ? (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(1)
            : 0;
          const umidAvg = umidades.length > 0 
            ? (umidades.reduce((a, b) => a + b, 0) / umidades.length).toFixed(1)
            : 0;

          setStats({
            currentValue: `${tempCurrent}°C / ${umidCurrent}%`,
            maxValue: `${tempMax}°C / ${umidMax}%`,
            minValue: `${tempMin}°C / ${umidMin}%`,
            avgValue: `${tempAvg}°C / ${umidAvg}%`,
          });
        }

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tipo]);

  const handleLogout = () => {
    logout();
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
              
              <button 
                onClick={() => navigate('/dashboard/notificacoes')}
                className="relative p-3 hover:bg-white/30 rounded-full transition-all duration-300"
              >
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
        </header>

        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {loading ? (
            <div className="col-span-12 flex items-center justify-center">
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="col-span-12 flex items-center justify-center">
              <div className="text-center">
                <Icon size={64} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold mb-2">Nenhum dado disponível</p>
                <p className="text-gray-500 text-sm">Aguarde o ESP32 enviar dados de {config.title.toLowerCase()}</p>
              </div>
            </div>
          ) : (
            <>
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
                      <p className="text-xs text-gray-600">Últimas {chartData.length} leituras</p>
                    </div>
                  </div>
                </div>
                
                {/* Gráfico Real com Recharts */}
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    {tipo === 'comparativo' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="hora" stroke="#666" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(255,255,255,0.95)', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px' 
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="temperatura" 
                          stroke="#FF6B6B" 
                          strokeWidth={2}
                          name="Temperatura (°C)" 
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="umidade" 
                          stroke="#4FC3F7" 
                          strokeWidth={2}
                          name="Umidade (%)" 
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    ) : (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={config.colorEnd} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="hora" stroke="#666" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(255,255,255,0.95)', 
                            border: '1px solid #ddd', 
                            borderRadius: '8px' 
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey={config.dataKey} 
                          stroke={config.color}
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorGradient)"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
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
                    <p className="text-3xl font-bold text-gray-800">{stats.currentValue}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                    <p className="text-xs text-gray-600 mb-1">Máxima</p>
                    <p className="text-2xl font-bold text-red-600">{stats.maxValue}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                    <p className="text-xs text-gray-600 mb-1">Mínima</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.minValue}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/40 border border-white/50">
                    <p className="text-xs text-gray-600 mb-1">Média</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.avgValue}</p>
                  </div>

                  {alertAreas.length > 0 && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-xs text-red-700 font-semibold mb-2">⚠️ Áreas em Alerta</p>
                      <div className="space-y-2">
                        {alertAreas.map((area) => (
                          <div key={area.id} className="text-sm text-red-800">
                            <p className="font-medium">{area.nome}</p>
                            <p className="text-xs">Status: {area.status_risco === 'alto' ? 'Crítico' : 'Alerta'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChartDetails;
