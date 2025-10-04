import React from "react";
import { Link } from "react-router-dom";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full flex justify-center mt-20 mb-8">
      <div
        className="p-1 rounded-[50px] w-full max-w-5xl"
        style={{
          background: "linear-gradient(90deg, #59CDFF, #5ADB62)",
          boxShadow: "7px 7px 20px rgba(0,0,0,0.20)",
        }}
      >
        <div
          className="w-full py-10 rounded-[45px]"
          style={{
            background: "rgba(243,243,243,0.97)",
            backdropFilter: "blur(2.5px)",
            WebkitBackdropFilter: "blur(2.5px)",
          }}
        >
          {/* Header do Footer */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200 px-12">
            <div>
              <h3 className="font-title text-2xl font-bold bg-gradient-to-r from-blue to-green text-transparent bg-clip-text">
                UmiVita
              </h3>
              <p className="font-text text-sm text-gray-600 mt-1">
                Faça já o seu cadastro
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/cadastro">
                <button
                  className="px-6 py-2 font-text text-base bg-gradient-to-r from-blue to-green text-white rounded-full hover:brightness-90 transition"
                  style={{
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.15)",
                  }}
                >
                  Cadastro
                </button>
              </Link>
              <Link to="/login">
                <button
                  className="px-6 py-2 font-text text-base bg-gradient-to-r from-blue to-green text-white rounded-full hover:brightness-90 transition"
                  style={{
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.15)",
                  }}
                >
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/* Links organizados - ALINHADO PERFEITAMENTE */}
          <div className="flex justify-between mb-8 px-12">
            {/* Contato */}
            <div>
              <h4 className="font-title text-base font-bold mb-3">Contato</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  <Mail size={16} />
                  <span>contato@umivita.com</span>
                </li>
                <li className="flex items-center gap-2 font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  <MapPin size={16} />
                  <span>Porto de Santos, SP</span>
                </li>
              </ul>
            </div>

            {/* Termos */}
            <div>
              <h4 className="font-title text-base font-bold mb-3">Termos</h4>
              <ul className="space-y-2">
                <li className="font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  Termos de Uso
                </li>
                <li className="font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  Política de Privacidade
                </li>
                <li className="font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  Cookies
                </li>
              </ul>
            </div>

            {/* Suporte */}
            <div>
              <h4 className="font-title text-base font-bold mb-3">Suporte</h4>
              <ul className="space-y-2">
                <li className="font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  Central de Ajuda
                </li>
                <li className="font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  FAQ
                </li>
                <li className="font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  Documentação
                </li>
              </ul>
            </div>

            {/* Links úteis */}
            <div>
              <h4 className="font-title text-base font-bold mb-3">Links Úteis</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  <Github size={16} />
                  <span>GitHub</span>
                </li>
                <li className="flex items-center gap-2 font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </li>
                <li className="font-text text-sm text-gray-700 hover:text-blue transition cursor-pointer">
                  Sobre Nós
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t-2 border-gray-200 px-12">
            <p className="font-text text-xs text-gray-600">
              © 2025 UmiVita. Todos os direitos reservados. | Monitoramento ambiental inteligente para portos sustentáveis.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
