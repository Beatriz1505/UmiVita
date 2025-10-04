import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChevronDown } from "lucide-react";

const featuresWhy = [
  {
    imgSrc: "/images/droplet.png",
    title: "Umidade",
    description: "Monitorar a umidade do solo ajuda a evitar erosão, contaminação e manter a estabilidade ambiental.",
  },
  {
    imgSrc: "/images/thermometer.png",
    title: "Temperatura",
    description: "Monitorar a temperatura ajuda a manter o equilíbrio ambiental, prevenindo danos que podem afetar plantas, animais e o solo.",
  },
  {
    imgSrc: "/images/leaf.png",
    title: "Vida",
    description: "Preservar essas condições protege o ecossistema local, garantindo fauna, flora e solo saudáveis.",
  },
];

const accordionItems = [
  {
    title: "Monitoramento Contínuo do Solo",
    content: "1. Sensores instalados no solo portuário medem continuamente a umidade e a temperatura.",
  },
  {
    title: "Coleta e Processamento de Dados",
    content: "2. Os dados coletados são enviados para armazenamento ESP32 para processamento.",
  },
  {
    title: "Análise de Riscos Ambientais",
    content: "3. O sistema analisa os valores e identifica se há riscos que indicam risco ambiental.",
  },
  {
    title: "Alertas Visuais Imediatos",
    content: "4. Alertas visuais, usando LEDs e buzzer, são acionados imediatamente quando um risco é detectado.",
  },
  {
    title: "Armazenamento e Gestão de Dados",
    content: "5. Todos os dados são armazenados para ger históricos, identificar padrões e facilitar ações de prevenção e gestão ambiental.",
  },
];

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div
    className="p-1 rounded-[30px] mb-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animated-border"
    style={{
      borderRadius: "30px",
    }}
  >
    <div
      className="bg-[rgba(243,243,243,0.97)] rounded-[26px] overflow-hidden"
      style={{
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <h3 className="font-title text-lg font-bold">{title}</h3>
        <ChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          size={24}
          strokeWidth={2}
        />
      </button>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="font-text text-black text-[15px] px-6 pb-6">
          {content}
        </p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-bg font-text flex flex-col items-center">
      <Header />

      {/* HERO */}
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
              UMIVITA
            </h1>
            <p className="font-text text-center text-black text-base mb-8 max-w-2xl">
              Monitore a umidade e temperatura do solo em portos, gerando alertas imediatos e dados para prevenir riscos ambientais de forma automática e eficiente.
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

      {/* O que é o UmiVita? */}
      <section className="w-full flex justify-center mt-20">
        <div className="w-full max-w-5xl">
          <h2 className="font-title text-2xl mb-12 px-0 animate-fade-in">
            <span className="text-blue">O que é o </span>
            <span className="text-green">UmiVita?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            {[
              {
                title: "Monitoramento Ambiental Inteligente",
                desc: "O UmiVita usa sensores para acompanhar a umidade e temperatura do solo, identificando variações críticas.",
              },
              {
                title: "Alertas e Registros de Dados",
                desc: "O sistema emite alertas visuais imediatos em caso de risco e armazena dados ambientais para análise futura.",
              },
              {
                title: "Gestão e Prevenção",
                desc: "Permite mapear áreas críticas, prevenir contaminações e otimizar a preservação ambiental no solo portuário.",
              },
            ].map((card, index) => (
              <div
                key={card.title}
                className="p-1 rounded-[30px] flex transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animated-border"
                style={{
                  borderRadius: "30px",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className="flex flex-col justify-between bg-[rgba(243,243,243,0.97)] p-6 rounded-[26px] h-full w-full"
                  style={{
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                  }}
                >
                  <h3 className="font-title text-lg font-bold mb-3">{card.title}</h3>
                  <p className="font-text text-black text-[15px]">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que Usar? */}
      <section className="w-full flex justify-center mt-20">
        <div className="w-full max-w-5xl">
          <h2 className="font-title text-2xl mb-12 px-0 animate-fade-in">
            <span className="text-blue">Por que </span>
            <span className="text-green">Usar?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
            {featuresWhy.map(({ imgSrc, title, description }, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full shadow-lg mb-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl animated-border-circle"
                  style={{
                    width: 110,
                    height: 110,
                    padding: 5,
                    borderRadius: "9999px",
                  }}
                >
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      background: "rgba(243,243,243,0.97)",
                      width: 97,
                      height: 97,
                      borderRadius: "9999px",
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={title}
                      className="max-w-[58px] max-h-[58px] object-contain"
                    />
                  </span>
                </span>
                <h3 className="font-title text-xl font-bold mb-2">{title}</h3>
                <p className="font-text text-center text-black text-sm max-w-[240px]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona? */}
      <section className="w-full flex justify-center mt-20">
        <div className="w-full max-w-5xl">
          <h2 className="font-title text-2xl mb-12 px-0 animate-fade-in">
            <span className="text-blue">Como </span>
            <span className="text-green">Funciona?</span>
          </h2>
          <div className="w-full">
            {accordionItems.map((item, index) => (
              <AccordionItem
                key={index}
                title={item.title}
                content={item.content}
                isOpen={openIndex === index}
                onClick={() => toggleAccordion(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* CSS para animações */}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animated-border {
          background: linear-gradient(90deg, #59CDFF, #5ADB62, #59CDFF, #5ADB62);
          background-size: 300% 300%;
          animation: gradientRotate 10s ease infinite;
          box-shadow: 7px 7px 20px rgba(0,0,0,0.20);
        }

        .animated-border-circle {
          background: linear-gradient(135deg, #59CDFF, #5ADB62, #59CDFF, #5ADB62);
          background-size: 300% 300%;
          animation: gradientRotate 8s ease infinite;
          box-shadow: 0 3px 18px rgba(33,200,134,0.18);
        }
      `}</style>
    </div>
  );
};

export default Home;
