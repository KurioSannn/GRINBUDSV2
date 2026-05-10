"use client";
// Hot reload trigger
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { AVATARS } from "./ChildSetupScreen";

interface TransitionScreenProps {
  onFinish: () => void;
  userName: string;
  avatarId: string;
}

// Compact minimal landscape
const CompactLandscape = () => (
  <svg width="100%" height="120" viewBox="0 0 390 120" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 1, opacity: 0.85 }}>
    <path d="M-20 120 Q 150 40 420 120 Z" fill="#75D844" />
    <path d="M0 120 Q 200 70 390 120 Z" fill="#58CC02" />
    
    <circle cx="50" cy="100" r="4" fill="#FF8BBF" />
    <circle cx="58" cy="105" r="4" fill="#FF8BBF" />
    <circle cx="54" cy="103" r="2.5" fill="#FFD93D" />

    <circle cx="340" cy="100" r="5" fill="#FF9600" />
    <circle cx="350" cy="105" r="5" fill="#FF9600" />
    <circle cx="345" cy="102" r="3" fill="#FFD93D" />
  </svg>
);

export function TransitionScreen({ onFinish, userName, avatarId }: TransitionScreenProps) {
  const [loadingText, setLoadingText] = useState("Menyiapkan petualangan seru...");
  const selectedAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  useEffect(() => {
    const texts = ["Membuka dunia belajar...", "Mengumpulkan bintang...", "Menyiapkan petualangan seru..."];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 1000);
    const timer = setTimeout(onFinish, 3000); // Transisi cepat 3 detik
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
        background: "linear-gradient(180deg, #D4F4B8 0%, #E8F9D5 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}
    >
      <CompactLandscape />

      {/* Floating Ambient Atmosphere */}
      <motion.div animate={{ x: [0, 10, 0], y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: "absolute", top: "25%", left: "15%" }}>
        <Star size={14} fill="#FFD93D" color="#FFD93D" opacity={0.8} />
      </motion.div>
      <motion.div animate={{ y: [0, 10, 0], rotate: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: "absolute", top: "35%", right: "20%" }}>
        <div style={{ width: 8, height: 8, background: "#84FF59", borderRadius: 2 }} />
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} style={{ position: "absolute", top: "45%", left: "20%" }}>
        <div style={{ width: 6, height: 6, background: "#CE82FF", borderRadius: 2, opacity: 0.7 }} />
      </motion.div>

      {/* Ambient Clouds */}
      <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity }} style={{ position: "absolute", top: "15%", left: "-10%", opacity: 0.8 }}>
        <svg width="100" height="60" viewBox="0 0 100 60" fill="white">
          <circle cx="30" cy="30" r="16" /><circle cx="50" cy="22" r="20" /><circle cx="70" cy="30" r="16" /><rect x="30" y="30" width="40" height="16" />
        </svg>
      </motion.div>
      <motion.div animate={{ x: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} style={{ position: "absolute", top: "18%", right: "-10%", opacity: 0.6 }}>
        <svg width="100" height="60" viewBox="0 0 100 60" fill="white">
          <circle cx="30" cy="30" r="16" /><circle cx="50" cy="22" r="20" /><circle cx="70" cy="30" r="16" /><rect x="30" y="30" width="40" height="16" />
        </svg>
      </motion.div>

      {/* Compact Content Stack */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10, width: "100%" }}>
        
        {/* Mascot inside Glowing Ring */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.4)", filter: "blur(8px)", pointerEvents: "none" }}
          />
          {/* Inner solid ring */}
          <div style={{ width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.05), inset 0 0 0 4px white", overflow: "hidden", position: "relative", zIndex: 2 }}>
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selectedAvatar.icon}
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, fontWeight: 700, color: "#2E3A59", lineHeight: 1.2, textAlign: "center", marginBottom: 16 }}
        >
          Siap Bertualang!
        </motion.h1>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}
        >
          <Star size={16} fill="#58CC02" color="#58CC02" />
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 800, color: "#2E3A59", opacity: 0.8, letterSpacing: 0.2 }}>
            {loadingText}
          </p>
        </motion.div>

        {/* Premium Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          style={{ width: "55%", height: 22, background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: 4, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(255,255,255,0.6)", position: "relative" }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "linear" }}
            style={{ height: "100%", borderRadius: 8, background: "linear-gradient(90deg, #75D844 0%, #58CC02 100%)", boxShadow: "0 2px 8px rgba(88,204,2,0.4), inset 0 2px 0 rgba(255,255,255,0.4)", position: "relative", overflow: "hidden" }}
          >
            {/* Striped pattern overlay */}
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 16px)" }} />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
