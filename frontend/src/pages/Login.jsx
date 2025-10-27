import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.senha);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl animate-fade-in-up">
          {/* Card Principal */}
          <div
            className="p-1 rounded-[50px] animated-border"
            style={{ borderRadius: "50px" }}
          >
            <div
              className="bg-[rgba(243,243,243,0.97)] rounded-[45px] overflow-hidden"
              style={{
                backdropFilter: "blur(2.5px)",
                WebkitBackdropFilter: "blur(2.5px)",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
                {/* Lado Esquerdo - Texto Motivacional */}
                <div className="flex flex-col justify-between p-12 border-r-2 border-gray-200">
                  <div>
                    <h1 className="text-4xl font-normal mb-16" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                      Login
                    </h1>
                    {/* Texto mais estreito para 3 linhas */}
                    <div className="max-w-[320px]">
                      <p className="text-2xl text-gray-700 leading-relaxed" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                        Acesse sua conta para monitorar as áreas de forma{" "}
                        <span className="font-bold" style={{ color: '#2EE9B4' }}>inteligente</span>.
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                      Não Possui uma Conta?
                    </p>
                    <Link
                      to="/cadastro"
                      className="text-base font-bold hover:underline"
                      style={{ color: '#2EE9B4', fontFamily: 'Albert Sans, sans-serif' }}
                    >
                      Cadastre-se
                    </Link>
                  </div>
                </div>

                {/* Lado Direito - Formulário */}
                <div className="flex flex-col justify-between p-12">
                  <form onSubmit={handleSubmit} className="space-y-6 mt-12">
                    {/* Mensagem de Erro */}
                    {error && (
                      <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="text-sm font-bold mb-2 block" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                        Email
                      </label>
                      <div
                        className="p-[2px] rounded-2xl"
                        style={{
                          background: "linear-gradient(90deg, #59CDFF, #5ADB62)",
                          borderRadius: "16px",
                        }}
                      >
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder=""
                          className="w-full px-4 py-3 rounded-2xl focus:outline-none transition-all duration-300"
                          style={{
                            fontFamily: 'Albert Sans, sans-serif',
                            borderRadius: "14px",
                            background: "rgba(243,243,243,0.97)",
                            backdropFilter: "blur(2px)",
                            WebkitBackdropFilter: "blur(2px)",
                          }}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Senha */}
                    <div>
                      <label className="text-sm font-bold mb-2 block" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                        Senha
                      </label>
                      <div
                        className="p-[2px] rounded-2xl relative"
                        style={{
                          background: "linear-gradient(90deg, #59CDFF, #5ADB62)",
                          borderRadius: "16px",
                        }}
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          name="senha"
                          value={formData.senha}
                          onChange={handleChange}
                          placeholder=""
                          className="w-full px-4 py-3 pr-12 rounded-2xl focus:outline-none transition-all duration-300"
                          style={{
                            fontFamily: 'Albert Sans, sans-serif',
                            borderRadius: "14px",
                            background: "rgba(243,243,243,0.97)",
                            backdropFilter: "blur(2px)",
                            WebkitBackdropFilter: "blur(2px)",
                          }}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-4">
                      {/* Botão Cancelar */}
                      <div
                        className="flex-1 p-[2px] rounded-2xl"
                        style={{
                          background: "linear-gradient(90deg, #59CDFF, #5ADB62)",
                          borderRadius: "16px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="w-full py-3 text-base rounded-2xl hover:brightness-95 transition-all duration-300"
                          style={{
                            fontFamily: 'Albert Sans, sans-serif',
                            borderRadius: "14px",
                            background: "rgba(243,243,243,0.97)",
                            backdropFilter: "blur(2px)",
                            WebkitBackdropFilter: "blur(2px)",
                          }}
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                      </div>

                      {/* Botão Entrar */}
                      <button
                        type="submit"
                        className="flex-1 py-3 text-white text-base bg-gradient-to-r from-blue to-green rounded-2xl hover:brightness-110 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          boxShadow: "5px 5px 15px rgba(0,0,0,0.15)",
                          fontFamily: 'Albert Sans, sans-serif',
                          borderRadius: "16px",
                        }}
                        disabled={loading}
                      >
                        {loading ? "Entrando..." : "Entrar"}
                      </button>
                    </div>
                  </form>

                  {/* Esqueceu a senha - POSIÇÃO ORIGINAL */}
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Albert Sans, sans-serif' }}>
                      Esqueceu a senha?{" "}
                      <Link
                        to="/recuperar-senha"
                        className="font-bold hover:underline"
                        style={{ color: '#2EE9B4' }}
                      >
                        Clique aqui
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* CSS Animações */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradientRotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animated-border {
          background: linear-gradient(
            90deg,
            #59cdff,
            #5adb62,
            #59cdff,
            #5adb62
          );
          background-size: 300% 300%;
          animation: gradientRotate 8s ease infinite;
          box-shadow: 7px 7px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Login;
