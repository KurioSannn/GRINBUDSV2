"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SplashScreen } from "@/components/SplashScreen";
import { Onboarding } from "@/components/Onboarding";
import { AuthScreen } from "@/components/AuthScreen";
import { ChildSetupScreen, AVATARS } from "@/components/ChildSetupScreen";
import { TransitionScreen } from "@/components/TransitionScreen";
import MiniGame from "@/components/MiniGame";
import { DashboardOrtu } from "@/components/DashboardOrtu";
import { supabase } from "@/lib/supabase";
import { User, Trophy, BarChart, Settings, PawPrint, Flower2, Sun, Leaf, Snowflake, Rocket, Star, Lock, Sparkles, Cloud, Home, Compass, Gamepad2 } from "lucide-react";

// ── DATA GENERATOR: 32 Levels ──
const generateLevelsData = () => {
  const seasons = [
    { name: "Semi",   color: "#FF6B9D", bg: "#FFF0F5" },
    { name: "Panas",  color: "#FF9F43", bg: "#FFF5EC" },
    { name: "Gugur",  color: "#A29BFE", bg: "#F5F3FF" },
    { name: "Dingin", color: "#00CEC9", bg: "#F0FFFE" },
  ];

  return Array.from({ length: 32 }, (_, i) => {
    const id = i + 1;
    const seasonIdx = Math.floor(i / 8);
    const season = seasons[seasonIdx];
    return {
      id,
      name: `Misi ${id}`,
      color: season.color,
      bg: season.bg,
      seasonName: season.name,
      seasonIdx,
      stars: 0,
      unlocked: id === 1,
      completed: false,
    };
  });
};

const levelsData = generateLevelsData();

// ── PREMIUM ICONS ──
const SVG_ICONS = {
  star: (color: string) => <Star size={22} fill={color} color={color} />,
  lock: <Lock size={22} color="white" />,
  profile: <User size={24} color="currentColor" />,
};

// ── FLOATING DECORATIONS ──
function FloatingDecorations({ mapHeight }: { mapHeight: number }) {
  const sparkles = useMemo(() => Array.from({ length: 50 }, () => ({
    x: Math.random() * 350 + 20,
    y: Math.random() * mapHeight,
    size: Math.random() * 6 + 4,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
  })), [mapHeight]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.2, 0.8], y: [0, -20, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          style={{ 
            position: "absolute", left: s.x, top: s.y, 
            width: s.size, height: s.size, 
            borderRadius: "50%", background: "white", 
            boxShadow: "0 0 12px rgba(255,255,255,0.9)" 
          }}
        />
      ))}
    </div>
  );
}

// ── MAP CONFIG ──
const MAP_HEIGHT = 4400;
const generatePathPositions = () => {
  return Array.from({ length: 32 }, (_, i) => {
    const y = MAP_HEIGHT - (i * 125) - 150;
    let x = 195;
    if (i % 4 === 1) x = 110;
    if (i % 4 === 3) x = 280;
    return { x, y };
  });
};
const pathPositions = generatePathPositions();

// ── STARS ──
function Stars({ count, size = 11 }: { count: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3].map((s) => (
          <Star key={s} size={size} fill={s <= count ? "#FFD93D" : "#E0E0E0"} color={s <= count ? "#FFD93D" : "#E0E0E0"} />
      ))}
    </div>
  );
}

// ── LEVEL NODE ──
function LevelNode({ level, position, onClick }: {
  level: (typeof levelsData)[0];
  position: (typeof pathPositions)[0];
  onClick: () => void;
}) {
  const isCurrent   = level.unlocked && !level.completed;
  const isCompleted = level.completed;
  const isLocked    = !level.unlocked;

  const btnBg = isCompleted ? "linear-gradient(180deg, #FF9FCC 0%, #FF6B9D 100%)" : isCurrent ? "linear-gradient(180deg, #FFD93D 0%, #FF9600 100%)" : "linear-gradient(180deg, #FFFFFF 0%, #E8E8E8 100%)";
  const btnShadow = isCompleted ? "0 8px 0 #D44C7D, 0 12px 24px rgba(255,107,157,0.4)" : isCurrent ? "0 8px 0 #D97B29, 0 12px 24px rgba(255,150,0,0.4)" : "0 8px 0 #D0D0D0, 0 10px 16px rgba(0,0,0,0.08)";
  const innerShadow = isCompleted ? "inset 0 -6px 0 rgba(0,0,0,0.2), inset 0 6px 0 rgba(255,255,255,0.6)" : isCurrent ? "inset 0 -6px 0 rgba(0,0,0,0.2), inset 0 6px 0 rgba(255,255,255,0.6)" : "inset 0 -6px 0 rgba(0,0,0,0.08), inset 0 6px 0 #FFFFFF";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: isCurrent ? 20 : 10,
      }}
    >
      <motion.div
        animate={isCurrent ? { y: [0, -6, 0] } : {}}
        transition={isCurrent ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {isCurrent && (
          <>
            {/* Clean, Soft Main Glow Aura */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", width: 84, height: 84, borderRadius: "50%", background: "rgba(255,217,61,0.3)", top: -6, pointerEvents: "none", zIndex: -3, filter: "blur(4px)" }}
            />
            {/* Elegant Expanding Ripple Ring 1 */}
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              style={{ position: "absolute", width: 72, height: 72, borderRadius: "50%", border: "4px solid #FF9600", top: 0, pointerEvents: "none", zIndex: -2 }}
            />
            {/* Elegant Expanding Ripple Ring 2 */}
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
              style={{ position: "absolute", width: 72, height: 72, borderRadius: "50%", border: "4px solid rgba(255,217,61,0.9)", top: 0, pointerEvents: "none", zIndex: -2 }}
            />
            
            {/* Floating Sparkles around the node */}
            <motion.div animate={{ y: [0, -8, 0], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: -10, left: -15, zIndex: 5, pointerEvents: "none" }}>
              <Sparkles size={16} color="#FFD93D" fill="#FFD93D" />
            </motion.div>
            <motion.div animate={{ y: [0, -6, 0], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: "absolute", top: 15, right: -20, zIndex: 5, pointerEvents: "none" }}>
              <Star size={12} color="white" fill="white" />
            </motion.div>
          </>
        )}
        
        <motion.button
          whileHover={level.unlocked ? { scale: 1.05, y: -2 } : {}}
          whileTap={level.unlocked ? { scale: 0.95, y: 4 } : {}}
          onClick={onClick}
          disabled={isLocked}
          className={isLocked ? "" : "btn-press"}
          style={{
            width: 72, height: 72, borderRadius: "50%", border: "none",
            cursor: isLocked ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: btnBg,
            boxShadow: `${btnShadow}, ${innerShadow}`,
            position: "relative", zIndex: 2,
          }}
        >
          {isLocked
            ? <Lock size={24} color="#A0A0A0" fill="#A0A0A0" opacity={0.7} style={{ filter: "drop-shadow(0px 2px 0px rgba(0,0,0,0.1))" }} />
            : <Star size={26} fill="white" color="white" style={{ filter: "drop-shadow(0px 2px 0px rgba(0,0,0,0.15))" }} />
          }
        </motion.button>
        <div style={{ background: "white", borderRadius: 16, padding: "4px 16px", marginTop: -16, zIndex: 5, boxShadow: "0 6px 16px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: btnBg, lineHeight: 1 }}>
            {level.id}
          </span>
          {isCompleted && <Stars count={level.stars} size={10} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── SIDE DRAWER ──
function SideDrawer({ isOpen, onClose, onMenuClick }: { isOpen: boolean; onClose: () => void; onMenuClick?: (label: string) => void }) {
  const menuItems = [
    { label: "Profil Anak", color: "#58CC02", icon: <User size={20} /> },
    { label: "Pencapaian",  color: "#FFD93D", icon: <Trophy size={20} /> },
    { label: "Dashboard Ortu", color: "#1CB0F6", icon: <BarChart size={20} /> },
    { label: "Pengaturan", color: "#CE82FF", icon: <Settings size={20} /> },
  ];
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", zIndex: 150 }}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "78%", background: "white", zIndex: 160, borderRadius: "36px 0 0 36px", boxShadow: "-12px 0 48px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}
          >
            {/* Profile header */}
            <div style={{ padding: "56px 24px 28px", background: "linear-gradient(155deg,#f0fde4,#d7f5b1)", borderRadius: "36px 0 0 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "white", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, boxShadow: "0 8px 24px rgba(88,204,2,0.2)", position: "relative", zIndex: 2, color: "#58CC02" }}><PawPrint size={36} /></div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: "#3C3C3C", position: "relative", zIndex: 2 }}>Budi</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#777", fontWeight: 700, marginTop: 2, position: "relative", zIndex: 2 }}>Kelas 1 SD · 7 Tahun</div>
            </div>
            {/* Menu items */}
            <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {menuItems.map((item, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    if (onMenuClick) onMenuClick(item.label);
                    onClose();
                  }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: "18px", border: "none", background: "#F9F9F9", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: "16px", background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color }}>{item.icon}</div>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: "#3C3C3C" }}>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── MAIN PAGE ──
export default function HomePage() {
  const [showSplash, setShowSplash]         = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth]             = useState(false);
  const [showChildSetup, setShowChildSetup] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [userName, setUserName]             = useState("");
  const [userAvatar, setUserAvatar]         = useState("bear");
  const [activeTab, setActiveTab]           = useState("adventure");
  const [selected, setSelected]             = useState<(typeof levelsData)[0] | null>(null);
  const [mounted, setMounted]               = useState(false);
  const [isDrawerOpen, setIsDrawerOpen]     = useState(false);
  const [showDashboardOrtu, setShowDashboardOrtu] = useState(false);
  const [playingLevel, setPlayingLevel]     = useState<number | null>(null);
  const [levels, setLevels]                 = useState(levelsData);
  const [showHeader, setShowHeader]         = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setShowHeader(false); // Sembunyikan pas scroll turun
    } else if (currentScrollY < lastScrollY.current) {
      setShowHeader(true);  // Munculin pas scroll naik
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => { 
    setMounted(true); 
    // Ambil progres awal dari Supabase
    const fetchProgress = async () => {
      const { data, error } = await supabase.from("game_results").select("*");
      
      const progressMap: Record<number, number> = {};
      if (data) {
        // Cari bintang tertinggi per level
        data.forEach((row) => {
          progressMap[row.level_id] = Math.max(progressMap[row.level_id] || 0, row.stars);
        });
      }

      setLevels(prev => prev.map(lvl => {
        const stars = progressMap[lvl.id] || 0;
        const isCompleted = stars > 0;
        // Level 1 selalu buka, level lain buka kalau level sebelumnya sudah dikerjakan
        const isUnlocked = lvl.id === 1 || progressMap[lvl.id - 1] !== undefined;
        return { ...lvl, stars, completed: isCompleted, unlocked: isUnlocked };
      }));
    };
    fetchProgress();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setShowOnboarding(true);
  };

  const handleOnboardingFinish = () => {
    setShowOnboarding(false);
    setShowAuth(true);
  };

  const handleAuthFinish = () => {
    setShowAuth(false);
    setShowChildSetup(true);
  };

  const handleChildSetupFinish = (avatarId: string, name?: string) => {
    if (avatarId) setUserAvatar(avatarId);
    if (name) setUserName(name);
    setShowChildSetup(false);
    setShowTransition(true);
  };

  const handleTransitionFinish = () => {
    setShowTransition(false);
  };

  const pathData = useMemo(() => {
    if (pathPositions.length === 0) return "";
    let d = `M ${pathPositions[0].x} ${pathPositions[0].y}`;
    for (let i = 1; i < pathPositions.length; i++) {
      const p0 = pathPositions[i - 1];
      const p1 = pathPositions[i];
      // Organic curve mapping: Push control points out slightly sideways and vertically 
      // to create a soft, bouncy fluid trail instead of a stiff mechanical wave.
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      
      const cp1x = p0.x + dx * 0.15;
      const cp1y = p0.y + dy * 0.45;
      
      const cp2x = p1.x - dx * 0.15;
      const cp2y = p1.y - dy * 0.45;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, []);

  const totalStars = levels.reduce((acc, l) => acc + l.stars, 0);
  const currentLevel = levels.filter(l => l.completed).length + 1;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f0fde4 0%,#e8f7fe 50%,#f9f0ff 100%)", padding: "20px" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }

        @keyframes semiSway {
          0%, 100% { transform: rotate(-5deg); }
          50%       { transform: rotate(5deg); }
        }
        @keyframes leafFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes spinSun {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseSun {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
        @keyframes cloudDrift {
          0%, 100% { transform: translateX(0px); }
          50%       { transform: translateX(14px); }
        }
        @keyframes leafFall {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(10px) rotate(-12deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes twinkleDot {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.95; }
        }
      `}</style>

      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : showOnboarding ? (
        <AnimatePresence>
          <Onboarding onFinish={handleOnboardingFinish} />
        </AnimatePresence>
      ) : showAuth ? (
        <AnimatePresence>
          <AuthScreen onSuccess={handleAuthFinish} />
        </AnimatePresence>
      ) : showChildSetup ? (
        <AnimatePresence>
          <ChildSetupScreen onFinish={(id) => handleChildSetupFinish(id, "Pemain")} />
        </AnimatePresence>
      ) : showTransition ? (
        <AnimatePresence>
          <TransitionScreen onFinish={handleTransitionFinish} userName={userName} avatarId={userAvatar} />
        </AnimatePresence>
      ) : (
        <div style={{ width: 390, height: 844, display: "flex", flexDirection: "column", background: "white", position: "relative", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 6px white, 0 0 0 9px #e0e0f0", borderRadius: "50px" }}>

          {/* FLOATING HEADER */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "48px 20px 16px", zIndex: 100, pointerEvents: "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              
              <AnimatePresence>
                {showHeader && (
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ display: "flex", alignItems: "center", gap: 12, pointerEvents: "auto" }}
                  >
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="btn-press"
                      style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "none", color: "#58CC02", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 0 #E0E0E0, 0 10px 24px rgba(0,0,0,0.06)" }}
                    >
                      <div style={{ width: 36, height: 36 }}>
                        {AVATARS.find(a => a.id === userAvatar)?.icon || <PawPrint size={24} />}
                      </div>
                    </button>
                    <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", padding: "10px 20px", borderRadius: "24px", boxShadow: "0 4px 0 #E0E0E0, 0 10px 24px rgba(0,0,0,0.06)" }}>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: "#58CC02", lineHeight: 1 }}>GrinBuds</div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 10, color: "#888", fontWeight: 900, letterSpacing: 0.8, marginTop: 2 }}>PETA PETUALANGAN</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showHeader && (
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "10px 16px", color: "#3C3C3C", fontWeight: 900, display: "flex", alignItems: "center", gap: 8, pointerEvents: "auto", boxShadow: "0 4px 0 #E0E0E0, 0 10px 24px rgba(0,0,0,0.06)" }}
                  >
                    <Star size={20} fill="#FFD93D" color="#FFD93D" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))" }} />
                    <span style={{ fontSize: 18, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#3C3C3C" }}>{totalStars}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          <div onScroll={handleScroll} style={{ flex: 1, overflowY: "auto", position: "relative", background: "linear-gradient(180deg, #E2F9DB 0%, #A5E474 40%, #75D844 100%)" }}>
            <div style={{ position: "relative", height: MAP_HEIGHT, width: "100%" }}>

              {/* Animated Environmental Details */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                {pathPositions.map((pos, i) => (
                  <React.Fragment key={i}>
                    {i % 4 === 0 && (
                      <motion.div style={{ position: "absolute", top: pos.y + 40, left: pos.x > 195 ? 40 : 330 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                        <Flower2 size={24} color="#FF9FCC" fill="#FF9FCC" style={{ filter: "drop-shadow(0 4px 6px rgba(255,107,157,0.3))" }} />
                      </motion.div>
                    )}
                    {i % 3 === 0 && (
                      <motion.div style={{ position: "absolute", top: pos.y - 60, left: pos.x > 195 ? 320 : 50 }} animate={{ x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                        <Cloud size={40} color="white" fill="white" opacity={0.6} />
                      </motion.div>
                    )}
                    {i % 5 === 0 && (
                      <motion.div style={{ position: "absolute", top: pos.y + 10, left: pos.x > 195 ? 330 : 60 }} animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                        <Sparkles size={20} color="#FFD93D" fill="#FFD93D" />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <svg style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0px 8px 12px rgba(0,0,0,0.12))" }} viewBox={`0 0 390 ${MAP_HEIGHT}`}>
                <path d={pathData} fill="none" stroke="#C5A47E" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
                <path d={pathData} fill="none" stroke="#D1B27A" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
                <path d={pathData} fill="none" stroke="#E6CD9A" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
                <path d={pathData} fill="none" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="0, 26" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              </svg>

              <FloatingDecorations mapHeight={MAP_HEIGHT} />

              {mounted && pathPositions.map((pos, i) => (
                <LevelNode
                  key={levels[i].id}
                  level={levels[i]}
                  position={pos}
                  onClick={() => levels[i].unlocked && setSelected(levels[i])}
                />
              ))}
            </div>
          </div>

          {/* MODAL */}
          <AnimatePresence>
            {selected && (
              <div
                onClick={() => setSelected(null)}
                style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "flex-end" }}
              >
                <motion.div
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 220 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: "100%", background: "white", borderRadius: "36px 36px 0 0", padding: "36px 24px 40px", textAlign: "center", position: "relative" }}
                >
                  <div style={{ width: 48, height: 6, borderRadius: 3, background: "#E5E5E5", margin: "0 auto 32px" }} />
                  <div style={{ width: 96, height: 96, borderRadius: 32, background: selected.bg, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", color: selected.color, boxShadow: `0 8px 0 ${selected.color}44, inset 0 2px 0 rgba(255,255,255,0.8)` }}>
                    {selected.seasonName === "Semi" ? <Flower2 size={48} /> : selected.seasonName === "Panas" ? <Sun size={48} /> : selected.seasonName === "Gugur" ? <Leaf size={48} /> : <Snowflake size={48} />}
                  </div>
                  <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 32, color: "#3C3C3C", marginBottom: 8 }}>Level {selected.id}</h2>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#888", marginBottom: 28, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Musim {selected.seasonName} · {selected.name}
                  </p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
                    {[1,2,3].map(s => (
                      <Star key={s} size={32} fill={s <= selected.stars ? "#FFD93D" : "#E5E5E5"} color={s <= selected.stars ? "#FFD93D" : "#E5E5E5"} />
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96, y: 5 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { setPlayingLevel(selected.id); setSelected(null); }}
                    style={{ width: "100%", padding: "20px", borderRadius: 24, border: "none", background: selected.color, color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 22, boxShadow: `0 8px 0 ${selected.color}99, 0 16px 24px ${selected.color}33`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                  >
                    MULAI! <Rocket size={24} />
                  </motion.button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {playingLevel !== null && (
              <MiniGame
                level={playingLevel}
                onFinish={async (result) => {
                  try {
                    await supabase.from("game_results").insert({
                      level_id: playingLevel,
                      stars: result.stars,
                      total_salah: result.totalSalah,
                      rata_waktu: result.rataWaktu,
                      detail_error: result.detailError,
                    });

                    setLevels(prev => {
                      const newLevels = prev.map(lvl => {
                        if (lvl.id === playingLevel) {
                          return { ...lvl, stars: Math.max(lvl.stars, result.stars), completed: true };
                        }
                        if (lvl.id === (playingLevel as number) + 1) {
                          return { ...lvl, unlocked: true };
                        }
                        return lvl;
                      });
                      return newLevels;
                    });
                  } catch (e) {
                    console.error("Gagal simpan ke Supabase:", e);
                  } finally {
                    setPlayingLevel(null);
                  }
                }}
              />
            )}
          </AnimatePresence>

          <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, zIndex: 150 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", borderRadius: 36, padding: "10px 24px", boxShadow: "0 8px 0 #E0E0E0, 0 16px 32px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,1)" }}>
              <NavButton icon={<Compass size={28} strokeWidth={2.5} />} active={activeTab === "adventure"} onClick={() => setActiveTab("adventure")} />
              <NavButton icon={<Gamepad2 size={28} strokeWidth={2.5} />} active={activeTab === "minigame"} onClick={() => setActiveTab("minigame")} />
              <NavButton icon={<User size={28} strokeWidth={2.5} />} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            </div>
          </div>

          <SideDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            onMenuClick={(label) => {
              if (label === "Dashboard Ortu") setShowDashboardOrtu(true);
            }}
          />
          <DashboardOrtu 
            isOpen={showDashboardOrtu} 
            onClose={() => setShowDashboardOrtu(false)} 
            currentLevel={currentLevel}
          />
        </div>
      )}
    </div>
  );
}

function NavButton({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", position: "relative", width: 54, height: 54 }}
    >
      <motion.div 
        animate={{ 
          scale: active ? 1.15 : 1, 
          y: active ? -4 : 0,
          color: active ? "#58CC02" : "#A0A0A0",
          filter: active ? "drop-shadow(0 4px 6px rgba(88,204,2,0.4))" : "drop-shadow(0 0px 0px rgba(0,0,0,0))"
        }} 
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.div>
      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ position: "absolute", bottom: 2, width: 6, height: 6, borderRadius: "50%", background: "#58CC02" }} 
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}