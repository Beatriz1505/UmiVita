import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
  X,
  Maximize,
  Cpu, // Ícone de sensor
} from "lucide-react";

// Fix do ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para mudar o centro do mapa
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const ManageAreas = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("areas");
  const [notifications, setNotifications] = useState(3);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
  const [showSensorModal, setShowSensorModal] = useState(false); // ⬅️ NOVO
  const [selectedArea, setSelectedArea] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [selectedAreaForSensor, setSelectedAreaForSensor] = useState(null); // ⬅️ NOVO
  const [mapCenter, setMapCenter] = useState([-23.9608, -46.3335]);
  const [mapZoom, setMapZoom] = useState(13);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    coordenadas: "",
  });

  const [editFormData, setEditFormData] = useState({
    nome: "",
    descricao: "",
    coordenadas: "",
  });

  // ⬇️ NOVO: Estado do formulário de sensor
  const [sensorFormData, setSensorFormData] = useState({
    tipo: "umidade",
    status: "ativo",
  });

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
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data);
      
      if (response.data.length > 0 && response.data[0].coordenadas && typeof response.data[0].coordenadas === 'string') {
        const coords = response.data[0].coordenadas.split(',');
        if (coords.length === 2) {
          const lat = parseFloat(coords[0].trim());
          const lng = parseFloat(coords[1].trim());
          if (!isNaN(lat) && !isNaN(lng)) {
            setMapCenter([lat, lng]);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    
    if (area.coordenadas && typeof area.coordenadas === 'string') {
      const coords = area.coordenadas.split(',');
      if (coords.length === 2) {
        const lat = parseFloat(coords[0].trim());
        const lng = parseFloat(coords[1].trim());
        
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter([lat, lng]);
          setMapZoom(15);
        }
      }
    }
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setEditFormData({
      nome: area.nome,
      descricao: area.descricao || "",
      coordenadas: area.coordenadas || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateArea = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/areas/${editingArea.id}`, editFormData);
      setShowEditModal(false);
      setEditingArea(null);
      fetchAreas();
    } catch (error) {
      console.error('Erro ao atualizar área:', error);
      alert('Erro ao atualizar área. Tente novamente.');
    }
  };

  const handleDeleteArea = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta área?')) {
      try {
        await api.delete(`/areas/${id}`);
        fetchAreas();
      } catch (error) {
        console.error('Erro ao excluir área:', error);
        alert('Erro ao excluir área. Tente novamente.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/areas', formData);
      setShowModal(false);
      setFormData({ nome: "", descricao: "", coordenadas: "" });
      fetchAreas();
    } catch (error) {
      console.error('Erro ao criar área:', error);
      alert('Erro ao criar área. Tente novamente.');
    }
  };

  // ⬇️ NOVO: Abrir modal de sensor
  const handleAddSensor = (area) => {
    setSelectedAreaForSensor(area);
    setSensorFormData({ tipo: "umidade", status: "ativo" });
    setShowSensorModal(true);
  };

  // ⬇️ NOVO: Criar sensor
  const handleCreateSensor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sensores', {
        ...sensorFormData,
        areaId: selectedAreaForSensor.id,
      });
      setShowSensorModal(false);
      setSelectedAreaForSensor(null);
      alert('Sensor cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar sensor:', error);
      alert('Erro ao cadastrar sensor. Tente novamente.');
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

  const MapComponent = () => (
    mapCenter && !isNaN(mapCenter[0]) && !isNaN(mapCenter[1]) ? (
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeMapView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {areas.map((area) => {
          if (area.coordenadas && typeof area.coordenadas === 'string') {
            const coords = area.coordenadas.split(',');
            if (coords.length === 2) {
              const lat = parseFloat(coords[0].trim());
              const lng = parseFloat(coords[1].trim());
              if (!isNaN(lat) && !isNaN(lng)) {
                return (
                  <Marker key={area.id} position={[lat, lng]}>
                    <Popup>
                      <strong>{area.nome}</strong>
                      <br />
                      {area.descricao}
                    </Popup>
                  </Marker>
                );
              }
            }
          }
          return null;
        })}
      </MapContainer>
    ) : (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
        <div className="text-center">
          <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma área com coordenadas cadastrada</p>
        </div>
      </div>
    )
  );

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
              <h2 className="text-2xl font-bold text-gray-800">Gerenciar Áreas</h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualize e gerencie todas as áreas monitoradas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all duration-300"
                style={{ boxShadow: "0 4px 12px rgba(90, 219, 98, 0.3)" }}
              >
                <Plus size={18} />
                <span className="text-sm font-medium">Nova Área</span>
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
          <div
            className="col-span-8 rounded-2xl p-6 overflow-hidden"
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
              <button 
                onClick={() => setShowFullscreenMap(true)}
                className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
              >
                <Maximize size={16} />
                Visualizar em tela cheia
              </button>
            </div>
            <div className="h-full rounded-xl overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
              <MapComponent />
            </div>
          </div>

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
            {loading ? (
              <p className="text-center text-gray-500">Carregando áreas...</p>
            ) : areas.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma área cadastrada</p>
            ) : (
              <div className="space-y-3">
                {areas.map((area) => (
                  <div
                    key={area.id}
                    onClick={() => handleAreaClick(area)}
                    className={`p-4 rounded-xl hover:bg-white/60 transition-all duration-300 border cursor-pointer ${
                      selectedArea?.id === area.id 
                        ? 'bg-white/70 border-blue-400' 
                        : 'bg-white/40 border-white/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-800">{area.nome}</h4>
                      <span 
                        className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          area.status_risco === "baixo" 
                            ? "bg-green-100 text-green-700"
                            : area.status_risco === "medio"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {area.status_risco === "baixo" ? "Baixo" : area.status_risco === "medio" ? "Médio" : "Alto"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{area.descricao || 'Sem descrição'}</p>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs text-gray-700">📍 {area.coordenadas || 'Sem coordenadas'}</span>
                    </div>
                    
                    {/* ⬇️ NOVO: Botão de Adicionar Sensor */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddSensor(area);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-2 text-white text-xs rounded-lg hover:scale-105 transition-all"
                      style={{
                        background: "linear-gradient(135deg, #5ADB62 0%, #4CAF50 100%)",
                        boxShadow: "0 4px 16px rgba(90, 219, 98, 0.4)",
                      }}
                    >
                      <Cpu size={14} />
                      Adicionar Sensor
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditArea(area);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-white text-xs rounded-lg hover:scale-105 transition-all"
                        style={{
                          background: "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
                          boxShadow: "0 4px 16px rgba(79, 195, 247, 0.4)",
                        }}
                      >
                        <Edit size={14} />
                        Editar
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteArea(area.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-all"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Nova Área */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Nova Área</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Nome da Área</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Coordenadas (Latitude, Longitude)
                </label>
                <input
                  type="text"
                  value={formData.coordenadas}
                  onChange={(e) => setFormData({ ...formData, coordenadas: e.target.value })}
                  placeholder="Ex: -23.9608, -46.3335"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dica: Use{" "}
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Google Maps
                  </a>{" "}
                  para obter as coordenadas
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all"
                >
                  Criar Área
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Editar Área</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateArea} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Nome da Área</label>
                <input
                  type="text"
                  value={editFormData.nome}
                  onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Descrição</label>
                <textarea
                  value={editFormData.descricao}
                  onChange={(e) => setEditFormData({ ...editFormData, descricao: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Coordenadas (Latitude, Longitude)
                </label>
                <input
                  type="text"
                  value={editFormData.coordenadas}
                  onChange={(e) => setEditFormData({ ...editFormData, coordenadas: e.target.value })}
                  placeholder="Ex: -23.9608, -46.3335"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⬇️ NOVO: Modal de Adicionar Sensor */}
      {showSensorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Adicionar Sensor</h3>
              <button
                onClick={() => setShowSensorModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSensor} className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Área:</strong> {selectedAreaForSensor?.nome}
                </p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Tipo do Sensor</label>
                <select
                  value={sensorFormData.tipo}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, tipo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="umidade">Umidade do Solo</option>
                  <option value="temperatura">Temperatura</option>
                  <option value="contaminacao">Contaminação</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Status</label>
                <select
                  value={sensorFormData.status}
                  onChange={(e) => setSensorFormData({ ...sensorFormData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="manutencao">Manutenção</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSensorModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-white rounded-xl hover:scale-105 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #5ADB62 0%, #4CAF50 100%)",
                    boxShadow: "0 4px 12px rgba(90, 219, 98, 0.3)",
                  }}
                >
                  Cadastrar Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Tela Cheia */}
      {showFullscreenMap && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">Mapa de Áreas - Tela Cheia</h3>
              <button
                onClick={() => setShowFullscreenMap(false)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden">
              <MapComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAreas;
