"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface DashboardOrtuProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
}

// ── SEASON SYSTEM ──
const SEASONS = [
  {
    key: "spring",
    label: "Musim Semi",
    levelRange: [1, 8],
    primary: "#FF6B9D",
    secondary: "#FFE0EE",
    bg: "#FFF0F5",
    accent: "#FF9FCC",
    gradientFrom: "#FF6B9D",
    gradientTo: "#FF8E53",
    icon: (
      <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
        <circle cx="16" cy="16" r="6" fill="#FF6B9D"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <ellipse key={i} cx={16 + Math.cos(deg*Math.PI/180)*11} cy={16 + Math.sin(deg*Math.PI/180)*11} rx="3.5" ry="5.5" fill="#FFB3D1" opacity="0.85" transform={`rotate(${deg}, ${16 + Math.cos(deg*Math.PI/180)*11}, ${16 + Math.sin(deg*Math.PI/180)*11})`}/>
        ))}
        <circle cx="16" cy="16" r="4" fill="#FEDB03"/>
      </svg>
    ),
  },
  {
    key: "summer",
    label: "Musim Panas",
    levelRange: [9, 16],
    primary: "#FF9F43",
    secondary: "#FFE8D6",
    bg: "#FFF5EC",
    accent: "#FFC28A",
    gradientFrom: "#FF9F43",
    gradientTo: "#FDCB6E",
    icon: (
      <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
        <circle cx="16" cy="16" r="7" fill="#FDCB6E"/>
        {[0,45,90,135,180,225,270,315].map((deg,i)=>(
          <line key={i} x1={16+Math.cos(deg*Math.PI/180)*9} y1={16+Math.sin(deg*Math.PI/180)*9} x2={16+Math.cos(deg*Math.PI/180)*13} y2={16+Math.sin(deg*Math.PI/180)*13} stroke="#FF9F43" strokeWidth="2.5" strokeLinecap="round"/>
        ))}
      </svg>
    ),
  },
  {
    key: "autumn",
    label: "Musim Gugur",
    levelRange: [17, 24],
    primary: "#E17055",
    secondary: "#FFE0D8",
    bg: "#FFF1EE",
    accent: "#FF9F87",
    gradientFrom: "#E17055",
    gradientTo: "#A29BFE",
    icon: (
      <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
        <path d="M16 28 C16 28 6 20 6 13 C6 8 10 5 16 5 C22 5 26 8 26 13 C26 20 16 28 16 28Z" fill="#E17055" opacity="0.9"/>
        <path d="M16 28 C16 28 8 22 9 14 C10 10 13 7 16 5" fill="#FDCB6E" opacity="0.6"/>
        <line x1="16" y1="28" x2="16" y2="32" stroke="#A0856C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "winter",
    label: "Musim Dingin",
    levelRange: [25, 32],
    primary: "#A29BFE",
    secondary: "#E8E6FF",
    bg: "#F5F3FF",
    accent: "#B8B5FF",
    gradientFrom: "#A29BFE",
    gradientTo: "#00CEC9",
    icon: (
      <svg viewBox="0 0 32 32" width="20" height="20" fill="none">
        <line x1="16" y1="3" x2="16" y2="29" stroke="#A29BFE" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="3" y1="16" x2="29" y2="16" stroke="#A29BFE" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="7" y1="7" x2="25" y2="25" stroke="#A29BFE" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="25" y1="7" x2="7" y2="25" stroke="#A29BFE" strokeWidth="2.5" strokeLinecap="round"/>
        {[0,45,90,135,180,225,270,315].map((deg,i)=>(
          <circle key={i} cx={16+Math.cos(deg*Math.PI/180)*10} cy={16+Math.sin(deg*Math.PI/180)*10} r="1.5" fill="#00CEC9" opacity="0.8"/>
        ))}
        <circle cx="16" cy="16" r="3" fill="white" stroke="#A29BFE" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const getSeasonByLevel = (level: number) =>
  SEASONS.find(s => level >= s.levelRange[0] && level <= s.levelRange[1]) ?? SEASONS[0];

const getSeasonIndex = (key: string) => SEASONS.findIndex(s => s.key === key);

interface GameResult {
  id: string;
  level_id: number;
  stars: number;
  total_salah: number;
  rata_waktu: number;
  detail_error: Array<{ letter: string; wrongAnswer?: string; timeMs: number }>;
  created_at: string;
}

function SectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color, margin: "0 0 16px 0" }}>
      {label}
    </h2>
  );
}

function StatCard({ value, label, bg, primary, accent, children }: { value: string; label: string; bg: string; primary: string; accent: string; children?: React.ReactNode }) {
  return (
    <div style={{ flex: 1, background: bg, padding: "16px 12px", borderRadius: 20, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: primary, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: accent, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
      {children}
    </div>
  );
}

// ── IMPROVED HEADER (CLEAN - TANPA STATS) ──
function ImprovedDashboardHeader({
  viewSeasonKey,
  setViewSeasonKey,
  viewSeason,
  activeSeason,
  activeSeasonIdx,
  onClose,
}: {
  viewSeasonKey: string;
  setViewSeasonKey: (key: string) => void;
  viewSeason: (typeof SEASONS)[0];
  activeSeason: (typeof SEASONS)[0];
  activeSeasonIdx: number;
  onClose: () => void;
}) {
  const isViewingActive = viewSeasonKey === activeSeason.key;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${viewSeason.gradientFrom}, ${viewSeason.gradientTo})`,
        flexShrink: 0,
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.8 }}>
        <svg width="100%" height="200" viewBox="0 0 390 200" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={`hGrad-${viewSeason.key}`} x1="0" y1="0" x2="100%" y2="100%">
              <stop offset="0%" stopColor={viewSeason.gradientFrom} stopOpacity="0.12"/>
              <stop offset="100%" stopColor={viewSeason.gradientTo} stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          <path d="M0,80 Q97.5,60 195,80 T390,80 L390,200 L0,200 Z" fill={`url(#hGrad-${viewSeason.key})`} opacity="0.5"/>
          {[0,1,2,3].map(i => (
            <circle key={i} cx={50 + i * 90} cy={100 + (i % 2) * 40} r={18 + i * 7} fill="rgba(255,255,255,0.08)" style={{ animation: `headerFloat ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}/>
          ))}
        </svg>
      </div>

      {/* ── TOP BAR ── */}
      <div style={{ position: "relative", zIndex: 10, padding: "20px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.35)" }}
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.25)",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </motion.button>

        <div style={{ textAlign: "center", flex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "white", textShadow: "0 3px 10px rgba(0,0,0,0.25)", lineHeight: 1, marginBottom: 4 }}>
            Dashboard Ortu
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase" }}>
            Pantau Perkembangan
          </motion.div>
        </div>

        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255, 255, 255, 0.25)", border: "2px solid rgba(255, 255, 255, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          {viewSeason.icon}
        </div>
      </div>

      {/* ── SEASON TABS ── */}
      <div style={{ position: "relative", zIndex: 10, padding: "12px 12px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, background: "rgba(0,0,0,0.15)", borderRadius: 20, padding: 4, backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
          {SEASONS.map((s, idx) => {
            const unlocked = idx <= activeSeasonIdx;
            const active = s.key === viewSeasonKey;
            return (
              <motion.button
                key={s.key}
                whileTap={unlocked ? { scale: 0.92 } : {}}
                onClick={() => unlocked && setViewSeasonKey(s.key)}
                style={{
                  padding: "10px 6px",
                  borderRadius: 16,
                  border: "none",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  background: active ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  opacity: unlocked ? 1 : 0.4,
                  boxShadow: active ? "0 6px 20px rgba(0,0,0,0.12)" : "none",
                  backdropFilter: "blur(8px)",
                  position: "relative",
                }}
              >
                {active && (
                  <motion.div layoutId="tab-glow" style={{ position: "absolute", inset: -1, borderRadius: 16, background: `${s.primary}18`, zIndex: -1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}/>
                )}
                <motion.div animate={active ? { scale: 1.08 } : { scale: 1 }} style={{ opacity: unlocked ? 1 : 0.5 }}>
                  {s.icon}
                </motion.div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 8, color: active ? s.primary : "rgba(255, 255, 255, 0.8)", letterSpacing: 0.3 }}>
                  {s.label.split(" ").pop()}
                </span>
                {!unlocked && (
                  <svg viewBox="0 0 10 10" width="8" height="8" fill="rgba(255,255,255,0.5)">
                    <rect x="1.5" y="4" width="7" height="5" rx="1"/>
                    <path d="M3 4V2.5a2 2 0 014 0V4" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none"/>
                  </svg>
                )}
                {idx === activeSeasonIdx && unlocked && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: "absolute", top: 1, right: 1, width: 6, height: 6, borderRadius: "50%", background: s.primary, boxShadow: `0 0 6px ${s.primary}` }}/>
                )}
              </motion.button>
            );
          })}
        </div>
        {!isViewingActive && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: 10, padding: "6px 12px", background: "rgba(0,0,0,0.12)", borderRadius: 10, fontSize: 10, color: "rgba(255, 255, 255, 0.9)", fontWeight: 700, textAlign: "center", backdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            Selesaikan musim sebelumnya
          </motion.div>
        )}
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
  const viewSeasonIdx = getSeasonIndex(viewSeasonKey);
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

  const maxError = Math.max(0, ...Object.values(errorCounts));
  const mostConfused: Record<string, string> = {};
  for (const letter of ["b", "d", "p", "q"]) {
    const entries = Object.entries(wrongAnswerMap[letter]);
    mostConfused[letter] = entries.length === 0 ? "belum ada data" : `tertukar: ${entries.reduce((a, b) => b[1] > a[1] ? b : a)[0]}`;
  }

  const totalError = Object.values(errorCounts).reduce((a, b) => a + b, 0);
  const globalAvgTime = data.length > 0 ? data.reduce((a, c) => a + c.rata_waktu, 0) / data.length : 0;

  const risk = totalError > 6 || globalAvgTime > 5000
    ? { status: "Konsultasi Disarankan", color: "#FF7675", desc: "Ada indikasi kesulitan membaca yang perlu dievaluasi lebih lanjut.", icon: <svg viewBox="0 0 40 40" width="36" height="36" fill="none"><circle cx="20" cy="20" r="17" fill="#FF7675" opacity="0.12" stroke="#FF7675" strokeWidth="1.5"/><circle cx="14" cy="16" r="2.5" fill="#FF7675"/><circle cx="26" cy="16" r="2.5" fill="#FF7675"/><path d="M13 27 Q20 22 27 27" stroke="#FF7675" strokeWidth="2.5" strokeLinecap="round"/></svg> }
    : totalError >= 3 || (globalAvgTime >= 3000 && globalAvgTime <= 5000)
    ? { status: "Perlu Perhatian", color: "#FDCB6E", desc: "Beberapa pola kesalahan terdeteksi, pantau perkembangan si kecil.", icon: <svg viewBox="0 0 40 40" width="36" height="36" fill="none"><circle cx="20" cy="20" r="17" fill="#FDCB6E" opacity="0.12" stroke="#FDCB6E" strokeWidth="1.5"/><circle cx="14" cy="16" r="2.5" fill="#FDCB6E"/><circle cx="26" cy="16" r="2.5" fill="#FDCB6E"/><path d="M14 26 Q20 26 26 26" stroke="#FDCB6E" strokeWidth="2.5" strokeLinecap="round"/></svg> }
    : { status: "Risiko Rendah", color: "#00B894", desc: "Anak menunjukkan perkembangan membaca yang baik, terus semangat!", icon: <svg viewBox="0 0 40 40" width="36" height="36" fill="none"><circle cx="20" cy="20" r="17" fill="#00B894" opacity="0.12" stroke="#00B894" strokeWidth="1.5"/><circle cx="14" cy="16" r="2.5" fill="#00B894"/><circle cx="26" cy="16" r="2.5" fill="#00B894"/><path d="M13 24 Q20 30 27 24" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round"/></svg> };

  const timeCtx = avgTimeTotal === 0 ? null : avgTimeTotal < 3000 ? { label: "Normal", color: "#00B894" } : avgTimeTotal <= 5000 ? { label: "Sedikit lambat", color: "#FDCB6E" } : { label: "Perlu perhatian", color: "#FF7675" };

  const seasonProgress = SEASONS.map(s => {
    const [lo, hi] = s.levelRange;
    const sData = data.filter(d => d.level_id >= lo && d.level_id <= hi);
    const completed = new Set(sData.map(d => d.level_id)).size;
    return { ...s, completed, total: hi - lo + 1 };
  });

  const sProgress = seasonProgress.find(s => s.key === viewSeasonKey);
  const progressPercent = sProgress ? (sProgress.completed / sProgress.total) * 100 : 0;

  const isSeasonUnlocked = (idx: number) => idx <= activeSeasonIdx;
  const isViewingActive = viewSeasonKey === activeSeason.key;
  const p = viewSeason.primary;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{ position: "absolute", inset: 0, background: "#FAFBFF", zIndex: 300, display: "flex", flexDirection: "column", fontFamily: "'Nunito', sans-serif" }}
        >
          <ImprovedDashboardHeader
            viewSeasonKey={viewSeasonKey}
            setViewSeasonKey={setViewSeasonKey}
            viewSeason={viewSeason}
            activeSeason={activeSeason}
            activeSeasonIdx={activeSeasonIdx}
            onClose={onClose}
          />

          {/* ── CONTENT ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 40px" }}>
            {loading ? (
              <div style={{ textAlign: "center", marginTop: 60 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", marginBottom: 16 }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke={p} strokeWidth="2.5"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 2a10 10 0 0110 10"/></svg>
                </motion.div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: p }}>Memuat data...</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* ── QUICK STATS CARDS (BAWAH HEADER) ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, background: `linear-gradient(135deg, ${viewSeason.gradientFrom}BB, ${viewSeason.gradientTo}BB)`, borderRadius: 24, padding: 16, backdropFilter: "blur(10px)" }}>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#FFD93D", lineHeight: 1, marginBottom: 6 }}>
                      {totalStars}
                    </div>
                    <div style={{ fontSize: 11, color: "white", fontWeight: 900, letterSpacing: 0.5, textTransform: "uppercase" }}>Bintang</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#72C245", lineHeight: 1, marginBottom: 6 }}>
                      L{highestLevel}
                    </div>
                    <div style={{ fontSize: 11, color: "white", fontWeight: 900, letterSpacing: 0.5, textTransform: "uppercase" }}>Tinggi</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#FF6B9D", lineHeight: 1, marginBottom: 6 }}>
                      {Math.round(progressPercent)}%
                    </div>
                    <div style={{ fontSize: 11, color: "white", fontWeight: 900, letterSpacing: 0.5, textTransform: "uppercase" }}>Progres</div>
                  </motion.div>
                </div>

                {/* ── OVERVIEW SEMUA MUSIM ── */}
                <section>
                  <SectionTitle label="Perjalanan Musim" color="#555" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {seasonProgress.map((s, idx) => {
                      const unlocked = isSeasonUnlocked(idx);
                      const pct = unlocked ? (s.completed / s.total) * 100 : 0;
                      const isCurrent = s.key === activeSeason.key;
                      return (
                        <motion.div
                          key={s.key}
                          whileTap={unlocked ? { scale: 0.98 } : {}}
                          onClick={() => unlocked && setViewSeasonKey(s.key)}
                          style={{
                            background: s.key === viewSeasonKey ? s.bg : "white",
                            border: `2px solid ${s.key === viewSeasonKey ? s.primary + "60" : "#f0f0f5"}`,
                            borderRadius: 16, padding: "14px 16px", cursor: unlocked ? "pointer" : "default",
                            opacity: unlocked ? 1 : 0.45,
                            boxShadow: s.key === viewSeasonKey ? `0 4px 16px ${s.primary}20` : "0 2px 8px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${s.primary}30` }}>
                              {s.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 15, color: unlocked ? s.primary : "#bbb" }}>{s.label}</span>
                                {isCurrent && (<span style={{ fontSize: 9, fontWeight: 900, color: "white", background: s.primary, padding: "2px 7px", borderRadius: 8, letterSpacing: 0.5 }}>AKTIF</span>)}
                                {!unlocked && (<svg viewBox="0 0 12 12" width="12" height="12" fill="#ccc"><rect x="2" y="5" width="8" height="6" rx="1.5"/><path d="M4 5V4a2 2 0 014 0v1" stroke="#ccc" strokeWidth="1.2" fill="none"/></svg>)}
                              </div>
                              <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>Level {s.levelRange[0]}–{s.levelRange[1]} · {s.completed}/{s.total} selesai</div>
                            </div>
                            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: unlocked ? s.primary : "#ddd" }}>{Math.round(pct)}%</div>
                          </div>
                          <div style={{ height: 6, background: "#f0f0f5", borderRadius: 4, overflow: "hidden" }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${s.gradientFrom}, ${s.gradientTo})`, borderRadius: 4 }}/>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                {/* ── RINGKASAN MUSIM DIPILIH ── */}
                <section>
                  <SectionTitle label={`Ringkasan · ${viewSeason.label}`} color={p} />
                  {seasonData.length === 0 ? (
                    <div style={{ background: viewSeason.bg, borderRadius: 20, padding: "32px 20px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: viewSeason.primary, opacity: 0.7 }}>Belum ada data untuk musim ini</div>
                      {!isViewingActive && (<div style={{ fontSize: 12, color: "#aaa", fontWeight: 700, marginTop: 6 }}>Selesaikan musim sebelumnya dulu!</div>)}
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 10 }}>
                      <StatCard value={String(totalStars)} label="Bintang" bg={viewSeason.bg} primary={p} accent={viewSeason.accent}>
                        <svg viewBox="0 0 16 16" width="16" height="16" fill={p} style={{ marginTop: 4 }}>
                          <path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6Z"/>
                        </svg>
                      </StatCard>
                      <StatCard value={`L${highestLevel}`} label="Tertinggi" bg={viewSeason.bg} primary={p} accent={viewSeason.accent}>
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke={p} strokeWidth="1.5" style={{ marginTop: 4 }}>
                          <path d="M8 12V4M4 8l4-4 4 4" strokeLinecap="round"/>
                        </svg>
                      </StatCard>
                      <StatCard value={`${avgTimeSecs}s`} label="Respon" bg={viewSeason.bg} primary={p} accent={viewSeason.accent}>
                        {timeCtx && (<div style={{ fontSize: 9, fontWeight: 800, color: timeCtx.color, marginTop: 2 }}>{timeCtx.label}</div>)}
                      </StatCard>
                    </div>
                  )}
                </section>

                {/* ── INDIKATOR RISIKO ── */}
                <section>
                  <SectionTitle label="Indikator Risiko" color="#555" />
                  <div style={{ background: `${risk.color}0E`, border: `1.5px solid ${risk.color}35`, borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: `0 4px 20px ${risk.color}18` }}>
                    <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: `${risk.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {risk.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 17, color: risk.color }}>{risk.status}</div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: "#888", marginTop: 4, lineHeight: 1.5 }}>{risk.desc}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {["#00B894","#FDCB6E","#FF7675"].map((c, i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: risk.color === c ? c : "#e8e8e8" }}/>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ── PROGRESS CHART ── */}
                {seasonData.length > 0 && (
                  <section>
                    <SectionTitle label={`Progress Level · ${viewSeason.label}`} color={p} />
                    <div style={{ background: "white", borderRadius: 20, padding: "20px 16px 16px", border: "1.5px solid #f0f0f5", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                      <svg viewBox="0 0 320 150" width="100%" height="150" style={{ display: "block" }}>
                        {[20,55,90,125].map((y,i)=>(<g key={i}><line x1="28" y1={y} x2="308" y2={y} stroke="#f0f0f5" strokeWidth="1"/><text x="22" y={y+4} fontSize="9" fill="#ccc" textAnchor="end" fontFamily="'Nunito', sans-serif" fontWeight="800">{3-i}</text></g>))}
                        <line x1="28" y1="125" x2="308" y2="125" stroke="#e8e8e8" strokeWidth="1"/>
                        {Array.from({ length: 8 }, (_, i) => {
                          const lv = viewSeason.levelRange[0] + i;
                          const stars = levelStarsMap[lv] ?? -1;
                          const isPlayed = data.some(d => d.level_id === lv);
                          const barH = stars > 0 ? stars * 35 : 0;
                          const x = 38 + i * 34;
                          return (
                            <g key={lv}>
                              <rect x={x} y="20" width="18" height="105" rx="5" fill={isPlayed ? viewSeason.bg : "#f8f8f8"}/>
                              {barH > 0 && (
                                <motion.rect
                                  x={x} y={125 - barH} width="18" height={barH} rx="5"
                                  fill={`url(#barGrad${viewSeason.key})`}
                                  initial={{ height: 0, y: 125 }}
                                  animate={{ height: barH, y: 125 - barH }}
                                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                                />
                              )}
                              {stars > 0 && Array.from({ length: stars }, (_, si) => (<circle key={si} cx={x + 3 + si * 5} cy={120 - barH - 5} r="2" fill="#FFD93D"/>))}
                              <text x={x + 9} y="143" fontSize="9" fill="#aaa" textAnchor="middle" fontFamily="'Fredoka One', cursive">
                                {lv}
                              </text>
                            </g>
                          );
                        })}
                        <defs>
                          <linearGradient id={`barGrad${viewSeason.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={viewSeason.gradientFrom}/>
                            <stop offset="100%" stopColor={viewSeason.gradientTo}/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </section>
                )}

                {/* ── ANALISIS HURUF ── */}
                <section>
                  <SectionTitle label="Analisis Huruf" color="#555" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {["b", "d", "p", "q"].map((letter) => {
                      const count = errorCounts[letter as keyof typeof errorCounts];
                      const isMax = count === maxError && count > 0;
                      const confused = mostConfused[letter];
                      const noData = confused === "belum ada data";
                      return (
                        <div key={letter} style={{ background: isMax ? viewSeason.secondary : "white", border: `2px solid ${isMax ? viewSeason.primary + "60" : "#f0f0f5"}`, borderRadius: 20, padding: "20px 12px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: isMax ? `0 6px 20px ${viewSeason.primary}18` : "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                          {isMax && (<div style={{ position: "absolute", top: 8, right: 10, fontSize: 9, fontWeight: 900, color: viewSeason.primary, background: viewSeason.bg, padding: "2px 6px", borderRadius: 6 }}>TERBANYAK</div>)}
                          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 52, color: isMax ? viewSeason.primary : "#333", lineHeight: 1 }}>{letter}</div>
                          <div style={{ marginTop: 10, fontSize: 13, color: isMax ? viewSeason.primary : "#999", fontWeight: 800 }}>
                            {count} kesalahan
                          </div>
                          <div style={{ width: "100%", height: 4, background: "#f0f0f5", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: maxError > 0 ? `${(count / maxError) * 100}%` : "0%" }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              style={{ height: "100%", background: isMax ? viewSeason.primary : "#e0e0e0", borderRadius: 2 }}
                            />
                          </div>
                          <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: noData ? "#ccc" : viewSeason.accent, textAlign: "center", fontStyle: noData ? "italic" : "normal" }}>
                            {confused}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ marginTop: 24, fontSize: 10, color: "#bbb", textAlign: "center", lineHeight: 1.6, padding: "0 12px" }}>
                    Data ini bukan diagnosis medis. Konsultasikan dengan profesional untuk evaluasi lebih lanjut.
                  </p>
                </section>

              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}