"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { generateFinalAssessment, type FinalAiAssessment } from "@/lib/finalAssessmentApi";
import { ChevronLeft, ChevronRight, Calendar, Lock, Target, Sparkles } from "lucide-react";

// ── PREMIUM GLOSSY AI MASCOT ──
const AIPremiumMascot = ({ size = 140 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 140 160" fill="none" style={{ filter: "drop-shadow(0 16px 32px rgba(99,102,241,0.25))" }}>
    <defs>
      <radialGradient id="aiOrbGrad" cx="35%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#F3E8FF" />
        <stop offset="40%" stopColor="#DDD6FE" />
        <stop offset="100%" stopColor="#A78BFA" />
      </radialGradient>
      <radialGradient id="aiGloss" cx="30%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.1" />
      </radialGradient>
      <radialGradient id="eyeInner" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </radialGradient>
    </defs>

    {/* Main orb body */}
    <circle cx="70" cy="75" r="55" fill="url(#aiOrbGrad)" />

    {/* Premium shine/gloss */}
    <circle cx="50" cy="50" r="28" fill="url(#aiGloss)" />

    {/* Left eye - large and expressive */}
    <circle cx="50" cy="70" r="12" fill="white" opacity="0.95" />
    <circle cx="50" cy="70" r="8" fill="url(#eyeInner)" />
    <circle cx="50" cy="70" r="5" fill="#E0F2FE" />
    <circle cx="52" cy="67" r="2.5" fill="white" />

    {/* Right eye - large and expressive */}
    <circle cx="90" cy="70" r="12" fill="white" opacity="0.95" />
    <circle cx="90" cy="70" r="8" fill="url(#eyeInner)" />
    <circle cx="90" cy="70" r="5" fill="#E0F2FE" />
    <circle cx="92" cy="67" r="2.5" fill="white" />

    {/* Smile */}
    <path d="M55 95 Q70 108 85 95" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />

    {/* Outer glow ring */}
    <circle cx="70" cy="75" r="58" fill="none" stroke="#A78BFA" strokeWidth="2" opacity="0.4" />
    <circle cx="70" cy="75" r="62" fill="none" stroke="#A78BFA" strokeWidth="1" opacity="0.2" />

    {/* Bottom shine */}
    <ellipse cx="70" cy="125" rx="35" ry="15" fill="rgba(255,255,255,0.15)" />
  </svg>
);

const SmallMascotReaction = ({ type = "happy", size = 28 }: { type: "happy" | "sad" | "neutral" | "confused"; size?: number }) => {
  const colorMap = {
    happy: { bg: "#58CC02" },
    sad: { bg: "#FF4B4B" },
    neutral: { bg: "#FFB800" },
    confused: { bg: "#FF9F43" },
  };
  const color = colorMap[type];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: `drop-shadow(0 4px 8px ${color.bg}40)` }}>
      <circle cx="16" cy="16" r="14" fill={color.bg} />
      <circle cx="11" cy="13" r="2.5" fill="white" />
      <circle cx="21" cy="13" r="2.5" fill="white" />
      {type === "happy" && <path d="M11 20 Q16 23 21 20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {type === "sad" && <path d="M11 22 Q16 19 21 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {type === "neutral" && <path d="M12 21 L20 21" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {type === "confused" && (
        <>
          <path d="M12 20 Q16 22 20 20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="19" r="1.5" fill="white" />
        </>
      )}
    </svg>
  );
};

// ── GLOSSY ROUND ORB MASCOT ──
const GrinbudsMascot = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 140 160" fill="none" style={{ filter: "drop-shadow(0 12px 28px rgba(255,159,67,0.35))" }}>
    <defs>
      <radialGradient id="orbBodyGrad" cx="38%" cy="38%" r="70%">
        <stop offset="0%" stopColor="#FFE8D6" />
        <stop offset="40%" stopColor="#FFD8B8" />
        <stop offset="100%" stopColor="#FF9F43" />
      </radialGradient>
      <radialGradient id="orbGloss" cx="28%" cy="28%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.05" />
      </radialGradient>
    </defs>
    
    {/* Main orb */}
    <circle cx="70" cy="80" r="55" fill="url(#orbBodyGrad)" />
    
    {/* Glossy shine */}
    <circle cx="48" cy="52" r="32" fill="url(#orbGloss)" />
    
    {/* Left eye - large and cute */}
    <circle cx="50" cy="75" r="11" fill="white" />
    <circle cx="50" cy="75" r="7" fill="#FF9F43" />
    <circle cx="52" cy="72" r="2.5" fill="white" />
    
    {/* Right eye - large and cute */}
    <circle cx="90" cy="75" r="11" fill="white" />
    <circle cx="90" cy="75" r="7" fill="#FF9F43" />
    <circle cx="92" cy="72" r="2.5" fill="white" />
    
    {/* Happy smile */}
    <path d="M56 100 Q70 112 84 100" stroke="#FF9F43" strokeWidth="3" fill="none" strokeLinecap="round" />
    
    {/* Cheeks blush */}
    <circle cx="32" cy="80" r="8" fill="#FFB3C6" opacity="0.6" />
    <circle cx="108" cy="80" r="8" fill="#FFB3C6" opacity="0.6" />
    
    {/* Bottom shine reflect */}
    <ellipse cx="70" cy="130" rx="38" ry="18" fill="rgba(255,255,255,0.2)" />
    
    {/* Outer glow */}
    <circle cx="70" cy="80" r="58" fill="none" stroke="#FFB3C6" strokeWidth="1.5" opacity="0.3" />
  </svg>
);

// ── PREMIUM DECORATIVE ICONS ──
const ChunkyFlower = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(255,94,142,0.28))" }}>
    <defs>
      <radialGradient id="flowerG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFB3C6" /><stop offset="100%" stopColor="#FF5E8E" /></radialGradient>
      <radialGradient id="flowerC" cx="30%" cy="30%" r="60%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#FFD93D" /></radialGradient>
    </defs>
    <path d="M16 6 C18 0, 24 0, 26 6 C32 8, 32 14, 26 16 C32 18, 32 24, 26 26 C24 32, 18 32, 16 26 C14 32, 8 32, 6 26 C0 24, 0 18, 6 16 C0 14, 0 8, 6 6 C8 0, 14 0, 16 6 Z" fill="url(#flowerG)" />
    <circle cx="16" cy="16" r="5" fill="url(#flowerC)" />
  </svg>
);

const ChunkySun = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(255,159,67,0.25))" }}>
    <defs><radialGradient id="sunG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FFD93D" /><stop offset="100%" stopColor="#FF9F43" /></radialGradient></defs>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <rect key={deg} x="13.5" y="2" width="5" height="28" rx="2.5" fill="#FFC28A" transform={`rotate(${deg} 16 16)`} />
    ))}
    <circle cx="16" cy="16" r="10" fill="url(#sunG)" />
  </svg>
);

const ChunkyLeaf = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(225,112,85,0.25))" }}>
    <defs><linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF9F87" /><stop offset="100%" stopColor="#E17055" /></linearGradient></defs>
    <path d="M16 30 C16 30, 4 20, 4 12 C4 6, 9 2, 16 2 C23 2, 28 6, 28 12 C28 20, 16 30, 16 30 Z" fill="url(#leafG)" />
    <path d="M16 28 C16 28, 6 18, 10 10 C12 6, 16 2, 16 2" fill="rgba(255,255,255,0.28)" />
    <rect x="15" y="28" width="2" height="4" rx="1" fill="#A0856C" />
  </svg>
);

const ChunkySnowflake = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(9,132,227,0.25))" }}>
    <defs><linearGradient id="snowG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#81ECEC" /><stop offset="100%" stopColor="#0984E3" /></linearGradient></defs>
    {[0, 45, 90, 135].map((deg) => (
      <rect key={deg} x="13.5" y="2" width="5" height="28" rx="2.5" fill="url(#snowG)" transform={`rotate(${deg} 16 16)`} />
    ))}
    <circle cx="16" cy="16" r="7" fill="#FFF" />
    <circle cx="16" cy="16" r="3" fill="#0984E3" />
  </svg>
);

const ChunkyStar = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(255,51,102,0.25))" }}>
    <defs><radialGradient id="starG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FF8FAD" /><stop offset="100%" stopColor="#FF3366" /></radialGradient></defs>
    <path d="M16 2 L20 11 L30 13 L23 20 L24 30 L16 26 L8 30 L9 20 L2 13 L12 11 Z" fill="url(#starG)" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ChunkyFlag = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(76,175,80,0.25))" }}>
    <defs><linearGradient id="flagG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#81C784" /><stop offset="100%" stopColor="#388E3C" /></linearGradient></defs>
    <rect x="8" y="2" width="4" height="28" rx="2" fill="#A0856C" />
    <path d="M12 4 L30 10 L12 16 Z" fill="url(#flagG)" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ChunkyShield = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(156,39,176,0.25))" }}>
    <defs><linearGradient id="shieldG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#BA68C8" /><stop offset="100%" stopColor="#7B1FA2" /></linearGradient></defs>
    <path d="M16 2 L28 6 L28 16 C28 24, 16 30, 16 30 C16 30, 4 24, 4 16 L4 6 Z" fill="url(#shieldG)" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 8 L20 12 L16 16 L12 12 Z" fill="#FFF" opacity="0.65" />
  </svg>
);

const ChunkyFace = ({ size = 24, type = "smile" }: { size?: number; type: "smile" | "meh" | "frown" }) => {
  const bg = type === "smile" ? "url(#smileG)" : type === "meh" ? "url(#mehG)" : "url(#frownG)";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: `drop-shadow(0 4px 6px ${type === 'smile' ? 'rgba(88,204,2,0.28)' : type === 'meh' ? 'rgba(255,159,67,0.28)' : 'rgba(255,75,75,0.28)'})` }}>
      <defs>
        <radialGradient id="smileG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#81C784" /><stop offset="100%" stopColor="#58CC02" /></radialGradient>
        <radialGradient id="mehG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FFD54F" /><stop offset="100%" stopColor="#FF9F43" /></radialGradient>
        <radialGradient id="frownG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FF8F8F" /><stop offset="100%" stopColor="#FF4B4B" /></radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill={bg} stroke="#FFF" strokeWidth="2" />
      <circle cx="10" cy="12" r="2.5" fill="#FFF" />
      <circle cx="22" cy="12" r="2.5" fill="#FFF" />
      {type === "smile" && <path d="M10 20 Q16 26 22 20" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />}
      {type === "meh" && <path d="M12 22 L20 22" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />}
      {type === "frown" && <path d="M10 24 Q16 18 22 24" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
};

const ChunkySearch = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 8px rgba(168,85,247,0.3))" }}>
    <defs><linearGradient id="searchG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#DDD6FE" /><stop offset="100%" stopColor="#A78BFA" /></linearGradient></defs>
    <circle cx="13" cy="13" r="9" stroke="url(#searchG)" strokeWidth="4" />
    <path d="M20 20 L28 28" stroke="url(#searchG)" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const ChunkyCycle = ({ size = 24, color = "#FF4B4B" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: `drop-shadow(0 4px 8px ${color}30)` }}>
    <path d="M26 16 C26 21.5 21.5 26 16 26 C10.5 26 6 21.5 6 16 C6 10.5 10.5 6 16 6" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M22 10 L26 16 L30 12" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChunkyZap = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 8px rgba(255,150,0,0.3))" }}>
    <defs><linearGradient id="zapG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFD93D" /><stop offset="100%" stopColor="#FF9600" /></linearGradient></defs>
    <path d="M18 2 L6 18 H14 L12 30 L24 14 H16 L18 2 Z" fill="url(#zapG)" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const IndicatorDot = ({ color }: { color: string }) => (
  <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, boxShadow: `0 0 12px ${color}`, border: "2.5px solid white" }} />
);

const getDecorIcon = (key: string, size: number) => {
  if (key === "spring") return <ChunkyFlower size={size} />;
  if (key === "summer") return <ChunkySun size={size} />;
  if (key === "autumn") return <ChunkyLeaf size={size} />;
  return <ChunkySnowflake size={size} />;
};

// ── FLOATING PARTICLES EFFECT ──
function FloatingParticles() {
  const [particles] = useState(
    Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 8 + Math.random() * 4,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.4,
    }))
  );

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          initial={{ y: "120%", x: `${p.x}%`, opacity: 0, scale: 0 }}
          animate={{ y: "-20%", x: `${p.x + (Math.random() * 10 - 5)}%`, opacity: [0, p.opacity, 0], scale: [0, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
            borderRadius: "50%",
            boxShadow: `0 0 ${p.size * 1.5}px rgba(255,255,255,0.6)`,
          }}
        />
      ))}
    </div>
  );
}

// ── SEASONAL ATMOSPHERE ──
function SeasonalAtmosphere({ seasonKey }: { seasonKey: string }) {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 15 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
        size: Math.random() * 10 + 6,
      }))
    );
  }, [seasonKey]);

  const isSpring = seasonKey === "spring";
  const isSummer = seasonKey === "summer";
  const isAutumn = seasonKey === "autumn";
  const isWinter = seasonKey === "winter";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p, i) => (
        <motion.div
          key={`${seasonKey}-${i}`}
          initial={{ y: isSummer ? "120vh" : "-20vh", x: `${p.x}vw`, opacity: 0, rotate: 0 }}
          animate={{ y: isSummer ? "-20vh" : "120vh", x: `${p.x + (Math.random() * 20 - 10)}vw`, opacity: [0, 0.72, 0], rotate: isSummer ? 0 : 360 }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: p.size,
            height: isSummer ? p.size : p.size * (isAutumn ? 1.5 : 1.2),
            borderRadius: isSummer || isWinter ? "50%" : "40% 0 40% 0",
            background: isSpring ? "#FFB3C6" : isSummer ? "#FFD93D" : isAutumn ? "#E17055" : "#FFF",
            boxShadow: isSummer || isWinter ? `0 0 12px ${isWinter ? "#FFF" : "#FFD93D"}` : "none",
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

interface DashboardOrtuProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
}

interface DyslexiaAssessmentData {
  isDyslexic: boolean;
  overallProbability: number;
  reversalCount: number;
  mismatchCount: number;
  totalAnalyzed: number;
  riskLevel: "rendah" | "sedang" | "tinggi";
  summary: string;
  indicators: string[];
  perLetterResults: Array<{
    targetChar: string;
    recognizedChar: string | null;
    isReversal: boolean;
    isMismatch: boolean;
    probability: number;
    confidence: number | null;
  }>;
}

interface GameResult {
  id: string;
  level_id: number;
  stars: number;
  total_salah: number;
  rata_waktu: number;
  detail_error: Array<{ letter: string; wrongAnswer?: string; timeMs: number }>;
  dyslexia_assessment?: DyslexiaAssessmentData | null;
  final_ai_assessment?: FinalAiAssessment | null;
  created_at: string;
}

// ── SEASON SYSTEM ──
const SEASONS = [
  {
    key: "spring",
    label: "Musim Semi",
    levelRange: [1, 8] as [number, number],
    primary: "#FF6B9D",
    secondary: "#FFE0EE",
    bg: "#FFF0F5",
    accent: "#FF9FCC",
    gradientFrom: "#FF6B9D",
    gradientTo: "#FF8E53",
    icon: <ChunkyFlower size={20} />,
  },
  {
    key: "summer",
    label: "Musim Panas",
    levelRange: [9, 16] as [number, number],
    primary: "#FF9F43",
    secondary: "#FFE8D6",
    bg: "#FFF5EC",
    accent: "#FFC28A",
    gradientFrom: "#FF9F43",
    gradientTo: "#FDCB6E",
    icon: <ChunkySun size={20} />,
  },
  {
    key: "autumn",
    label: "Musim Gugur",
    levelRange: [17, 24] as [number, number],
    primary: "#E17055",
    secondary: "#FFE0D8",
    bg: "#FFF1EE",
    accent: "#FF9F87",
    gradientFrom: "#E17055",
    gradientTo: "#A29BFE",
    icon: <ChunkyLeaf size={20} />,
  },
  {
    key: "winter",
    label: "Musim Dingin",
    levelRange: [25, 32] as [number, number],
    primary: "#A29BFE",
    secondary: "#E8E6FF",
    bg: "#F5F3FF",
    accent: "#B8B5FF",
    gradientFrom: "#A29BFE",
    gradientTo: "#00CEC9",
    icon: <ChunkySnowflake size={20} />,
  },
] as const;

const getSeasonByLevel = (level: number) => SEASONS.find((s) => level >= s.levelRange[0] && level <= s.levelRange[1]) ?? SEASONS[0];
const getSeasonIndex = (key: string) => SEASONS.findIndex((s) => s.key === key);
const MIN_LEVELS_FOR_AI_ANALYSIS = 8;

function SectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ marginBottom: 20, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <h2 style={{ 
          fontFamily: "'Fredoka', sans-serif", 
          fontSize: 22, 
          fontWeight: 800,
          color: "#3A4561", 
          margin: 0, 
          lineHeight: 1.1,
          letterSpacing: "-0.01em"
        }}>
          {label}
        </h2>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={16} color={color} fill={color} opacity={0.6} />
        </motion.div>
      </div>
      <div style={{ position: "relative", height: 8, display: "flex", alignItems: "center" }}>
        {/* Soft underlying glow */}
        <div style={{ 
          position: "absolute", 
          left: 0, 
          width: 80, 
          height: 12, 
          background: color, 
          filter: "blur(8px)", 
          opacity: 0.25,
          borderRadius: 999
        }} />
        
        {/* Main decorative bar */}
        <div style={{ 
          position: "relative",
          width: 64, 
          height: 6, 
          borderRadius: 999, 
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          boxShadow: `0 2px 10px ${color}40`,
          overflow: "hidden"
        }}>
          {/* Shimmer effect inside the bar */}
          <motion.div
            animate={{ x: [-100, 200] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
          />
        </div>
        
        {/* Small glowing dot at the end */}
        <div style={{ 
          marginLeft: 4, 
          width: 6, 
          height: 6, 
          borderRadius: "50%", 
          background: color,
          boxShadow: `0 0 8px ${color}`
        }} />
      </div>
    </div>
  );
}

function GlassStatCard({ icon, value, label, color, shadow }: { icon: React.ReactNode; value: string | number; label: string; color: string; shadow: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(14px)",
        padding: "16px 10px",
        borderRadius: 24,
        boxShadow: `0 10px 24px ${shadow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        border: "1.5px solid rgba(255,255,255,0.7)",
      }}
    >
      <div style={{ filter: `drop-shadow(0 4px 8px ${shadow})` }}>{icon}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 900, color, letterSpacing: 0.6, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function PremiumHeader({
  viewSeasonKey,
  setViewSeasonKey,
  viewSeason,
  activeSeasonIdx,
  onClose,
}: {
  viewSeasonKey: string;
  setViewSeasonKey: (key: string) => void;
  viewSeason: (typeof SEASONS)[number];
  activeSeasonIdx: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 26, stiffness: 220 }}
      style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${viewSeason.gradientFrom}, ${viewSeason.gradientTo})`, flexShrink: 0 }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.75 }}>
        <svg width="100%" height="220" viewBox="0 0 390 220" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={`hGrad-${viewSeason.key}`} x1="0" y1="0" x2="100%" y2="100%">
              <stop offset="0%" stopColor={viewSeason.gradientFrom} stopOpacity="0.16" />
              <stop offset="100%" stopColor={viewSeason.gradientTo} stopOpacity="0.24" />
            </linearGradient>
          </defs>
          <path d="M0,82 Q97.5,58 195,82 T390,82 L390,220 L0,220 Z" fill={`url(#hGrad-${viewSeason.key})`} opacity="0.55" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={56 + i * 88} cy={96 + (i % 2) * 36} r={18 + i * 7} fill="rgba(255,255,255,0.09)" style={{ animation: `headerFloat ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.25}s` }} />
          ))}
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 2, padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.35)" }}
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.25)",
            border: "1.5px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={18} color="white" strokeWidth={3} />
        </motion.button>

        <div style={{ textAlign: "center", flex: 1, minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.15)", lineHeight: 1, marginBottom: 2 }}>
            Dashboard Ortu
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase" }}>
            Pantau Perkembangan
          </motion.div>
        </div>

        <div style={{ width: 38, height: 38, borderRadius: 999, background: "rgba(255, 255, 255, 0.25)", border: "1.5px solid rgba(255, 255, 255, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)", flexShrink: 0 }}>
          {viewSeason.icon}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, padding: "0 12px 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, background: "rgba(0,0,0,0.08)", borderRadius: 24, padding: 6, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          {SEASONS.map((s, idx) => {
            const unlocked = idx <= activeSeasonIdx;
            const active = s.key === viewSeasonKey;
            return (
              <motion.button
                key={s.key}
                whileTap={unlocked ? { scale: 0.92 } : {}}
                whileHover={unlocked ? { y: -2 } : {}}
                onClick={() => unlocked && setViewSeasonKey(s.key)}
                style={{
                  padding: "10px 4px",
                  borderRadius: 18,
                  border: "none",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  background: active ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  opacity: unlocked ? 1 : 0.4,
                  boxShadow: active ? `0 8px 20px ${s.primary}25` : "none",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ width: 34, height: 34, background: active ? s.bg : `${s.primary}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", transform: active ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>
                  {React.cloneElement(s.icon as React.ReactElement<{ size?: number }>, { size: 16 })}
                </div>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 11, color: active ? s.primary : "rgba(255, 255, 255, 0.75)", letterSpacing: 0.3 }}>
                  {s.label.split(" ").pop()}
                </span>
                {!unlocked && (
                   <div style={{ position: "absolute", top: 4, right: 4 }}><Lock size={8} color="rgba(255,255,255,0.5)" /></div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes headerFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </motion.div>
  );
}

export function DashboardOrtu({ isOpen, onClose, currentLevel }: DashboardOrtuProps) {
  const activeSeason = getSeasonByLevel(currentLevel);
  const [viewSeasonKey, setViewSeasonKey] = useState<string>(activeSeason.key);
  const [data, setData] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedFinalAssessment, setGeneratedFinalAssessment] = useState<FinalAiAssessment | null>(null);
  const [generatingFinalAssessment, setGeneratingFinalAssessment] = useState(false);

  useEffect(() => {
    setViewSeasonKey(getSeasonByLevel(currentLevel).key);
  }, [currentLevel]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: results, error } = await supabase.from("game_results").select("*");
      if (!error && results) setData(results as GameResult[]);
      setLoading(false);
    };
    fetchData();
  }, [isOpen]);

  const viewSeason = SEASONS.find((s) => s.key === viewSeasonKey) ?? activeSeason;
  const activeSeasonIdx = getSeasonIndex(activeSeason.key);
  const [minL, maxL] = viewSeason.levelRange;
  const seasonData = data.filter((d) => d.level_id >= minL && d.level_id <= maxL);

  const levelStarsMap: Record<number, number> = {};
  seasonData.forEach((d) => {
    levelStarsMap[d.level_id] = Math.max(levelStarsMap[d.level_id] || 0, d.stars);
  });

  const totalStars = Object.values(levelStarsMap).reduce((a, b) => a + b, 0);
  const highestLevel = seasonData.length > 0 ? Math.max(...seasonData.map((d) => d.level_id)) : 0;
  const avgTimeTotal = seasonData.length > 0 ? seasonData.reduce((a, c) => a + c.rata_waktu, 0) / seasonData.length : 0;
  const avgTimeSecs = (avgTimeTotal / 1000).toFixed(1);

  const errorCounts = { b: 0, d: 0, p: 0, q: 0 };
  const wrongAnswerMap: Record<string, Record<string, number>> = { b: {}, d: {}, p: {}, q: {} };
  data.forEach((d) => {
    d.detail_error?.forEach((err) => {
      const letter = err.letter as keyof typeof errorCounts;
      if (err.wrongAnswer && letter in errorCounts) {
        errorCounts[letter]++;
        wrongAnswerMap[letter][err.wrongAnswer] = (wrongAnswerMap[letter][err.wrongAnswer] || 0) + 1;
      }
    });
  });

  const maxError = Math.max(0, ...Object.values(errorCounts));
  const mostConfused: Record<string, string> = {};
  for (const letter of ["b", "d", "p", "q"]) {
    const entries = Object.entries(wrongAnswerMap[letter]);
    mostConfused[letter] = entries.length === 0 ? "belum ada data" : `tertukar: ${entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0]}`;
  }

  const totalError = Object.values(errorCounts).reduce((a, b) => a + b, 0);
  const globalAvgTime = data.length > 0 ? data.reduce((a, c) => a + c.rata_waktu, 0) / data.length : 0;

  const risk = totalError > 6 || globalAvgTime > 5000
    ? { status: "Konsultasi Disarankan", color: "#FF4B4B", desc: "Ada indikasi kesulitan membaca yang perlu dievaluasi lebih lanjut.", icon: <ChunkyFace size={40} type="frown" /> }
    : totalError >= 3 || (globalAvgTime >= 3000 && globalAvgTime <= 5000)
      ? { status: "Perlu Perhatian", color: "#FF9F43", desc: "Beberapa pola kesalahan terdeteksi, pantau perkembangan si kecil.", icon: <ChunkyFace size={40} type="meh" /> }
      : { status: "Risiko Rendah", color: "#58CC02", desc: "Anak menunjukkan perkembangan membaca yang baik, terus semangat!", icon: <ChunkyFace size={40} type="smile" /> };

  const timeCtx = avgTimeTotal === 0 ? null : avgTimeTotal < 3000 ? { label: "Normal", color: "#00B894" } : avgTimeTotal <= 5000 ? { label: "Sedikit lambat", color: "#FDCB6E" } : { label: "Perlu perhatian", color: "#FF7675" };

  const seasonProgress = SEASONS.map((s) => {
    const [lo, hi] = s.levelRange;
    const sData = data.filter((d) => d.level_id >= lo && d.level_id <= hi && d.stars > 0);
    const completed = new Set(sData.map((d) => d.level_id)).size;
    return { ...s, completed, total: hi - lo + 1 };
  });

  const sProgress = seasonProgress.find((s) => s.key === viewSeasonKey);
  const progressPercent = sProgress ? (sProgress.completed / sProgress.total) * 100 : 0;
  const isSeasonUnlocked = (idx: number) => idx <= activeSeasonIdx;
  const isViewingActive = viewSeasonKey === activeSeason.key;
  const p = viewSeason.primary;

  const completedUniqueLevelCount = useMemo(() => new Set(data.filter((d) => d.stars > 0).map((d) => d.level_id)).size, [data]);
  const hasMinimumLevelsForAi = completedUniqueLevelCount >= MIN_LEVELS_FOR_AI_ANALYSIS;
  const rawAiResults = useMemo(() => data.filter((d) => d.dyslexia_assessment).map((d) => d.dyslexia_assessment!), [data]);
  const latestAiAssessment = useMemo(() => {
    return [...data]
      .filter((d) => d.dyslexia_assessment)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.dyslexia_assessment ?? null;
  }, [data]);
  const latestStoredFinalAssessment = useMemo(() => {
    return [...data]
      .filter((d) => d.final_ai_assessment)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]?.final_ai_assessment ?? null;
  }, [data]);
  const finalAssessment = latestStoredFinalAssessment ?? generatedFinalAssessment;
  const aiResults = hasMinimumLevelsForAi ? rawAiResults : [];
  const hasAiData = hasMinimumLevelsForAi && (aiResults.length > 0 || !!finalAssessment);
  const levelsRemainingForAi = Math.max(0, MIN_LEVELS_FOR_AI_ANALYSIS - completedUniqueLevelCount);
  const totalReversals = aiResults.reduce((s, a) => s + a.reversalCount, 0);
  const totalMismatches = aiResults.reduce((s, a) => s + a.mismatchCount, 0);
  const totalLettersAnalyzed = aiResults.reduce((s, a) => s + a.totalAnalyzed, 0);
  const avgProbability = aiResults.length > 0 ? aiResults.reduce((s, a) => s + a.overallProbability, 0) / aiResults.length : 0;
  const allLetterResults = aiResults.flatMap((a) => a.perLetterResults);
  const aggregateAiRiskLevel =
    totalReversals >= 3 || avgProbability > 0.65
      ? "tinggi"
      : totalReversals >= 1 || avgProbability > 0.45
        ? "sedang"
        : "rendah";
  const finalAiRiskLevel = finalAssessment?.riskLevel ?? latestAiAssessment?.riskLevel ?? aggregateAiRiskLevel;

  const aiRisk = finalAiRiskLevel === "tinggi"
    ? { level: "tinggi" as const, color: "#FF4B4B", label: "Risiko Tinggi", desc: finalAssessment?.summary || latestAiAssessment?.summary || "AI mendeteksi pola pembalikan huruf yang konsisten. Sangat disarankan konsultasi dengan dokter atau profesional.", indicator: <IndicatorDot color="#FF4B4B" /> }
    : finalAiRiskLevel === "sedang"
      ? { level: "sedang" as const, color: "#FF9600", label: "Perlu Perhatian", desc: finalAssessment?.summary || latestAiAssessment?.summary || "Ada beberapa pola yang perlu dipantau. Lanjutkan latihan dan perhatikan perkembangan.", indicator: <IndicatorDot color="#FF9600" /> }
      : { level: "rendah" as const, color: "#00B894", label: "Risiko Rendah", desc: finalAssessment?.summary || latestAiAssessment?.summary || "AI tidak mendeteksi tanda-tanda signifikan disleksia. Anak menunjukkan perkembangan yang baik!", indicator: <IndicatorDot color="#00B894" /> };
  const dashboardConclusion = hasAiData
    ? {
        status: aiRisk.label,
        color: aiRisk.color,
        desc: aiRisk.desc,
        icon: aiRisk.level === "tinggi"
          ? <ChunkyFace size={40} type="frown" />
          : aiRisk.level === "sedang"
            ? <ChunkyFace size={40} type="meh" />
            : <ChunkyFace size={40} type="smile" />,
    }
    : risk;

  useEffect(() => {
    if (!isOpen || !hasMinimumLevelsForAi || rawAiResults.length === 0 || latestStoredFinalAssessment || generatedFinalAssessment || generatingFinalAssessment) return;

    let cancelled = false;
    const createFinalAssessment = async () => {
      setGeneratingFinalAssessment(true);
      const assessment = await generateFinalAssessment({
        completed_levels: completedUniqueLevelCount,
        game_results: data as unknown as Array<Record<string, unknown>>,
        dyslexia_assessments: rawAiResults as unknown as Array<Record<string, unknown>>,
      });

      if (!assessment || cancelled) {
        setGeneratingFinalAssessment(false);
        return;
      }

      setGeneratedFinalAssessment(assessment);

      const target = [...data]
        .filter((d) => d.dyslexia_assessment)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      if (target) {
        const { error } = await supabase
          .from("game_results")
          .update({ final_ai_assessment: assessment })
          .eq("id", target.id);

        if (!error) {
          setData((prev) => prev.map((item) => item.id === target.id ? { ...item, final_ai_assessment: assessment } : item));
        } else {
          console.warn("Gagal simpan final_ai_assessment:", error);
        }
      }

      if (!cancelled) setGeneratingFinalAssessment(false);
    };

    createFinalAssessment();

    return () => {
      cancelled = true;
    };
  }, [completedUniqueLevelCount, data, generatedFinalAssessment, generatingFinalAssessment, hasMinimumLevelsForAi, isOpen, latestStoredFinalAssessment, rawAiResults]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0.95 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{ position: "absolute", inset: 0, zIndex: 300, display: "flex", flexDirection: "column", fontFamily: "'Nunito', sans-serif", overflow: "hidden", borderRadius: "inherit", background: `linear-gradient(180deg, ${viewSeason.gradientFrom} 0%, ${viewSeason.bg} 45%, #EFF8FF 100%)` }}
        >
          <SeasonalAtmosphere seasonKey={viewSeasonKey} />
          <div style={{ position: "absolute", top: 76, right: -20, width: 250, height: 250, background: "radial-gradient(circle, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 118, left: 34, width: 64, height: 22, background: "white", borderRadius: 999, opacity: 0.5, filter: "blur(2px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 62, right: 60, width: 84, height: 26, background: "white", borderRadius: 999, opacity: 0.42, filter: "blur(3px)", pointerEvents: "none" }} />

          <PremiumHeader
            viewSeasonKey={viewSeasonKey}
            setViewSeasonKey={setViewSeasonKey}
            viewSeason={viewSeason}
            activeSeasonIdx={activeSeasonIdx}
            onClose={onClose}
          />

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 42px", position: "relative", zIndex: 1 }}>
            <FloatingParticles />
            {loading ? (
              <div style={{ textAlign: "center", marginTop: 72 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", marginBottom: 16 }}>
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke={p} strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" opacity="0.2" />
                    <path d="M12 2a10 10 0 0110 10" />
                  </svg>
                </motion.div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: p }}>Memuat data...</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, background: `linear-gradient(135deg, ${viewSeason.gradientFrom}DD, ${viewSeason.gradientTo}DD)`, borderRadius: 26, padding: 16, backdropFilter: "blur(12px)", boxShadow: "0 16px 30px rgba(0,0,0,0.08)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                    <GlassStatCard icon={<ChunkyStar size={34} />} value={totalStars} label="Bintang" color="#FF3366" shadow="rgba(255,51,102,0.14)" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <GlassStatCard icon={<ChunkyFlag size={34} />} value={`L${highestLevel}`} label="Tinggi" color="#4CAF50" shadow="rgba(76,175,80,0.14)" />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <GlassStatCard icon={<ChunkyShield size={34} />} value={`${Math.round(progressPercent)}%`} label="Progres" color="#9C27B0" shadow="rgba(156,39,176,0.14)" />
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{ padding: "12px 16px", background: "rgba(255,255,255,0.6)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${viewSeason.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", color: viewSeason.primary }}>
                    <Calendar size={16} />
                  </div>
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: "#5A7292", lineHeight: 1.4 }}>
                    Selesaikan musim sebelumnya untuk membuka musim baru!
                  </div>
                  <Sparkles size={14} color={viewSeason.primary} opacity={0.6} />
                </motion.div>

                <section>
                  <SectionTitle label="Perjalanan Musim" color="#3A4561" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {seasonProgress.map((s, idx) => {
                      const unlocked = isSeasonUnlocked(idx);
                      const pct = unlocked ? (s.completed / s.total) * 100 : 0;
                      const isCurrent = s.key === activeSeason.key;
                      const active = s.key === viewSeasonKey;
                      return (
                        <motion.div
                          key={s.key}
                          whileHover={unlocked ? { y: -2 } : {}}
                          whileTap={unlocked ? { scale: 0.99 } : {}}
                          onClick={() => unlocked && setViewSeasonKey(s.key)}
                          style={{
                            background: active ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.90)",
                            backdropFilter: "blur(12px)",
                            borderRadius: 24,
                            padding: 18,
                            border: `1.5px solid ${active ? `${s.primary}30` : "rgba(255,255,255,0.85)"}`,
                            boxShadow: active ? `0 12px 26px ${s.primary}16` : "0 8px 20px rgba(0,0,0,0.05)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,
                            opacity: unlocked ? 1 : 0.62,
                            position: "relative",
                            overflow: "hidden",
                            cursor: unlocked ? "pointer" : "default",
                          }}
                        >
                          <div style={{ position: "absolute", right: -14, bottom: -14, opacity: 0.08, pointerEvents: "none", transform: "rotate(-14deg)" }}>
                            {getDecorIcon(s.key, 96)}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
                            <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 14px ${s.primary}20`, border: `1px solid ${s.primary}18` }}>
                              {unlocked ? s.icon : <Lock size={18} color="#AAA" />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: unlocked ? s.primary : "#8C93A7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
                                  {isCurrent && <span style={{ background: "#FF9F43", color: "white", fontSize: 10, fontWeight: 900, padding: "3px 8px", borderRadius: 999, letterSpacing: 0.5, boxShadow: "0 2px 8px rgba(255,159,67,0.35)" }}>AKTIF</span>}
                                </div>
                                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: unlocked ? s.primary : "#8C93A7" }}>{Math.round(pct)}%</span>
                              </div>
                              <div style={{ fontSize: 12, color: "#73809B", fontWeight: 800 }}>Level {s.levelRange[0]}-{s.levelRange[1]} • {s.completed}/{s.total} selesai</div>
                            </div>
                            <ChevronRight size={18} color="#C4CAD7" />
                          </div>
                          <div style={{ position: "relative", height: 10, background: "#EEF1F7", borderRadius: 999, zIndex: 1, overflow: "hidden" }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.85, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${s.gradientFrom}, ${s.primary})`, borderRadius: 999 }} />
                            {pct === 100 && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} style={{ position: "absolute", right: -4, top: -7, width: 24, height: 24, background: s.primary, borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 8px ${s.primary}38` }}>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <SectionTitle label={`Ringkasan · ${viewSeason.label}`} color={p} />
                  {seasonData.length === 0 ? (
                    <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 24, padding: "34px 20px", textAlign: "center", border: "1.5px solid rgba(255,255,255,0.8)", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: viewSeason.primary, opacity: 0.78 }}>Belum ada data untuk musim ini</div>
                      {!isViewingActive && <div style={{ fontSize: 12, color: "#8E96A8", fontWeight: 700, marginTop: 6 }}>Selesaikan musim sebelumnya dulu!</div>}
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      <GlassStatCard icon={<ChunkyStar size={28} />} value={String(totalStars)} label="Bintang" color={p} shadow={`${viewSeason.primary}16`} />
                      <GlassStatCard icon={<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke={p} strokeWidth="1.7"><path d="M8 12V4M4 8l4-4 4 4" strokeLinecap="round" /></svg>} value={`L${highestLevel}`} label="Tertinggi" color={p} shadow={`${viewSeason.primary}16`} />
                      <GlassStatCard icon={<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke={p} strokeWidth="1.7"><path d="M3 8h10" strokeLinecap="round" /><path d="M8 3l5 5-5 5" strokeLinecap="round" /></svg>} value={`${avgTimeSecs}s`} label="Respon" color={p} shadow={`${viewSeason.primary}16`} />
                    </div>
                  )}
                </section>

                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#F3E8FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#9333EA", boxShadow: "0 4px 10px rgba(147,51,234,0.15)" }}>
                      <Sparkles size={18} fill="currentColor" />
                    </div>
                    <SectionTitle label="Analisis AI Disleksia" color="#3A4561" />
                  </div>
                  {!hasAiData ? (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: `linear-gradient(135deg, #F5F3FF, #EDE9FE)`, borderRadius: 36, padding: "56px 28px", textAlign: "center", border: "2px solid rgba(168, 85, 247, 0.12)", boxShadow: "0 20px 48px rgba(168,85,247,0.1)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, background: "radial-gradient(circle, rgba(196,124,253,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", bottom: -40, left: -60, width: 200, height: 200, background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                      <motion.div animate={{ y: [-10, 10, -10], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ marginBottom: 24, display: "inline-block", position: "relative", zIndex: 1 }}>
                        <ChunkySearch size={64} />
                      </motion.div>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, color: "#5B21B6", marginBottom: 12, fontWeight: 700, position: "relative", zIndex: 1 }}>
                        {hasMinimumLevelsForAi ? "Data AI Belum Tersedia" : "Analisis Terkunci"}
                      </div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#7C3AED", fontWeight: 700, lineHeight: 1.6, position: "relative", zIndex: 1, maxWidth: 260, margin: "0 auto" }}>
                        {hasMinimumLevelsForAi
                          ? "Selesaikan level menulis agar hasil analisis dari backend dapat tersimpan dan ditampilkan di sini."
                          : `Selesaikan ${levelsRemainingForAi} level lagi untuk membuka kesimpulan AI setelah minimal ${MIN_LEVELS_FOR_AI_ANALYSIS} level selesai.`}
                      </div>
                    </motion.div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      {/* HERO CARD */}
                      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={{ background: `linear-gradient(135deg, ${aiRisk.color}12, ${aiRisk.color}05)`, border: `2.5px solid ${aiRisk.color}24`, borderRadius: 36, padding: "42px 28px", boxShadow: `0 20px 48px ${aiRisk.color}16`, position: "relative", overflow: "hidden", minHeight: 260 }}>
                        {/* Background glow blobs */}
                        <div style={{ position: "absolute", top: -80, left: -80, width: 320, height: 320, background: `radial-gradient(circle, ${aiRisk.color}25 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: -100, right: -100, width: 360, height: 360, background: `radial-gradient(circle, ${aiRisk.color}15 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />

                        {/* Content grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center", position: "relative", zIndex: 1 }}>
                          {/* Left: AI Info */}
                          <div>
                            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ display: "inline-block", marginBottom: 14 }}>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "white", padding: "8px 16px", borderRadius: 999, border: `2px solid ${aiRisk.color}20`, boxShadow: `0 8px 16px ${aiRisk.color}12` }}>
                                {aiRisk.indicator}
                                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 700, color: aiRisk.color, letterSpacing: 0.5 }}>{aiRisk.label}</span>
                              </div>
                            </motion.div>
                            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 22, color: "#1D4F8D", marginBottom: 8, fontWeight: 800, lineHeight: 1.3 }}>AI Sedang Membantu Perkembangan</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#5A7292", lineHeight: 1.6, marginBottom: 16 }}>{aiRisk.desc}</div>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "rgba(255,255,255,0.9)", borderRadius: 999, border: `1.5px solid ${aiRisk.color}25`, cursor: "pointer", fontWeight: 700, fontSize: 12, color: "#4A6A8A" }}>
                                <Sparkles size={14} color={aiRisk.color} /> Lihat Detail
                              </motion.div>
                            </div>
                          </div>

                          {/* Right: AI Mascot */}
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <motion.div
                              animate={{ y: [-12, 12, -12] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              style={{ position: "relative" }}
                            >
                              <AIPremiumMascot size={140} />
                              {/* Floating sparkles around mascot */}
                              {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                  key={`sparkle-${i}`}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                                  transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                                  style={{
                                    position: "absolute",
                                    width: 8,
                                    height: 8,
                                    background: "#C4B5FD",
                                    borderRadius: "50%",
                                    boxShadow: "0 0 12px #DDD6FE",
                                    ...(i === 0 && { top: 20, left: 30 }),
                                    ...(i === 1 && { top: 30, right: 20 }),
                                    ...(i === 2 && { bottom: 30, left: 10 }),
                                    ...(i === 3 && { bottom: 20, right: 30 }),
                                  }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Stats Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: "rgba(255,255,255,0.96)", borderRadius: 24, padding: "20px 14px", textAlign: "center", border: "1.5px solid rgba(240,240,245,0.95)", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, color: "#1CB0F6", fontWeight: 800, marginBottom: 4 }}>{totalLettersAnalyzed}</div>
                          <div style={{ fontSize: 10, color: "#7A8397", fontWeight: 900, letterSpacing: 0.6, textTransform: "uppercase" }}>Huruf Dianalisis</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ background: totalReversals > 0 ? "#FFF0F0" : "rgba(255,255,255,0.96)", borderRadius: 24, padding: "20px 14px", textAlign: "center", border: `1.5px solid ${totalReversals > 0 ? "#FFD1D1" : "rgba(240,240,245,0.95)"}`, boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, color: totalReversals > 0 ? "#FF4B4B" : "#00B894", fontWeight: 800, marginBottom: 4 }}>{totalReversals}</div>
                          <div style={{ fontSize: 10, color: "#7A8397", fontWeight: 900, letterSpacing: 0.6, textTransform: "uppercase" }}>Pembalikan</div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: "rgba(255,255,255,0.96)", borderRadius: 24, padding: "20px 14px", textAlign: "center", border: "1.5px solid rgba(240,240,245,0.95)", boxShadow: "0 10px 24px rgba(0,0,0,0.06)" }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, color: "#FF9600", fontWeight: 800, marginBottom: 4 }}>{totalMismatches}</div>
                          <div style={{ fontSize: 10, color: "#7A8397", fontWeight: 900, letterSpacing: 0.6, textTransform: "uppercase" }}>Tidak Cocok</div>
                        </motion.div>
                      </div>

                      {/* Letter Details */}
                      {allLetterResults.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ background: "rgba(255,255,255,0.97)", borderRadius: 28, padding: "22px 20px", border: "1.5px solid rgba(240,240,245,0.95)", boxShadow: "0 10px 28px rgba(0,0,0,0.06)" }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "#1D4F8D", marginBottom: 14, fontWeight: 800 }}>Detail Pengenalan Huruf</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                            {allLetterResults.map((r, i) => {
                              const bgColor = r.isReversal ? "#FF4B4B" : r.isMismatch ? "#FF9600" : "#00B894";
                              return (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 20, background: "white", border: `2px solid ${bgColor}15`, boxShadow: `0 6px 16px ${bgColor}08` }}>
                                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: bgColor, fontWeight: 800 }}>{r.targetChar}</span>
                                  <span style={{ fontSize: 12, color: "#C4CAD7", fontWeight: 800 }}>→</span>
                                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: bgColor, fontWeight: 800 }}>{r.recognizedChar || "?"}</span>
                                  {r.isReversal && <ChunkyCycle size={16} color={bgColor} />}
                                  {r.confidence !== null && <span style={{ fontSize: 10, color: "#A0A7B5", fontWeight: 900, marginLeft: 2 }}>{Math.round(r.confidence * 100)}%</span>}
                                </motion.div>
                              );
                            })}
                          </div>
                          <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 11, color: "#7A8397", fontWeight: 800, flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#00B894" }} /> Benar</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF9600" }} /> Tidak Cocok</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF4B4B" }} /> Terbalik 🔄</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Traditional assessment */}
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ background: `${dashboardConclusion.color}10`, border: `1.5px solid ${dashboardConclusion.color}30`, borderRadius: 28, padding: "22px 20px", display: "flex", alignItems: "center", gap: 18, boxShadow: `0 10px 24px ${dashboardConclusion.color}12` }}>
                        <div style={{ flexShrink: 0, width: 60, height: 60, borderRadius: "50%", background: `${dashboardConclusion.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>{dashboardConclusion.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 15, color: dashboardConclusion.color, fontWeight: 800 }}>{hasAiData ? "Kesimpulan AI" : "Indikator Latihan"}: {dashboardConclusion.status}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#7A8397", marginTop: 4, lineHeight: 1.5 }}>{dashboardConclusion.desc}</div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </section>

                {seasonData.length > 0 && (
                  <section>
                    <SectionTitle label={`Progress Level · ${viewSeason.label}`} color={p} />
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: "rgba(255,255,255,0.98)", borderRadius: 36, padding: "36px 16px 36px", border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 16px 40px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", bottom: -60, right: -40, width: 220, height: 220, background: `radial-gradient(circle, ${viewSeason.primary}08 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
                      
                      <div style={{ position: "relative", height: 220, width: "100%" }}>
                        <svg viewBox="0 0 340 220" width="100%" height="220" style={{ display: "block", overflow: "visible" }}>
                          {/* Grid lines */}
                          {[30, 70, 110, 150].map((y, i) => (
                            <g key={`grid-${i}`}>
                              <line x1="36" y1={y} x2="315" y2={y} stroke={i === 3 ? `${viewSeason.primary}40` : `${viewSeason.primary}12`} strokeWidth={i === 3 ? "2" : "1.5"} strokeDasharray={i === 3 ? "0" : "4 4"} />
                              <text x="30" y={y + 4} fontSize="11" fill="#A4B1CD" textAnchor="end" fontFamily="'Fredoka', sans-serif" fontWeight="700">
                                {3 - i}
                              </text>
                            </g>
                          ))}
                          
                          {/* Bars */}
                          {Array.from({ length: 8 }, (_, i) => {
                            const lv = viewSeason.levelRange[0] + i;
                            const stars = levelStarsMap[lv] ?? -1;
                            const isPlayed = data.some((d) => d.level_id === lv && d.stars > 0);
                            const barH = stars > 0 ? stars * 40 : 0;
                            const x = 46 + i * 33;
                            const barW = 20;
                            const baselineY = 150;
                            return (
                              <g key={`level-${lv}`}>
                                {/* Background bar */}
                                <rect x={x} y="30" width={barW} height="120" rx="10" fill={isPlayed ? "#FFFFFF" : "#F1F4F9"} stroke={isPlayed ? `${viewSeason.primary}10` : "none"} strokeWidth="1" />
                                
                                {/* Filled bar */}
                                {barH > 0 && (
                                  <motion.rect
                                    x={x}
                                    initial={{ height: 0, y: baselineY }}
                                    animate={{ height: barH, y: baselineY - barH }}
                                    transition={{ duration: 0.8, delay: i * 0.05, type: "spring", damping: 15 }}
                                    width={barW}
                                    rx="10"
                                    fill={`url(#barGrad${viewSeason.key})`}
                                    style={{ filter: `drop-shadow(0 6px 12px ${viewSeason.primary}30)` }}
                                  />
                                )}
                                
                                {/* Indicators */}
                                {stars > 0 && Array.from({ length: stars }, (_, si) => (
                                  <motion.circle
                                    key={`star-${si}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.05 + si * 0.1 }}
                                    cx={x + barW / 2}
                                    cy={baselineY - (si + 1) * 12 + 4}
                                    r="3.5"
                                    fill="white"
                                  />
                                ))}
                                
                                {/* Label */}
                                <text x={x + barW / 2} y="175" fontSize="12" fill={isPlayed ? viewSeason.primary : "#A4B1CD"} textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="800">
                                  {lv}
                                </text>
                              </g>
                            );
                          })}
                          
                          <defs>
                            <linearGradient id={`barGrad${viewSeason.key}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={viewSeason.gradientFrom} />
                              <stop offset="100%" stopColor={viewSeason.primary} />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      
                      {/* Legend moved further down */}
                      <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontSize: 12, color: "#7A8397", fontWeight: 800 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 14, height: 14, borderRadius: 4, background: viewSeason.primary, boxShadow: `0 2px 6px ${viewSeason.primary}40` }} />
                          Bintang
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 14, height: 14, borderRadius: 4, background: "#F1F4F9", border: "1px solid #E2E8F0" }} />
                          Belum Main
                        </span>
                      </div>
                    </motion.div>
                  </section>
                )}

                <section>
                  <SectionTitle label="Analisis Huruf" color="#3A4561" />
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {(["b", "d", "p", "q"] as const).map((letter, idx) => {
                      const count = errorCounts[letter];
                      const isMax = count === maxError && count > 0;
                      const confused = mostConfused[letter];
                      const noData = confused === "belum ada data";
                      return (
                        <motion.div
                          key={letter}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + idx * 0.08 }}
                          whileHover={isMax ? { y: -6, boxShadow: `0 16px 32px ${viewSeason.primary}18` } : { y: -3 }}
                          style={{
                            background: isMax ? `linear-gradient(135deg, ${viewSeason.secondary}, ${viewSeason.bg})` : "rgba(255,255,255,0.97)",
                            border: `2px solid ${isMax ? `${viewSeason.primary}32` : "rgba(240,240,245,0.95)"}`,
                            borderRadius: 28,
                            padding: "28px 22px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow: isMax ? `0 12px 28px ${viewSeason.primary}16` : "0 8px 20px rgba(0,0,0,0.05)",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        >
                          {/* Background glow */}
                          {isMax && (
                            <div style={{
                              position: "absolute",
                              top: -60,
                              right: -60,
                              width: 240,
                              height: 240,
                              background: `radial-gradient(circle, ${viewSeason.primary}20 0%, transparent 70%)`,
                              borderRadius: "50%",
                              pointerEvents: "none",
                            }} />
                          )}

                          {/* Premium Badge */}
                          {isMax && (
                            <motion.div
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.3 + idx * 0.08, type: "spring", stiffness: 180, damping: 12 }}
                              style={{
                                position: "absolute",
                                top: 14,
                                right: 14,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "white",
                                padding: "6px 12px",
                                borderRadius: 999,
                                boxShadow: `0 6px 16px ${viewSeason.primary}25`,
                                border: `1.5px solid ${viewSeason.primary}15`,
                              }}
                            >
                              <ChunkyZap size={14} />
                              <span style={{ fontSize: 10, fontWeight: 800, color: viewSeason.primary, letterSpacing: 0.5, textTransform: "uppercase" }}>Terbanyak</span>
                            </motion.div>
                          )}

                          {/* Letter Display */}
                          <motion.div
                            animate={isMax ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                              fontFamily: "'Fredoka', sans-serif",
                              fontSize: 64,
                              color: isMax ? viewSeason.primary : "#4A5F7F",
                              lineHeight: 1,
                              fontWeight: 800,
                              position: "relative",
                              zIndex: 1,
                              marginTop: isMax ? 20 : 0,
                            }}
                          >
                            {letter}
                          </motion.div>

                          {/* Error count with animation */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 + idx * 0.08 }}
                            style={{
                              marginTop: 16,
                              fontSize: 16,
                              color: isMax ? viewSeason.primary : "#7A8397",
                              fontWeight: 900,
                              fontFamily: "'Fredoka', sans-serif",
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            {count}
                            <span style={{ fontSize: 12, marginLeft: 4, color: "#9BA4B7" }}>kesalahan</span>
                          </motion.div>

                          {/* Progress bar */}
                          <div style={{ width: "100%", height: 8, background: "#EEF1F7", borderRadius: 999, marginTop: 14, overflow: "hidden", position: "relative", zIndex: 1, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: maxError > 0 ? `${(count / maxError) * 100}%` : "0%" }}
                              transition={{ duration: 0.7, delay: 0.2 + idx * 0.08, ease: "easeOut" }}
                              style={{
                                height: "100%",
                                background: isMax
                                  ? `linear-gradient(90deg, ${viewSeason.primary}, ${viewSeason.gradientTo})`
                                  : `linear-gradient(90deg, ${viewSeason.accent}, ${viewSeason.primary}88)`,
                                borderRadius: 999,
                                boxShadow: isMax ? `0 0 12px ${viewSeason.primary}45` : "none",
                              }}
                            />
                          </div>

                          {/* Confusion type */}
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.08 }}
                            style={{
                              marginTop: 12,
                              fontSize: 11,
                              fontWeight: 800,
                              color: noData ? "#C7CCD7" : isMax ? viewSeason.primary : "#8B96AA",
                              textAlign: "center",
                              fontStyle: noData ? "italic" : "normal",
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            {confused}
                          </motion.div>

                          {/* Small mascot reaction */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.35 + idx * 0.08 }}
                            style={{ marginTop: 10, position: "relative", zIndex: 1 }}
                          >
                            {isMax ? (
                              <SmallMascotReaction type="sad" size={32} />
                            ) : count > 0 ? (
                              <SmallMascotReaction type="confused" size={32} />
                            ) : (
                              <SmallMascotReaction type="happy" size={32} />
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      marginTop: 28,
                      fontSize: 11,
                      color: "#A9B1C0",
                      textAlign: "center",
                      lineHeight: 1.6,
                      padding: "0 12px",
                      fontWeight: 700,
                    }}
                  >
                    Data ini bukan diagnosis medis. Konsultasikan dengan profesional untuk evaluasi lebih lanjut.
                  </motion.p>
                </section>
              </div>
            )}
          </div>

          {/* SMALL FLOATING ACCENT MASCOT */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", damping: 20, stiffness: 140 }}
              style={{
                position: "absolute",
                bottom: -10,
                right: 10,
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <GrinbudsMascot size={90} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
