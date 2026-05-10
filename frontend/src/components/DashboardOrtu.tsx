"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Calendar, Info, ChevronRight, Lock, Target, Sparkles } from "lucide-react";

// ── CUSTOM PREMIUM ICONS ──
const ChunkyFlower = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(255,94,142,0.3))" }}>
    <defs>
      <radialGradient id="flowerG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFB3C6" /><stop offset="100%" stopColor="#FF5E8E" /></radialGradient>
      <radialGradient id="flowerC" cx="30%" cy="30%" r="60%"><stop offset="0%" stopColor="#FFF" /><stop offset="100%" stopColor="#FFD93D" /></radialGradient>
    </defs>
    <path d="M16 6 C18 0, 24 0, 26 6 C32 8, 32 14, 26 16 C32 18, 32 24, 26 26 C24 32, 18 32, 16 26 C14 32, 8 32, 6 26 C0 24, 0 18, 6 16 C0 14, 0 8, 6 6 C8 0, 14 0, 16 6 Z" fill="url(#flowerG)" />
    <circle cx="16" cy="16" r="5" fill="url(#flowerC)" />
  </svg>
);

const ChunkySun = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(255,159,67,0.3))" }}>
    <defs><radialGradient id="sunG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FFD93D" /><stop offset="100%" stopColor="#FF9F43" /></radialGradient></defs>
    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
       <rect key={deg} x="13.5" y="2" width="5" height="28" rx="2.5" fill="#FFC28A" transform={`rotate(${deg} 16 16)`} />
    ))}
    <circle cx="16" cy="16" r="10" fill="url(#sunG)" />
  </svg>
);

const ChunkyLeaf = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(225,112,85,0.3))" }}>
    <defs><linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FF9F87" /><stop offset="100%" stopColor="#E17055" /></linearGradient></defs>
    <path d="M16 30 C16 30, 4 20, 4 12 C4 6, 9 2, 16 2 C23 2, 28 6, 28 12 C28 20, 16 30, 16 30 Z" fill="url(#leafG)" />
    <path d="M16 28 C16 28, 6 18, 10 10 C12 6, 16 2, 16 2" fill="rgba(255,255,255,0.3)" />
    <rect x="15" y="28" width="2" height="4" rx="1" fill="#A0856C" />
  </svg>
);

const ChunkySnowflake = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(9,132,227,0.3))" }}>
    <defs><linearGradient id="snowG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#81ECEC" /><stop offset="100%" stopColor="#0984E3" /></linearGradient></defs>
    {[0, 45, 90, 135].map(deg => (
      <rect key={deg} x="13.5" y="2" width="5" height="28" rx="2.5" fill="url(#snowG)" transform={`rotate(${deg} 16 16)`} />
    ))}
    <circle cx="16" cy="16" r="7" fill="#FFF" />
    <circle cx="16" cy="16" r="3" fill="#0984E3" />
  </svg>
);

const ChunkyStar = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(255,51,102,0.3))" }}>
    <defs><radialGradient id="starG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FF8FAD" /><stop offset="100%" stopColor="#FF3366" /></radialGradient></defs>
    <path d="M16 2 L20 11 L30 13 L23 20 L24 30 L16 26 L8 30 L9 20 L2 13 L12 11 Z" fill="url(#starG)" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ChunkyFlag = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(76,175,80,0.3))" }}>
    <defs><linearGradient id="flagG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#81C784" /><stop offset="100%" stopColor="#388E3C" /></linearGradient></defs>
    <rect x="8" y="2" width="4" height="28" rx="2" fill="#A0856C" />
    <path d="M12 4 L30 10 L12 16 Z" fill="url(#flagG)" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ChunkyShield = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(156,39,176,0.3))" }}>
    <defs><linearGradient id="shieldG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#BA68C8" /><stop offset="100%" stopColor="#7B1FA2" /></linearGradient></defs>
    <path d="M16 2 L28 6 L28 16 C28 24, 16 30, 16 30 C16 30, 4 24, 4 16 L4 6 Z" fill="url(#shieldG)" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 8 L20 12 L16 16 L12 12 Z" fill="#FFF" opacity="0.6" />
  </svg>
);

const ChunkyFace = ({ size = 24, type = "smile" }: { size?: number, type: "smile" | "meh" | "frown" }) => {
  const bg = type === "smile" ? "url(#smileG)" : type === "meh" ? "url(#mehG)" : "url(#frownG)";
  return (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: `drop-shadow(0 4px 6px ${type === 'smile' ? 'rgba(88,204,2,0.3)' : type === 'meh' ? 'rgba(255,159,67,0.3)' : 'rgba(255,75,75,0.3)'})` }}>
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
)};

const getDecorIcon = (key: string, size: number) => {
  if(key==="spring") return <ChunkyFlower size={size}/>;
  if(key==="summer") return <ChunkySun size={size}/>;
  if(key==="autumn") return <ChunkyLeaf size={size}/>;
  return <ChunkySnowflake size={size}/>;
};

// ── SEASONAL ATMOSPHERE ──
function SeasonalAtmosphere({ seasonKey }: { seasonKey: string }) {
  const [particles, setParticles] = useState<{x: number, y: number, delay: number, duration: number, size: number}[]>([]);
  
  useEffect(() => {
    setParticles(Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
      size: Math.random() * 10 + 6,
    })));
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
          initial={{ 
             y: isSummer ? "120vh" : "-20vh", 
             x: `${p.x}vw`, 
             opacity: 0, 
             rotate: 0 
          }}
          animate={{
            y: isSummer ? "-20vh" : "120vh",
            x: `${p.x + (Math.random() * 20 - 10)}vw`,
            opacity: [0, 0.7, 0],
            rotate: isSummer ? 0 : 360,
          }}
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

interface GameResult {
  id: string;
  level_id: number;
  stars: number;
  total_salah: number;
  rata_waktu: number;
  detail_error: Array<{ letter: string; wrongAnswer?: string; timeMs: number }>;
  created_at: string;
}

// ── SEASON SYSTEM ──
const SEASONS = [
  {
    key: "spring",
    label: "Semi",
    fullName: "Musim Semi",
    levelRange: [1, 8],
    primary: "#FF5E8E",
    bg: "#FFF0F5",
    gradientFrom: "#FFA0BC",
    gradientTo: "#FFD3B6",
    icon: <ChunkyFlower size={32} />,
  },
  {
    key: "summer",
    label: "Panas",
    fullName: "Musim Panas",
    levelRange: [9, 16],
    primary: "#FF9F43",
    bg: "#FFF5EC",
    gradientFrom: "#FFC28A",
    gradientTo: "#FDCB6E",
    icon: <ChunkySun size={32} />,
  },
  {
    key: "autumn",
    label: "Gugur",
    fullName: "Musim Gugur",
    levelRange: [17, 24],
    primary: "#E17055",
    bg: "#FFF1EE",
    gradientFrom: "#FF9F87",
    gradientTo: "#E17055",
    icon: <ChunkyLeaf size={32} />,
  },
  {
    key: "winter",
    label: "Dingin",
    fullName: "Musim Dingin",
    levelRange: [25, 32],
    primary: "#0984E3",
    bg: "#F0F8FF",
    gradientFrom: "#74B9FF",
    gradientTo: "#81ECEC",
    icon: <ChunkySnowflake size={32} />,
  },
];

const getSeasonByLevel = (level: number) => SEASONS.find(s => level >= s.levelRange[0] && level <= s.levelRange[1]) ?? SEASONS[0];
const getSeasonIndex = (key: string) => SEASONS.findIndex(s => s.key === key);

function StatCard({ icon, value, label, color, shadow }: { icon: React.ReactNode; value: string | number; label: string; color: string; shadow: string }) {
  return (
    <div style={{ flex: 1, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", padding: "16px 8px", borderRadius: 24, boxShadow: `0 8px 24px ${shadow}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: "2px solid rgba(255,255,255,0.6)" }}>
      <div style={{ filter: `drop-shadow(0 4px 8px ${shadow})`, marginBottom: 2 }}>{icon}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 900, color, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

export function DashboardOrtu({ isOpen, onClose, currentLevel }: DashboardOrtuProps) {
  const activeSeason = getSeasonByLevel(currentLevel);
  const [viewSeasonKey, setViewSeasonKey] = useState(activeSeason.key);
  const [data, setData] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setViewSeasonKey(getSeasonByLevel(currentLevel).key);
  }, [currentLevel]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: results, error } = await supabase.from("game_results").select("*");
      if (!error && results) setData(results);
      setLoading(false);
    };
    fetchData();
  }, [isOpen]);

  const viewSeason = SEASONS.find(s => s.key === viewSeasonKey) ?? activeSeason;
  const activeSeasonIdx = getSeasonIndex(activeSeason.key);

  const [minL, maxL] = viewSeason.levelRange;
  const seasonData = data.filter(d => d.level_id >= minL && d.level_id <= maxL);

  const levelStarsMap: Record<number, number> = {};
  seasonData.forEach(d => {
    levelStarsMap[d.level_id] = Math.max(levelStarsMap[d.level_id] || 0, d.stars);
  });

  const totalStars = Object.values(levelStarsMap).reduce((a, b) => a + b, 0);
  const highestLevel = seasonData.length > 0 ? Math.max(...seasonData.map(d => d.level_id)) : 0;
  const avgTimeTotal = seasonData.length > 0 ? seasonData.reduce((a, c) => a + c.rata_waktu, 0) / seasonData.length : 0;
  const avgTimeSecs = (avgTimeTotal / 1000).toFixed(1);

  const errorCounts = { b: 0, d: 0, p: 0, q: 0 };
  const wrongAnswerMap: Record<string, Record<string, number>> = { b: {}, d: {}, p: {}, q: {} };
  data.forEach(d => {
    d.detail_error?.forEach(err => {
      const letter = err.letter as keyof typeof errorCounts;
      if (err.wrongAnswer && letter in errorCounts) {
        errorCounts[letter]++;
        wrongAnswerMap[letter][err.wrongAnswer] = (wrongAnswerMap[letter][err.wrongAnswer] || 0) + 1;
      }
    });
  });

  const totalError = Object.values(errorCounts).reduce((a, b) => a + b, 0);
  const globalAvgTime = data.length > 0 ? data.reduce((a, c) => a + c.rata_waktu, 0) / data.length : 0;

  const risk = totalError > 6 || globalAvgTime > 5000
    ? { status: "Konsultasi Disarankan", color: "#FF4B4B", bg: "#FFE8E8", desc: "Ada indikasi kesulitan membaca yang perlu dievaluasi lebih lanjut.", icon: <ChunkyFace size={40} type="frown" /> }
    : totalError >= 3 || (globalAvgTime >= 3000 && globalAvgTime <= 5000)
    ? { status: "Perlu Perhatian", color: "#FF9F43", bg: "#FFF5EC", desc: "Beberapa pola kesalahan terdeteksi, pantau perkembangan si kecil.", icon: <ChunkyFace size={40} type="meh" /> }
    : { status: "Risiko Rendah", color: "#58CC02", bg: "#E5F7E0", desc: "Anak menunjukkan perkembangan membaca yang baik, terus semangat!", icon: <ChunkyFace size={40} type="smile" /> };

  const seasonProgress = SEASONS.map(s => {
    const [lo, hi] = s.levelRange;
    const sData = data.filter(d => d.level_id >= lo && d.level_id <= hi);
    const completed = new Set(sData.map(d => d.level_id)).size;
    return { ...s, completed, total: hi - lo + 1 };
  });

  const sProgress = seasonProgress.find(s => s.key === viewSeasonKey);
  const progressPercent = sProgress ? (sProgress.completed / sProgress.total) * 100 : 0;
  
  const isSeasonUnlocked = (idx: number) => idx <= activeSeasonIdx;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{ position: "absolute", inset: 0, zIndex: 300, display: "flex", flexDirection: "column", fontFamily: "'Nunito', sans-serif", overflow: "hidden", borderRadius: "inherit" }}
        >
          {/* Background Atmosphere */}
          <div style={{ position: "absolute", inset: 0, zIndex: -1, background: `linear-gradient(180deg, ${viewSeason.gradientFrom} 0%, ${viewSeason.bg} 50%, #E8F5E9 100%)`, transition: "background 0.8s ease" }}>
             <SeasonalAtmosphere seasonKey={viewSeasonKey} />
             <div style={{ position: "absolute", top: 80, right: -20, width: 250, height: 250, background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)" }} />
             <div style={{ position: "absolute", top: 120, left: 40, width: 60, height: 20, background: "white", borderRadius: 20, opacity: 0.6, filter: "blur(2px)" }} />
             <div style={{ position: "absolute", top: 60, right: 60, width: 80, height: 25, background: "white", borderRadius: 20, opacity: 0.5, filter: "blur(3px)" }} />
             
             {/* Bottom Hills dynamically tinted */}
             <div style={{ position: "absolute", bottom: 0, left: -40, right: -40, height: 160, transition: "background 0.8s ease" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: viewSeasonKey === "winter" ? "#E0F7FA" : viewSeasonKey === "autumn" ? "#FFCC80" : "#a8e6b1", borderRadius: "50% 50% 0 0", transition: "background 0.8s ease" }} />
                <div style={{ position: "absolute", bottom: -20, left: -20, width: "70%", height: 120, background: viewSeasonKey === "winter" ? "#B2EBF2" : viewSeasonKey === "autumn" ? "#FFB74D" : "#88d895", borderRadius: "50%", transition: "background 0.8s ease" }} />
                <div style={{ position: "absolute", bottom: -10, right: -20, width: "60%", height: 130, background: viewSeasonKey === "winter" ? "#80DEEA" : viewSeasonKey === "autumn" ? "#FFA726" : "#70cd80", borderRadius: "50%", transition: "background 0.8s ease" }} />
             </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 120 }}>
            {/* Top Nav */}
            <div style={{ padding: "24px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={onClose} style={{ width: 44, height: 44, borderRadius: "50%", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                 <ChevronLeft color={viewSeason.primary} strokeWidth={3} />
              </motion.button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 28, fontWeight: 700, color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>Dashboard Ortu</div>
                <div style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.95)", letterSpacing: 1, textTransform: "uppercase" }}>PANTAU PERKEMBANGAN</div>
              </div>
              <div style={{ width: 44, height: 44, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                 <Target color={viewSeason.primary} strokeWidth={2.5} />
              </div>
            </div>

            {/* Season Tabs */}
            <div style={{ display: "flex", gap: 10, padding: "0 20px", position: "relative", zIndex: 10, marginTop: 12 }}>
               {SEASONS.map((s, idx) => {
                 const active = viewSeasonKey === s.key;
                 const unlocked = idx <= activeSeasonIdx;
                 return (
                   <motion.button key={s.key} whileTap={unlocked ? { scale: 0.95 } : {}} onClick={() => unlocked && setViewSeasonKey(s.key)} style={{
                     flex: 1, background: active ? "white" : "rgba(255,255,255,0.5)",
                     borderRadius: 20, padding: "12px 0 16px",
                     boxShadow: active ? `0 12px 24px ${s.primary}40` : "none",
                     borderBottom: active ? `4px solid ${s.primary}40` : "none",
                     border: active ? "2px solid white" : "2px solid rgba(255,255,255,0.5)",
                     opacity: unlocked ? 1 : 0.6, cursor: unlocked ? "pointer" : "not-allowed",
                     display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative"
                   }}>
                     <span style={{ transform: active ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>{s.icon}</span>
                     <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 900, color: active ? s.primary : "#888" }}>{s.label}</span>
                   </motion.button>
                 );
               })}
            </div>

            {/* Hint Badge */}
            <div style={{ margin: "16px 20px 24px", background: `linear-gradient(90deg, ${viewSeason.primary}DD, ${viewSeason.gradientFrom}DD)`, backdropFilter: "blur(12px)", padding: "10px 16px", borderRadius: 24, display: "flex", alignItems: "center", gap: 8, color: "white", fontSize: 12, fontWeight: 800, justifyContent: "center", boxShadow: `0 8px 16px ${viewSeason.primary}40` }}>
               <Calendar size={16} strokeWidth={2.5} /> Selesaikan musim sebelumnya untuk membuka musim baru! <Sparkles size={16} />
            </div>

            {/* 3 Stat Cards */}
            <div style={{ display: "flex", gap: 12, padding: "0 20px", marginBottom: 32 }}>
               <StatCard icon={<ChunkyStar size={36} />} value={totalStars} label="BINTANG" color="#FF3366" shadow="rgba(255,51,102,0.15)" />
               <StatCard icon={<ChunkyFlag size={36} />} value={`L${highestLevel}`} label="TINGGI" color="#4CAF50" shadow="rgba(76,175,80,0.15)" />
               <StatCard icon={<ChunkyShield size={36} />} value={`${Math.round(progressPercent)}%`} label="PROGRES" color="#9C27B0" shadow="rgba(156,39,176,0.15)" />
            </div>

            {/* Perjalanan Musim */}
            <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
               <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 20, color: "#2A3B5C", display: "flex", alignItems: "center", gap: 8 }}>
                 Perjalanan Musim {getDecorIcon(viewSeasonKey, 28)}
               </div>
               
               {seasonProgress.map((s, idx) => {
                 const unlocked = isSeasonUnlocked(idx);
                 const pct = unlocked ? (s.completed / s.total) * 100 : 0;
                 const isCurrent = s.key === activeSeason.key;
                 
                 return (
                   <motion.div key={s.key} whileHover={unlocked ? { y: -2 } : {}} style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderRadius: 24, padding: 18, border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 14, opacity: unlocked ? 1 : 0.6, position: "relative", overflow: "hidden" }}>
                     
                     {/* Subtle Card Background Decoration */}
                     <div style={{ position: "absolute", right: -15, bottom: -15, opacity: 0.1, pointerEvents: "none", transform: "rotate(-15deg)" }}>
                       {getDecorIcon(s.key, 100)}
                     </div>

                     <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
                       <div style={{ width: 48, height: 48, background: s.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: `0 4px 12px ${s.primary}30` }}>{unlocked ? s.icon : <Lock size={20} color="#aaa" />}</div>
                       <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                               <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: unlocked ? s.primary : "#888" }}>{s.fullName}</span>
                               {isCurrent && <span style={{ background: "#FF9F43", color: "white", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 12, letterSpacing: 0.5, boxShadow: "0 2px 8px rgba(255,159,67,0.4)" }}>AKTIF</span>}
                             </div>
                             <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 18, color: unlocked ? s.primary : "#888" }}>{Math.round(pct)}%</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#888", fontWeight: 800 }}>Level {s.levelRange[0]}-{s.levelRange[1]} • {s.completed}/{s.total} selesai</div>
                       </div>
                       <ChevronRight color="#ccc" />
                     </div>
                     <div style={{ position: "relative", height: 10, background: "#F0F0F5", borderRadius: 5, zIndex: 1 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${s.gradientFrom}, ${s.primary})`, borderRadius: 5 }} />
                        {pct === 100 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} style={{ position: "absolute", right: -6, top: -7, width: 24, height: 24, background: s.primary, borderRadius: "50%", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 8px ${s.primary}40` }}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                          </motion.div>
                        )}
                     </div>
                   </motion.div>
                 );
               })}
            </div>

            {/* Analytics Vertical Scroll Row */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 20px", paddingBottom: 20 }}>
               {/* Ringkasan */}
               <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "16px 20px", border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: viewSeason.primary }}>Ringkasan {viewSeason.fullName}</div>
                    <div>{viewSeason.icon}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                     <div>
                       <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, color: viewSeason.primary, lineHeight: 1 }}>{totalStars}</div>
                       <div style={{ fontSize: 10, fontWeight: 900, color: viewSeason.primary, marginTop: 4 }}>BINTANG</div>
                       <div style={{ marginTop: 6 }}><ChunkyStar size={16} /></div>
                     </div>
                     <div style={{ width: 1, background: "#f0f0f5" }} />
                     <div>
                       <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, color: viewSeason.primary, lineHeight: 1 }}>L{highestLevel}</div>
                       <div style={{ fontSize: 10, fontWeight: 900, color: viewSeason.primary, marginTop: 4 }}>TERTINGGI</div>
                       <div style={{ marginTop: 6 }}><ChunkyFlag size={16} /></div>
                     </div>
                     <div style={{ width: 1, background: "#f0f0f5" }} />
                     <div>
                       <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 24, color: viewSeason.primary, lineHeight: 1 }}>{avgTimeSecs}s</div>
                       <div style={{ fontSize: 10, fontWeight: 900, color: viewSeason.primary, marginTop: 4 }}>RESPON</div>
                       <div style={{ fontSize: 10, fontWeight: 800, color: "#58CC02", marginTop: 4 }}>Normal</div>
                     </div>
                  </div>
               </div>

               {/* Indikator Risiko */}
               <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "16px 20px", border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#2A3B5C" }}>Indikator Risiko</div>
                    <div style={{ width: 20, height: 20, background: "#F0F0F5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Info size={12} color="#aaa" /></div>
                  </div>
                  <div style={{ background: risk.bg, borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                     <div>{risk.icon}</div>
                     <div>
                       <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: risk.color }}>{risk.status}</div>
                       <div style={{ fontSize: 11, fontWeight: 700, color: "#888", marginTop: 4, lineHeight: 1.4 }}>{risk.desc}</div>
                     </div>
                  </div>
               </div>
               
               {/* Progress Chart Placeholder */}
               <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "16px 20px", border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#2A3B5C" }}>Progress Level</div>
                    <div style={{ width: 20, height: 20, background: "#F0F0F5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Info size={12} color="#aaa" /></div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#888", marginBottom: 12 }}>{viewSeason.fullName}</div>
                  
                  {/* Simplified Chart visualization */}
                  <div style={{ display: "flex", alignItems: "flex-end", height: 80, gap: 8, marginTop: 10 }}>
                     {[2, 4, 3, 7, 5, 4, 6].map((val, i) => (
                       <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                         {val === 7 && (
                            <div style={{ background: "#2A3B5C", color: "white", fontSize: 9, padding: "2px 6px", borderRadius: 8, fontWeight: 800, whiteSpace: "nowrap", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                               <ChunkyStar size={10} /> 2.4
                            </div>
                         )}
                         <motion.div initial={{ height: 0 }} animate={{ height: val * 10 }} transition={{ duration: 0.5, delay: i * 0.1 }} style={{ width: "100%", background: val === 7 ? viewSeason.primary : viewSeason.gradientFrom, borderRadius: 6 }} />
                         <div style={{ fontSize: 9, fontWeight: 800, color: "#aaa" }}>{10 + i}</div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Mascot Footer Overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", zIndex: 350, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "0 20px 20px" }}>
             <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5 }} style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", padding: "12px 16px", borderRadius: "20px 20px 4px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", marginRight: 12, marginBottom: 30, display: "flex", alignItems: "center", gap: 10 }}>
                <ChunkyStar size={24} />
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 800, color: "#2A3B5C", lineHeight: 1.3 }}>Ayo, dukung perkembangan<br/>si kecil setiap hari!</span>
             </motion.div>
             <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ width: 80, height: 80, position: "relative", flexShrink: 0 }}>
                 <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle at 30% 30%, #a8f056, #58cc02)", borderRadius: "50%", boxShadow: "0 6px 0 #46a302, 0 12px 24px rgba(88,204,2,0.3)", position: "relative" }}>
                     {/* Eyes */}
                     <div style={{ position: "absolute", top: 28, left: 20, width: 12, height: 14, background: "#2A3B5C", borderRadius: "50%" }}>
                         <div style={{ position: "absolute", top: 2, left: 2, width: 4, height: 5, background: "white", borderRadius: "50%" }} />
                     </div>
                     <div style={{ position: "absolute", top: 28, right: 20, width: 12, height: 14, background: "#2A3B5C", borderRadius: "50%" }}>
                         <div style={{ position: "absolute", top: 2, left: 2, width: 4, height: 5, background: "white", borderRadius: "50%" }} />
                     </div>
                     {/* Mouth */}
                     <div style={{ position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)", width: 16, height: 10, background: "#2A3B5C", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                         <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 10, height: 6, background: "#FF6B9D", borderRadius: "50%" }} />
                     </div>
                     {/* Blush */}
                     <div style={{ position: "absolute", top: 40, left: 10, width: 12, height: 8, background: "#FF8FAD", borderRadius: "50%", opacity: 0.6 }} />
                     <div style={{ position: "absolute", top: 40, right: 10, width: 12, height: 8, background: "#FF8FAD", borderRadius: "50%", opacity: 0.6 }} />
                     {/* Sprout */}
                     <div style={{ position: "absolute", top: -14, left: 38, width: 12, height: 20, background: "#46A302", borderRadius: "12px 0 12px 0" }} />
                     <div style={{ position: "absolute", top: -8, left: 28, width: 12, height: 14, background: "#58CC02", borderRadius: "0 12px 0 12px" }} />
                 </div>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}