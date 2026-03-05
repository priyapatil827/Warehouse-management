import React from "react";
import { useNavigate } from "react-router-dom";
import "./FirstPage.css";

export default function FirstPage() {
  const navigate = useNavigate();

  return (
    <div className="firstpage relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden text-white">

      {/* Animated Grid Background */}
      <div className="grid-bg absolute inset-0 opacity-20"></div>

      {/* Floating Boxes */}
      <div className="box b1 absolute w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="box b2 absolute w-40 h-40 bg-cyan-500/20 blur-2xl rounded-full bottom-20 right-20 animate-bounce"></div>
      <div className="box b3 absolute w-28 h-28 bg-purple-500/20 blur-2xl rounded-full top-1/2 left-1/3 animate-ping"></div>

      {/* Main Card */}
      <div className="firstpage-card relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-10 w-[90%] md:w-[700px] text-center">

        <div className="logo-box mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-2xl font-bold shadow-lg">
          WH
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Smart Warehouse Hub
        </h1>

        <p className="para text-gray-300 text-lg mb-6 leading-relaxed">
          Real-time stock tracking, supplier flow automation, and AI-powered
          warehouse insights — all in one futuristic platform.
        </p>

        <div className="feature-row grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm md:text-base">
          <div className="feature bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-indigo-500/20 transition">
            📦 Live Inventory
          </div>
          <div className="feature bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-cyan-500/20 transition">
            🚚 Smart Logistics
          </div>
          <div className="feature bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-purple-500/20 transition">
            📊 AI Reports
          </div>
          <div className="feature bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-pink-500/20 transition">
            🔔 Auto Alerts
          </div>
        </div>

        <button
          className="start-btn px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-105 hover:shadow-xl transition duration-300"
          onClick={() => navigate("/select-page")}
        >
          Enter Control Panel
        </button>

      </div>
    </div>
  );
}