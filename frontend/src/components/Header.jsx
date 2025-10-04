import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full flex justify-center py-6">
      <div
        className="p-1 rounded-[40px] w-full max-w-5xl animated-border-header"
        style={{
          boxShadow: "7px 7px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="w-full flex justify-between items-center px-12 py-4 rounded-[36px]"
          style={{
            background: "rgba(243,243,243,0.97)",
            backdropFilter: "blur(2.5px)",
            WebkitBackdropFilter: "blur(2.5px)",
          }}
        >
          <Link to="/">
            <h1 className="font-title text-3xl font-bold bg-gradient-to-r from-blue to-green text-transparent bg-clip-text cursor-pointer hover:scale-105 transition-transform duration-300">
              UmiVita
            </h1>
          </Link>
          
          <nav className="flex gap-8 items-center">
            <Link to="/">
              <span className="font-text text-base text-gray-700 hover:text-blue transition-colors duration-300 cursor-pointer">
                Início
              </span>
            </Link>
            <Link to="/quem-somos">
              <span className="font-text text-base text-gray-700 hover:text-blue transition-colors duration-300 cursor-pointer">
                Quem Somos
              </span>
            </Link>
            <Link to="/suporte">
              <span className="font-text text-base text-gray-700 hover:text-blue transition-colors duration-300 cursor-pointer">
                Suporte
              </span>
            </Link>
            <Link to="/login">
              <span className="font-text text-base text-gray-700 hover:text-blue transition-colors duration-300 cursor-pointer">
                Login
              </span>
            </Link>
          </nav>
        </div>
      </div>

      {/* CSS para borda animada */}
      <style jsx>{`
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

        .animated-border-header {
          background: linear-gradient(
            90deg,
            #59cdff,
            #5adb62,
            #59cdff,
            #5adb62
          );
          background-size: 300% 300%;
          animation: gradientRotate 8s ease infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
