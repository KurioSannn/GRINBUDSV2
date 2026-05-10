"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Star, Heart, Zap } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

// Polished GrinBuds Mascot
const GrinBudsMascot = () => (
  <div style={{ position: "relative", width: 140, height: 140 }}>
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
      <defs>
        <radialGradient id="mascotGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#84FF59" />
          <stop offset="40%" stopColor="#1CB0F6" />
          <stop offset="100%" stopColor="#7F2BFF" />
        </radialGradient>
        <filter id="mascotGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Soft Glow Halo */}
      <circle cx="70" cy="70" r="62" fill="none" stroke="#FFFFDD" strokeWidth="6" opacity="0.6" filter="url(#mascotGlow)" />
      
      {/* Main Body */}
      <circle cx="70" cy="70" r="52" fill="url(#mascotGrad)" />
      
      {/* Sprout / Leaf */}
      <path d="M70 18 C55 18 55 4 70 4 C85 4 85 18 70 18" fill="#58CC02" />
      
      {/* Eyes */}
      <circle cx="52" cy="62" r="10" fill="white" />
      <circle cx="88" cy="62" r="10" fill="white" />
      <circle cx="54" cy="62" r="5.5" fill="#3C3C3C" />
      <circle cx="86" cy="62" r="5.5" fill="#3C3C3C" />
      <circle cx="56" cy="60" r="2.5" fill="white" />
      <circle cx="84" cy="60" r="2.5" fill="white" />
      
      {/* Blush */}
      <ellipse cx="40" cy="72" rx="8" ry="5" fill="#FF6B9D" opacity="0.8" />
      <ellipse cx="100" cy="72" rx="8" ry="5" fill="#FF6B9D" opacity="0.8" />
      
      {/* Smile */}
      <path d="M58 76 Q70 92 82 76 Z" fill="#2E3A59" />
      <path d="M62 82 Q70 90 78 82 Z" fill="#FF6B9D" />
    </svg>
  </div>
);

// Fantasy Environment Landscape
const BottomLandscape = () => (
  <svg width="100%" height="240" viewBox="0 0 390 240" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 1 }}>
    {/* Distant Hills */}
    <path d="M0 130 Q 90 70 180 130 T 390 110 L 390 240 L 0 240 Z" fill="#B9F38E" opacity="0.8" />
    <path d="M-50 160 Q 50 100 150 160 T 400 140 L 400 240 L -50 240 Z" fill="#90E560" opacity="0.6" />
    
    {/* Front Hills */}
    <path d="M0 180 Q 120 140 200 200 T 390 170 L 390 240 L 0 240 Z" fill="#75D844" />
    
    {/* Stream / River */}
    <path d="M160 240 Q 180 210 200 190 Q 230 180 250 170 L 270 170 Q 250 190 210 210 Q 190 240 180 240 Z" fill="#C4EDF8" opacity="0.9" />
    
    <path d="M-20 240 Q 80 170 180 240 Z" fill="#58CC02" />
    <path d="M180 240 Q 280 170 410 240 Z" fill="#58CC02" />
    
    {/* Left Tree (Green) */}
    <g transform="translate(45, 155)">
      <circle cx="0" cy="0" r="32" fill="#58CC02" />
      <circle cx="-15" cy="-15" r="22" fill="#72C245" />
      <circle cx="15" cy="-15" r="22" fill="#72C245" />
      <path d="M-4 30 L4 30 L1 55 L-1 55 Z" fill="#8B5A33" />
    </g>
    
    {/* Right Tree (Pink) */}
    <g transform="translate(350, 160)">
      <circle cx="0" cy="0" r="38" fill="#FF9FCC" />
      <circle cx="-20" cy="-20" r="26" fill="#FFC2E2" />
      <circle cx="20" cy="-20" r="26" fill="#FFC2E2" />
      <path d="M-4 35 L4 35 L1 65 L-1 65 Z" fill="#8B5A33" />
    </g>
    
    {/* Flowers */}
    <circle cx="290" cy="210" r="8" fill="#FFD93D" />
    <circle cx="282" cy="210" r="5" fill="#FF6B9D" />
    <circle cx="298" cy="210" r="5" fill="#FF6B9D" />
    <circle cx="290" cy="202" r="5" fill="#FF6B9D" />
    <circle cx="290" cy="218" r="5" fill="#FF6B9D" />
    <circle cx="290" cy="210" r="3" fill="#FFD93D" />
  </svg>
);

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [loadingText, setLoadingText] = useState("Menyiapkan petualangan seru untukmu...");

  useEffect(() => {
    const texts = ["Mencari bintang...", "Membuka dunia belajar...", "Menyiapkan petualangan seru untukmu..."];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 1500);
    const timer = setTimeout(onFinish, 4500);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        width: 390, height: 844, borderRadius: 50,
        boxShadow: "0 32px 80px rgba(0,0,0,0.20), 0 0 0 6px white, 0 0 0 9px #e0e0f0",
        background: "linear-gradient(160deg, #E2F9DB 0%, #C4EDF8 40%, #E2DAFF 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
        alignItems: "center",
      }}
    >
      <BottomLandscape />

      {/* Ambient Clouds */}
      <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity }} style={{ position: "absolute", top: "6%", left: "-10%", opacity: 0.85 }}>
        <svg width="130" height="80" viewBox="0 0 100 60" fill="white">
          <circle cx="30" cy="30" r="20" /><circle cx="50" cy="20" r="20" /><circle cx="70" cy="30" r="20" /><rect x="30" y="30" width="40" height="20" />
        </svg>
      </motion.div>
      <motion.div animate={{ x: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} style={{ position: "absolute", top: "3%", right: "2%", opacity: 0.9 }}>
        <svg width="100" height="60" viewBox="0 0 100 60" fill="white">
          <circle cx="30" cy="30" r="20" /><circle cx="50" cy="20" r="20" /><circle cx="70" cy="30" r="20" /><rect x="30" y="30" width="40" height="20" />
        </svg>
      </motion.div>

      {/* Floating Stars and Bubbles */}
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }} transition={{ duration: 3.5, repeat: Infinity }} style={{ position: "absolute", top: "18%", left: "15%" }}>
        <Star size={42} fill="#FFD93D" color="#FFD93D" />
        <div style={{ position: "absolute", top: 14, left: 10, width: 6, height: 6, background: "#5E4A10", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: 14, right: 10, width: 6, height: 6, background: "#5E4A10", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: 22, left: 18, width: 6, height: 3, borderBottom: "2px solid #5E4A10", borderRadius: "50%" }} />
      </motion.div>

      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4.5, repeat: Infinity }} style={{ position: "absolute", top: "16%", right: "15%" }}>
        <div style={{ width: 52, height: 52, background: "#1CB0F6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(28,176,246,0.3)" }}>
          <Heart size={24} fill="white" color="white" />
        </div>
      </motion.div>
      
      {/* Sparks */}
      <motion.div animate={{ y: [0, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ position: "absolute", top: "30%", left: "8%" }}>
        <Sparkles size={20} color="#CE82FF" />
      </motion.div>

      {/* Main Content Group */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", zIndex: 10, marginTop: "-5%" }}>
        
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          style={{
            position: "relative",
            width: "88%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(24px)",
            borderRadius: 36,
            padding: "52px 20px 32px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.06), 0 0 0 4px rgba(255,255,255,0.7), inset 0 2px 24px rgba(255,255,255,1)",
            display: "flex", flexDirection: "column", alignItems: "center",
            marginTop: 65,
          }}
        >
          {/* Floating Mascot overlapping the card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: -75 }}
          >
            <GrinBudsMascot />
          </motion.div>

          {/* Typography */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 52, fontWeight: 700, color: "#1A2542", lineHeight: 1, letterSpacing: -1 }}>
              Grin<span style={{ color: "#58CC02" }}>Buds</span>
            </h1>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 900, color: "#A8B4CA", letterSpacing: 3, marginTop: 12 }}>
              BELAJAR • BERMAIN • BERKEMBANG
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 28, marginBottom: 32 }}>
            <Sparkles size={18} color="#FFD93D" fill="#FFD93D" />
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 800, color: "#3B4B69", lineHeight: 1.4, textAlign: "center" }}>
              Petualangan membaca seru <br/>untuk si kecil!
            </p>
          </div>

          {/* Feature Chips */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #E6FCDA, #C9F5AB)", padding: "10px 16px", borderRadius: 24, color: "#4CAE02", fontWeight: 800, fontSize: 13, fontFamily: "'Nunito', sans-serif", boxShadow: "0 6px 16px rgba(88,204,2,0.15)" }}>
              <BookOpen size={16} strokeWidth={2.5} /> Interaktif
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #FFE8F2, #FFCDE1)", padding: "10px 16px", borderRadius: 24, color: "#ED457D", fontWeight: 800, fontSize: 13, fontFamily: "'Nunito', sans-serif", boxShadow: "0 6px 16px rgba(255,107,157,0.15)" }}>
              <Heart size={16} strokeWidth={2.5} /> Menyenangkan
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #E2F5FF, #BEE6FF)", padding: "10px 16px", borderRadius: 24, color: "#1495D4", fontWeight: 800, fontSize: 13, fontFamily: "'Nunito', sans-serif", boxShadow: "0 6px 16px rgba(28,176,246,0.15)" }}>
              <Zap size={16} strokeWidth={2.5} /> AI Cerdas
            </div>
          </div>
        </motion.div>

        {/* Loading Bar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ marginTop: 44, width: "74%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", marginBottom: 12 }}>
            <Star size={24} fill="#FFD93D" color="#FFD93D" />
            <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.45)", borderRadius: 6, position: "relative", overflow: "hidden", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)" }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "95%" }}
                transition={{ duration: 4, ease: "easeOut" }}
                style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "linear-gradient(90deg, #58CC02, #1CB0F6)", borderRadius: 6, boxShadow: "0 0 12px rgba(28,176,246,0.5)" }}
              />
            </div>
          </div>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, color: "#546884", letterSpacing: 0.5, textAlign: "center" }}>
             {loadingText}
          </p>
        </motion.div>

      </div>

      <p style={{ position: "absolute", bottom: 20, fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, color: "#8BA0B8", zIndex: 10, opacity: 0.8 }}>
        v2.0 • GrinBuds © 2025
      </p>

    </div>
  );
}
