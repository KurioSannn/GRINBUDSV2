"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SplashScreen } from "@/components/SplashScreen";
import { Onboarding } from "@/components/Onboarding";
import { AuthScreen } from "@/components/AuthScreen";
import { ChildSetupScreen } from "@/components/ChildSetupScreen";
import MiniGame from "@/components/MiniGame";
import { supabase } from "@/lib/supabase";
import { DashboardOrtu } from "@/components/DashboardOrtu";

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
  star: (color: string) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={color}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="22" height="22">
      <rect x="5" y="11" width="14" height="10" rx="2"/>
      <path d="M8 11V7a4 4 0 018 0v4"/>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

// ── ORNAMEN: pure SVG + CSS keyframes (FIXED TRANSFORM OVERRIDES) ──

function OrnamentSemi({ x, y, size = 1, opacity = 0.7, animDelay = "0s" }: {
  x: number; y: number; size?: number; opacity?: number; animDelay?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`} opacity={opacity}>
      {/* Harus dibungkus <g> baru supaya animasi CSS tidak meng-override translate() induknya */}
      <g style={{ animation: `semiSway 4s ease-in-out infinite`, animationDelay: animDelay, transformOrigin: "0px 0px" }}>
        <circle cx="0" cy="0" r="5" fill="#FF6B9D" />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <ellipse key={i} cx="0" cy="-12" rx="4.5" ry="8"
            fill={i % 2 === 0 ? "#FFB8D9" : "#FF9FCC"}
            transform={`rotate(${deg})`} opacity="0.9" />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#FFE0EE" />
      </g>
    </g>
  );
}

function LeafSemi({ x, y, rotate = 0, opacity = 0.6, animDelay = "0s" }: {
  x: number; y: number; rotate?: number; opacity?: number; animDelay?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate})`} opacity={opacity}>
      <g style={{ animation: `leafFloat 5s ease-in-out infinite`, animationDelay: animDelay, transformOrigin: "0px 0px" }}>
        <ellipse cx="0" cy="0" rx="5" ry="10" fill="#6FCF97" />
        <line x1="0" y1="-9" x2="0" y2="9" stroke="#27AE60" strokeWidth="0.8" />
      </g>
    </g>
  );
}

function OrnamentPanas({ x, y, size = 1, opacity = 0.75 }: {
  x: number; y: number; size?: number; opacity?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`} opacity={opacity}>
      <g style={{ animation: "spinSun 20s linear infinite", transformOrigin: "0px 0px" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line key={i} x1="0" y1="10" x2="0" y2="18"
            stroke="#FFBE2E" strokeWidth={i % 2 === 0 ? "2.5" : "1.8"}
            strokeLinecap="round" transform={`rotate(${deg})`} />
        ))}
      </g>
      <circle cx="0" cy="0" r="9" fill="#FFD93D"
        style={{ animation: "pulseSun 3s ease-in-out infinite", transformOrigin: "0px 0px" }} />
      <circle cx="0" cy="0" r="5.5" fill="#FFE873" />
    </g>
  );
}

function CloudPanas({ x, y, scale = 1, opacity = 0.5, animDelay = "0s" }: {
  x: number; y: number; scale?: number; opacity?: number; animDelay?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <g style={{ animation: "cloudDrift 12s ease-in-out infinite", animationDelay: animDelay, transformOrigin: "0px 0px" }}>
        <ellipse cx="0"   cy="0"  rx="20" ry="12" fill="white" />
        <ellipse cx="-13" cy="4"  rx="13" ry="10" fill="white" />
        <ellipse cx="13"  cy="4"  rx="13" ry="10" fill="white" />
        <ellipse cx="0"   cy="-6" rx="11" ry="9"  fill="white" />
      </g>
    </g>
  );
}

function OrnamentGugur({ x, y, rotate = 0, color = "#E2A84B", size = 1, opacity = 0.8, animDelay = "0s" }: {
  x: number; y: number; rotate?: number; color?: string; size?: number; opacity?: number; animDelay?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${size})`} opacity={opacity}>
      <g style={{ animation: "leafFall 6s ease-in-out infinite", animationDelay: animDelay, transformOrigin: "0px 0px" }}>
        <ellipse cx="0" cy="0" rx="9" ry="13" fill={color} />
        <line x1="0" y1="-12" x2="0" y2="12" stroke="#8B4513" strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="-5" x2="6" y2="1"   stroke="#8B4513" strokeWidth="0.7" opacity="0.4" />
        <line x1="0" y1="2"  x2="-6" y2="7"  stroke="#8B4513" strokeWidth="0.7" opacity="0.4" />
      </g>
    </g>
  );
}

function OrnamentDingin({ x, y, size = 1, opacity = 0.7, animDelay = "0s" }: {
  x: number; y: number; size?: number; opacity?: number; animDelay?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${size})`} opacity={opacity}>
      <g style={{ animation: "spinSlow 15s linear infinite", animationDelay: animDelay, transformOrigin: "0px 0px" }}>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <line key={i} x1="0" y1="0" x2="0" y2="-18"
            stroke="#81ECEC" strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${deg})`} />
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg})`}>
            <line x1="-4" y1="-10" x2="4" y2="-10" stroke="#00CEC9" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-3" y1="-14" x2="3" y2="-14" stroke="#00B5B0" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ))}
        <circle cx="0" cy="0" r="4" fill="#00CEC9" />
        <circle cx="0" cy="0" r="2" fill="#81ECEC" />
      </g>
    </g>
  );
}

function SnowDot({ x, y, animDelay = "0s" }: { x: number; y: number; animDelay?: string }) {
  return (
    <circle cx={x} cy={y} r="2.5" fill="white" opacity="0.6"
      style={{ animation: "twinkleDot 2.5s ease-in-out infinite", animationDelay: animDelay }} />
  );
}

// ── SEASON ORNAMENTS LAYER ──
function SeasonOrnamentsLayer({ mapHeight }: { mapHeight: number }) {
  return (
    <g>
      {/* ══ SEMI (y 2400–3100) ══ */}
      <OrnamentSemi x={40}  y={3050} size={1.2} opacity={0.65} animDelay="0s"    />
      <OrnamentSemi x={340} y={3000} size={0.9} opacity={0.55} animDelay="0.8s"  />
      <OrnamentSemi x={80}  y={2900} size={1.0} opacity={0.6}  animDelay="1.5s"  />
      <OrnamentSemi x={310} y={2820} size={1.3} opacity={0.5}  animDelay="0.3s"  />
      <OrnamentSemi x={55}  y={2720} size={0.8} opacity={0.6}  animDelay="2.1s"  />
      <OrnamentSemi x={355} y={2650} size={1.1} opacity={0.55} animDelay="0.6s"  />
      <OrnamentSemi x={30}  y={2550} size={1.0} opacity={0.5}  animDelay="1.2s"  />
      <OrnamentSemi x={330} y={2480} size={0.9} opacity={0.6}  animDelay="1.8s"  />
      <LeafSemi x={360} y={3080} rotate={-20} opacity={0.55} animDelay="0s"    />
      <LeafSemi x={20}  y={2980} rotate={30}  opacity={0.5}  animDelay="1.1s"  />
      <LeafSemi x={370} y={2760} rotate={10}  opacity={0.5}  animDelay="0.5s"  />
      <LeafSemi x={15}  y={2650} rotate={-15} opacity={0.55} animDelay="1.7s"  />
      <LeafSemi x={365} y={2520} rotate={25}  opacity={0.5}  animDelay="0.9s"  />

      {/* ══ PANAS (y 1500–2350) ══ */}
      <OrnamentPanas x={50}  y={2350} size={1.1} opacity={0.7}  />
      <OrnamentPanas x={345} y={2260} size={0.85} opacity={0.6} />
      <OrnamentPanas x={35}  y={2160} size={1.0}  opacity={0.65}/>
      <OrnamentPanas x={350} y={2060} size={1.2}  opacity={0.55}/>
      <OrnamentPanas x={45}  y={1960} size={0.9}  opacity={0.65}/>
      <OrnamentPanas x={340} y={1860} size={1.0}  opacity={0.6} />
      <OrnamentPanas x={40}  y={1760} size={1.1}  opacity={0.55}/>
      <OrnamentPanas x={355} y={1650} size={0.85} opacity={0.65}/>
      <CloudPanas x={195} y={2300} scale={1.2} opacity={0.4}  animDelay="0s"   />
      <CloudPanas x={80}  y={2100} scale={0.9} opacity={0.35} animDelay="3s"   />
      <CloudPanas x={310} y={1950} scale={1.0} opacity={0.38} animDelay="6s"   />
      <CloudPanas x={150} y={1750} scale={0.8} opacity={0.35} animDelay="1.5s" />
      <CloudPanas x={270} y={1600} scale={1.1} opacity={0.38} animDelay="4.5s" />

      {/* ══ GUGUR (y 700–1450) ══ */}
      <OrnamentGugur x={45}  y={1450} rotate={-30} color="#E2A84B" size={1.0}  opacity={0.75} animDelay="0s"    />
      <OrnamentGugur x={345} y={1380} rotate={20}  color="#C8802D" size={1.2}  opacity={0.7}  animDelay="1.2s"  />
      <OrnamentGugur x={55}  y={1290} rotate={-45} color="#D4956A" size={0.9}  opacity={0.65} animDelay="0.5s"  />
      <OrnamentGugur x={350} y={1200} rotate={15}  color="#B5652A" size={1.1}  opacity={0.75} animDelay="2s"    />
      <OrnamentGugur x={40}  y={1100} rotate={35}  color="#E2A84B" size={0.85} opacity={0.7}  animDelay="0.8s"  />
      <OrnamentGugur x={340} y={1010} rotate={-20} color="#C8802D" size={1.0}  opacity={0.65} animDelay="1.5s"  />
      <OrnamentGugur x={50}  y={910}  rotate={10}  color="#A0522D" size={1.2}  opacity={0.7}  animDelay="0.3s"  />
      <OrnamentGugur x={345} y={820}  rotate={-35} color="#E2A84B" size={0.9}  opacity={0.65} animDelay="1.8s"  />
      <OrnamentGugur x={160} y={1430} rotate={55}  color="#D4956A" size={0.6}  opacity={0.5}  animDelay="0.7s"  />
      <OrnamentGugur x={230} y={1250} rotate={-60} color="#C8802D" size={0.55} opacity={0.45} animDelay="2.3s"  />
      <OrnamentGugur x={170} y={1050} rotate={40}  color="#B5652A" size={0.65} opacity={0.5}  animDelay="1.1s"  />
      <OrnamentGugur x={220} y={850}  rotate={-50} color="#E2A84B" size={0.6}  opacity={0.45} animDelay="0.4s"  />

      {/* ══ DINGIN (y 0–700) ══ */}
      <OrnamentDingin x={50}  y={680} size={1.1}  opacity={0.65} animDelay="0s"    />
      <OrnamentDingin x={340} y={610} size={0.9}  opacity={0.6}  animDelay="2s"    />
      <OrnamentDingin x={40}  y={520} size={1.2}  opacity={0.55} animDelay="1s"    />
      <OrnamentDingin x={350} y={450} size={0.85} opacity={0.6}  animDelay="3s"    />
      <OrnamentDingin x={45}  y={360} size={1.0}  opacity={0.65} animDelay="0.5s"  />
      <OrnamentDingin x={345} y={290} size={1.1}  opacity={0.55} animDelay="1.5s"  />
      <OrnamentDingin x={40}  y={200} size={0.9}  opacity={0.6}  animDelay="2.5s"  />
      <OrnamentDingin x={350} y={130} size={1.2}  opacity={0.55} animDelay="0.8s"  />
      <SnowDot x={100} y={650} animDelay="0s"    /><SnowDot x={270} y={620} animDelay="0.4s"  />
      <SnowDot x={155} y={580} animDelay="0.9s"  /><SnowDot x={305} y={530} animDelay="1.3s"  />
      <SnowDot x={90}  y={490} animDelay="0.2s"  /><SnowDot x={260} y={450} animDelay="1.7s"  />
      <SnowDot x={130} y={410} animDelay="0.6s"  /><SnowDot x={285} y={370} animDelay="2.0s"  />
      <SnowDot x={100} y={320} animDelay="1.1s"  /><SnowDot x={245} y={280} animDelay="0.3s"  />
      <SnowDot x={165} y={240} animDelay="1.5s"  /><SnowDot x={295} y={200} animDelay="0.7s"  />
      <SnowDot x={80}  y={165} animDelay="1.9s"  /><SnowDot x={230} y={140} animDelay="2.3s"  />
      <SnowDot x={150} y={100} animDelay="0.5s"  />
    </g>
  );
}

// ── SEASON DIVIDER ──
function SeasonDivider({ y, label, color }: { y: number; label: string; color: string }) {
  return (
    <g>
      <line x1="0" y1={y} x2="390" y2={y} stroke={color} strokeWidth="1.5" opacity="0.35" strokeDasharray="6,6" />
      <rect x="10" y={y - 14} width={label.length * 9 + 20} height="22" rx="11" fill={color} opacity="0.18" />
      <text x="20" y={y + 4} fontFamily="'Fredoka One', cursive" fontSize="12" fill={color} opacity="0.95">{label}</text>
    </g>
  );
}

// ── MAP CONFIG ──
const MAP_HEIGHT = 3200;
const generatePathPositions = () => {
  return Array.from({ length: 32 }, (_, i) => {
    const y = MAP_HEIGHT - (i * 95) - 150;
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
        <svg key={s} viewBox="0 0 24 24" width={size} height={size} fill={s <= count ? "#FFD93D" : "rgba(255,255,255,0.2)"}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
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

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        zIndex: 10,
      }}
    >
      {isCurrent && (
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", width: 70, height: 70, borderRadius: "50%", border: `3px solid ${level.color}`, pointerEvents: "none" }}
        />
      )}
      <motion.button
        whileHover={level.unlocked ? { scale: 1.1 } : {}}
        whileTap={level.unlocked ? { scale: 0.9 } : {}}
        onClick={onClick}
        disabled={!level.unlocked}
        style={{
          width: 56, height: 56, borderRadius: "50%", border: "none",
          cursor: level.unlocked ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isCompleted ? level.color : isCurrent ? level.bg : "#eeeef5",
          boxShadow: isCurrent
            ? `0 0 0 4px white, 0 10px 20px ${level.color}44`
            : "0 4px 12px rgba(0,0,0,0.08)",
          color: isCompleted ? "white" : level.unlocked ? level.color : "#bbb",
          position: "relative", zIndex: 2,
        }}
      >
        {level.unlocked ? SVG_ICONS.star(isCompleted ? "white" : level.color) : SVG_ICONS.lock}
      </motion.button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 14, color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.5)", lineHeight: 1 }}>
          {level.id}
        </span>
        {level.unlocked && <Stars count={level.stars} />}
      </div>
    </motion.div>
  );
}

// ── SIDE DRAWER (FIX BUG 2: dikembalikan) ──
function SideDrawer({ isOpen, onClose, onMenuClick }: { isOpen: boolean; onClose: () => void; onMenuClick?: (label: string) => void }) {
  const menuItems = [
    { label: "Profil Anak",    color: "#FF6B9D" },
    { label: "Pencapaian",     color: "#FFD93D" },
    { label: "Dashboard Ortu", color: "#A29BFE" },
    { label: "Pengaturan",     color: "#00CEC9" },
  ];
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 150 }}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "80%", background: "white", zIndex: 160, borderRadius: "40px 0 0 40px", boxShadow: "-10px 0 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: "60px 24px 32px", borderBottom: "1px solid #f0f0f5", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0f0f5", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "#FF6B9D" }}>{SVG_ICONS.profile}</div>
              </div>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#333" }}>Budi</h2>
            </div>
            <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {menuItems.map((item, i) => (
                <button key={i} onClick={() => {
                  if (onMenuClick) onMenuClick(item.label);
                  onClose();
                }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: "20px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "12px", background: `${item.color}15`, color: item.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {SVG_ICONS.profile}
                  </div>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: "#444" }}>{item.label}</span>
                </button>
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

  const handleChildSetupFinish = () => {
    setShowChildSetup(false);
  };

  const pathData = useMemo(() => {
    let d = `M ${pathPositions[0].x} ${pathPositions[0].y}`;
    for (let i = 1; i < pathPositions.length; i++) {
      const prev = pathPositions[i - 1];
      const curr = pathPositions[i];
      d += ` Q ${prev.x} ${(prev.y + curr.y) / 2}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, []);

  const totalStars = levels.reduce((acc, l) => acc + l.stars, 0);
  const currentLevel = levels.filter(l => l.completed).length + 1;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", padding: "20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Fredoka+One&display=swap');
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
          <ChildSetupScreen onFinish={handleChildSetupFinish} />
        </AnimatePresence>
      ) : (
        <div style={{ width: 390, height: 844, display: "flex", flexDirection: "column", background: "white", position: "relative", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 8px #e0e0f0", borderRadius: "50px" }}>

          {/* FIX BUG 2: SideDrawer dikembalikan */}
          <SideDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            onMenuClick={(label) => {
              if (label === "Dashboard Ortu") setShowDashboardOrtu(true);
            }} 
          />

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
                      style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", border: "none", color: "#FF6B9D", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
                    >
                      {SVG_ICONS.profile}
                    </button>
                    <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", padding: "8px 16px", borderRadius: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}>
                      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#FF6B9D", lineHeight: 1 }}>GrinBuds</div>
                      <div style={{ fontSize: 9, color: "#FF9FCC", fontWeight: 900 }}>PETA PETUALANGAN</div>
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
                    style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderRadius: 24, padding: "10px 16px", color: "#333", fontWeight: 900, display: "flex", alignItems: "center", gap: 8, pointerEvents: "auto", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
                  >
                    <svg viewBox="0 0 24 24" width={20} height={20} fill="#FFD93D">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    <span style={{ fontSize: 16 }}>{totalStars}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>

          {/* MAP - FIX BUG 1 & 4: BLOCKER DIV dihapus total.
              Level locked sudah ditangani via disabled + cursor not-allowed di LevelNode. */}
          <div onScroll={handleScroll} style={{ flex: 1, overflowY: "auto", background: "linear-gradient(180deg, #B8EEF8 0%, #8ED46A 70%, #72C245 100%)", position: "relative" }}>
            <div style={{ position: "relative", height: MAP_HEIGHT, width: "100%" }}>

              <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} viewBox={`0 0 390 ${MAP_HEIGHT}`}>
                <defs>
                  <linearGradient id="gradSemi"   x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B9D" stopOpacity="0" /><stop offset="100%" stopColor="#FF6B9D" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="gradPanas"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF9F43" stopOpacity="0" /><stop offset="100%" stopColor="#FF9F43" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="gradGugur"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A29BFE" stopOpacity="0" /><stop offset="100%" stopColor="#A29BFE" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="gradDingin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00CEC9" stopOpacity="1" /><stop offset="100%" stopColor="#00CEC9" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Zone tints */}
                <rect x="0" y={MAP_HEIGHT - 800}  width="390" height="800" fill="url(#gradSemi)"   opacity="0.18" />
                <rect x="0" y={MAP_HEIGHT - 1600} width="390" height="800" fill="url(#gradPanas)"  opacity="0.18" />
                <rect x="0" y={MAP_HEIGHT - 2400} width="390" height="800" fill="url(#gradGugur)"  opacity="0.18" />
                <rect x="0" y="0" width="390" height={MAP_HEIGHT - 2400}   fill="url(#gradDingin)" opacity="0.22" />

                {/* Divider label musim */}
                <SeasonDivider y={MAP_HEIGHT - 800}  label="🌸 Musim Semi"   color="#FF6B9D" />
                <SeasonDivider y={MAP_HEIGHT - 1600} label="☀️ Musim Panas"  color="#FF9F43" />
                <SeasonDivider y={MAP_HEIGHT - 2400} label="🍂 Musim Gugur"  color="#A29BFE" />
                <SeasonDivider y={160}               label="❄️ Musim Dingin" color="#00CEC9" />

                {/* Ornamen musiman */}
                <SeasonOrnamentsLayer mapHeight={MAP_HEIGHT} />

                {/* Jalur utama */}
                <path d={pathData} fill="none" stroke="#BE7741" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
                <path d={pathData} fill="none" stroke="#e8c97a" strokeWidth="6" strokeDasharray="12,12" strokeLinecap="round" />
              </svg>

              {/* FIX: mounted check dikembalikan agar tidak ada hydration mismatch */}
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
                style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "flex-end" }}
              >
                <motion.div
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: "100%", background: "white", borderRadius: "32px 32px 0 0", padding: "40px 24px", textAlign: "center", position: "relative" }}
                >
                  {/* Ornamen kecil musim di pojok modal */}
                  <div style={{ position: "absolute", top: 16, right: 20, opacity: 0.45 }}>
                    <svg width="28" height="28" viewBox="-16 -16 32 32">
                      {selected.seasonName === "Semi"   && <OrnamentSemi   x={0} y={0} size={0.85} opacity={1} />}
                      {selected.seasonName === "Panas"  && <OrnamentPanas  x={0} y={0} size={0.85} opacity={1} />}
                      {selected.seasonName === "Gugur"  && <OrnamentGugur  x={0} y={0} rotate={10} color="#E2A84B" size={0.9} opacity={1} />}
                      {selected.seasonName === "Dingin" && <OrnamentDingin x={0} y={0} size={0.8}  opacity={1} />}
                    </svg>
                  </div>
                  <div style={{ width: 80, height: 80, borderRadius: 20, background: selected.bg, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", color: selected.color }}>
                    {SVG_ICONS.star(selected.color)}
                  </div>
                  <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: selected.color, marginBottom: 8 }}>Level {selected.id}</h2>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#888", marginBottom: 32 }}>
                    Tantangan: {selected.name}
                  </p>
                  <button
                    onClick={() => { setPlayingLevel(selected.id); setSelected(null); }}
                    style={{ width: "100%", padding: 18, borderRadius: 20, border: "none", background: selected.color, color: "white", fontFamily: "'Fredoka One', cursive", fontSize: 22, boxShadow: `0 10px 20px ${selected.color}44`, cursor: "pointer" }}
                  >
                    MULAI
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MINIGAME OVERLAY */}
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

                    // Update UI Map secara instan
                    setLevels(prev => {
                      const newLevels = prev.map(lvl => {
                        if (lvl.id === playingLevel) {
                          return { ...lvl, stars: Math.max(lvl.stars, result.stars), completed: true };
                        }
                        // Buka level berikutnya
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

          {/* DASHBOARD ORTU OVERLAY */}
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