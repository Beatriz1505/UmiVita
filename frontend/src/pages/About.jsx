import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-bg font-text flex flex-col items-center">
      <Header />

      {/* HERO - COPIADO DA HOME */}
      <section className="flex justify-center items-center w-full mt-12 animate-fade-in-up">
        <div
          className="p-1 rounded-[50px] w-full max-w-5xl transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl animated-border"
        >
          <div
            className="flex flex-col items-center w-full px-12 py-20"
            style={{
              borderRadius: "45px",
              background: "rgba(243,243,243,0.97)",
              backdropFilter: "blur(2.5px)",
              WebkitBackdropFilter: "blur(2.5px)",
            }}
          >
            <h1 className="font-title text-[6rem] font-bold mb-10 bg-gradient-to-r from-blue to-green text-transparent bg-clip-text">
              Quem Somos
            </h1>
            <p className="font-text text-center text-black text-base mb-8 max-w-2xl">
              Conheça um pouco mais sobre nossa história e equipe, focando na nossa trajetória até aqui
            </p>
            <button
              className="mt-6 px-7 py-3 font-text text-white text-base bg-gradient-to-r from-blue to-green hover:brightness-110 hover:scale-105 transition-all duration-300"
              style={{
                borderRadius: "20px",
                boxShadow: "7px 7px 20px rgba(0,0,0,0.20)",
                fontSize: "1.05rem",
              }}
            >
              Cada grau importa, cada gota conta
            </button>
          </div>
        </div>
      </section>

      {/* Cards Section - Nossa Missão */}
      <section className="w-full flex justify-center mt-20">
        <div className="w-full max-w-5xl">
          <div
            className="p-1 rounded-[50px] animated-border"
            style={{ borderRadius: "50px" }}
          >
            <div
              className="bg-[rgba(243,243,243,0.97)] rounded-[45px] p-12"
              style={{
                backdropFilter: "blur(2.5px)",
                WebkitBackdropFilter: "blur(2.5px)",
              }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                Nossa <span style={{ color: '#2EE9B4' }}>Missão</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                O UmiVita é uma solução inteligente dedicada ao monitoramento ambiental em áreas portuárias. 
                Utilizamos tecnologia de sensores avançados para detectar variações críticas de umidade e temperatura do solo, 
                garantindo a preservação ambiental e a segurança das operações portuárias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section - O que Fazemos */}
      <section className="w-full flex justify-center mt-20">
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            O que <span style={{ color: '#2EE9B4' }}>Oferecemos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              className="p-1 rounded-[30px] animated-border hover:scale-105 transition-all duration-300"
              style={{ borderRadius: "30px" }}
            >
              <div
                className="bg-[rgba(243,243,243,0.97)] rounded-[26px] p-8 h-full"
                style={{
                  backdropFilter: "blur(2.5px)",
                  WebkitBackdropFilter: "blur(2.5px)",
                }}
              >
                <div className="text-4xl mb-4">🌡️</div>
                <h3 className="text-xl font-bold mb-3">
                  Monitoramento em Tempo Real
                </h3>
                <p className="text-gray-700">
                  Detecção automática de variações críticas de umidade e temperatura do solo com alertas imediatos.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="p-1 rounded-[30px] animated-border hover:scale-105 transition-all duration-300"
              style={{ borderRadius: "30px" }}
            >
              <div
                className="bg-[rgba(243,243,243,0.97)] rounded-[26px] p-8 h-full"
                style={{
                  backdropFilter: "blur(2.5px)",
                  WebkitBackdropFilter: "blur(2.5px)",
                }}
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-3">
                  Análise Preditiva
                </h3>
                <p className="text-gray-700">
                  Históricos detalhados e identificação de padrões para previsão de riscos ambientais.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="p-1 rounded-[30px] animated-border hover:scale-105 transition-all duration-300"
              style={{ borderRadius: "30px" }}
            >
              <div
                className="bg-[rgba(243,243,243,0.97)] rounded-[26px] p-8 h-full"
                style={{
                  backdropFilter: "blur(2.5px)",
                  WebkitBackdropFilter: "blur(2.5px)",
                }}
              >
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold mb-3">
                  Mapeamento de Zonas
                </h3>
                <p className="text-gray-700">
                  Visualização de áreas críticas e gestão eficiente para prevenção de contaminações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section - Nosso Compromisso */}
      <section className="w-full flex justify-center mt-20 mb-16">
        <div className="w-full max-w-5xl">
          <div
            className="p-1 rounded-[50px] animated-border"
            style={{ borderRadius: "50px" }}
          >
            <div
              className="bg-[rgba(243,243,243,0.97)] rounded-[45px] p-12"
              style={{
                backdropFilter: "blur(2.5px)",
                WebkitBackdropFilter: "blur(2.5px)",
              }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                Nosso <span style={{ color: '#2EE9B4' }}>Compromisso</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-8">
                Acreditamos que a tecnologia pode ser uma aliada poderosa na preservação ambiental. 
                Nosso compromisso é fornecer ferramentas precisas e eficientes que permitam a gestão 
                preditiva dos riscos ambientais, contribuindo para um futuro mais sustentável e seguro.
              </p>
              <div className="flex justify-center">
                <Link to="/cadastro">
                  <button
                    className="px-8 py-3 text-white text-base bg-gradient-to-r from-blue to-green rounded-2xl hover:brightness-110 hover:scale-105 transition-all duration-300"
                    style={{
                      boxShadow: "5px 5px 15px rgba(0,0,0,0.15)",
                    }}
                  >
                    Comece Agora
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* CSS Animações - COPIADO DA HOME */}
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
          background: linear-gradient(90deg, #59CDFF, #5ADB62, #59CDFF, #5ADB62);
          background-size: 300% 300%;
          animation: gradientRotate 10s ease infinite;
          box-shadow: 7px 7px 20px rgba(0,0,0,0.20);
        }
      `}</style>
    </div>
  );
};

export default About;
