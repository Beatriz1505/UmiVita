import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  Shield,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("perfil");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
  });

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "areas", icon: MapPin, label: "Gerenciar Áreas", path: "/dashboard/areas" },
    { id: "graficos", icon: BarChart3, label: "Gráficos", path: "/dashboard/graficos" },
    { id: "relatorios", icon: FileText, label: "Relatórios", path: "/dashboard/relatorios" },
    { id: "historico", icon: History, label: "Histórico", path: "/dashboard/historico" },
    { id: "notificacoes", icon: Bell, label: "Notificações", path: "/dashboard/notificacoes" },
    { id: "perfil", icon: User, label: "Perfil", path: "/dashboard/perfil" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setActivePage(item.id);
    navigate(item.path);
  };

  const handleSave = () => {
    // Aqui você pode adicionar a lógica para atualizar o perfil via API
    console.log('Salvando perfil:', formData);
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

  const handleCancel = () => {
    setFormData({
      nome: user?.nome || "",
      email: user?.email || "",
    });
    setIsEditing(false);
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
              <h2 className="text-2xl font-bold text-gray-800">
                Meu Perfil 👤
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Gerencie suas informações pessoais
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                <Edit size={18} />
                <span className="font-semibold">Editar Perfil</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Card de Perfil */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              }}
            >
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue to-green flex items-center justify-center text-white text-4xl font-bold">
                  {user?.nome?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{user?.nome}</h3>
                  <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
                </div>
              </div>

              {/* Informações */}
              <div className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={18} />
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white"
                    />
                  ) : (
                    <div className="p-3 bg-white/50 rounded-xl text-gray-800">
                      {user?.nome}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={18} />
                    E-mail
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white"
                    />
                  ) : (
                    <div className="p-3 bg-white/50 rounded-xl text-gray-800">
                      {user?.email}
                    </div>
                  )}
                </div>

                {/* Perfil (não editável) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Shield size={18} />
                    Tipo de Perfil
                  </label>
                  <div className="p-3 bg-white/50 rounded-xl">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      user?.perfil === 'admin' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user?.perfil === 'admin' ? 'Administrador' : 'Operador'}
                    </span>
                  </div>
                </div>

                {/* Data de Criação (não editável) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={18} />
                    Membro Desde
                  </label>
                  <div className="p-3 bg-white/50 rounded-xl text-gray-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Botões de Ação (quando editando) */}
              {isEditing && (
                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                  >
                    <X size={18} />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue to-green text-white rounded-xl hover:scale-105 transition-all font-semibold"
                  >
                    <Save size={18} />
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>

            {/* Card de Segurança */}
            <div
              className="rounded-2xl p-6 mt-6"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Segurança</h3>
              <button
                onClick={() => alert('Funcionalidade de alterar senha em desenvolvimento!')}
                className="w-full p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold"
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
