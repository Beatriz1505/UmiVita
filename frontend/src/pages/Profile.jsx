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
  Mail,
  Phone,
  MapPinIcon,
  Calendar,
  Shield,
  Save,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("perfil");
  const [notifications, setNotifications] = useState(3);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [userData, setUserData] = useState({
    nome: "Admin UmiVita",
    email: "admin@umivita.com",
    telefone: "(11) 98765-4321",
    cargo: "Administrador do Sistema",
    localizacao: "São Paulo, SP",
    dataCadastro: "15/01/2024",
  });

  const [editData, setEditData] = useState({...userData});

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

  const handleSaveEdit = () => {
    setUserData({...editData});
    setShowEditModal(false);
    console.log("Dados salvos:", editData);
  };

  const handleDeleteAccount = () => {
    console.log("Conta excluída");
    navigate("/login");
  };

  const openEditModal = () => {
    setEditData({...userData});
    setShowEditModal(true);
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
                Perfil 👤
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Gerencie suas informações e configurações
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

        {/* Content - Perfil + Estatísticas SEM SCROLL */}
        <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Informações do Perfil */}
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
              <h3 className="text-lg font-bold text-gray-800">Informações do Perfil</h3>
              <button
                onClick={openEditModal}
                className="text-sm text-gray-800 hover:text-gray-900 font-medium hover:underline"
              >
                Editar Perfil →
              </button>
            </div>

            {/* Avatar Grande */}
            <div className="flex items-center gap-4 mb-4 p-4 rounded-xl bg-white/40 border border-white/50">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue to-green flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                A
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{userData.nome}</h4>
                <p className="text-sm text-gray-600">{userData.cargo}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Shield size={12} className="text-green-600" />
                  <span className="text-xs text-green-600 font-semibold">Conta Verificada</span>
                </div>
              </div>
            </div>

            {/* Informações em Cards */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/40 border border-white/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={14} className="text-gray-600" />
                    <p className="text-xs font-semibold text-gray-600">E-mail</p>
                  </div>
                  <p className="text-sm text-gray-800">{userData.email}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/40 border border-white/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={14} className="text-gray-600" />
                    <p className="text-xs font-semibold text-gray-600">Telefone</p>
                  </div>
                  <p className="text-sm text-gray-800">{userData.telefone}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/40 border border-white/50">
                <div className="flex items-center gap-2 mb-1">
                  <MapPinIcon size={14} className="text-gray-600" />
                  <p className="text-xs font-semibold text-gray-600">Localização</p>
                </div>
                <p className="text-sm text-gray-800">{userData.localizacao}</p>
              </div>

              {/* Botão Excluir Conta */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-all"
              >
                <Trash2 size={16} />
                <span className="text-sm font-semibold">Excluir Conta</span>
              </button>
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
              <div className="p-3 rounded-xl bg-white/40 border border-white/50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-gray-600" />
                  <p className="text-xs text-gray-600">Membro desde</p>
                </div>
                <p className="text-xl font-bold text-gray-800">{userData.dataCadastro}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Áreas Gerenciadas</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>

              <div className="p-3 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Relatórios Gerados</p>
                <p className="text-2xl font-bold text-green-600">45</p>
              </div>

              <div className="p-3 rounded-xl bg-white/40 border border-white/50">
                <p className="text-xs text-gray-600 mb-1">Alertas Resolvidos</p>
                <p className="text-2xl font-bold text-orange-600">128</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div
            className="w-full max-w-2xl rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Editar Perfil</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Nome Completo</label>
                  <input
                    type="text"
                    value={editData.nome}
                    onChange={(e) => setEditData({...editData, nome: e.target.value})}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Cargo</label>
                  <input
                    type="text"
                    value={editData.cargo}
                    onChange={(e) => setEditData({...editData, cargo: e.target.value})}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">E-mail</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Telefone</label>
                <input
                  type="tel"
                  value={editData.telefone}
                  onChange={(e) => setEditData({...editData, telefone: e.target.value})}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Localização</label>
                <input
                  type="text"
                  value={editData.localizacao}
                  onChange={(e) => setEditData({...editData, localizacao: e.target.value})}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Excluir Conta?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
