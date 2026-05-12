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
import { SettingsScreen } from "@/components/SettingsScreen";
import { supabase } from "@/lib/supabase";
import { getAppSettings } from "@/lib/appSettings";
import { Howler } from "howler";
import { User, Trophy, BarChart, Settings, PawPrint, Flower2, Sun, Leaf, Snowflake, Rocket, Star, Lock, Sparkles, Cloud, Home, Compass, Gamepad2 } from "lucide-react";
import { MissionsScreen } from "@/components/MissionsScreen";
import { ChildProfile } from "@/components/ChildProfile";

// ── SEASON CONFIG ──
const SEASONS_CONFIG = {
  SPRING: {
    name: "Semi",
    mainColor: "#FF6B9D",
    nodeColor: "#FF9FCC",
    bgColor: ["#FFF0F5", "#FFE0EE", "#F9F0FF"],
    pathColor: "#F5E6CC",
    pathEdge: "#FFB3D1",
    assets: ["sakura", "flower", "leaf_green", "tree_sakura", "pond", "grassy_patch"]
  },
  SUMMER: {
    name: "Panas",
    mainColor: "#FF9F43",
    nodeColor: "#FFD93D",
    bgColor: ["#FFE082", "#FFD54F", "#FFB74D"],
    pathColor: "#F3DFA2",
    pathEdge: "#FFD54F",
    assets: ["sun", "hibiscus", "bush_lush", "tree_palm", "tropical_flower", "beach_stone"]
  },
  AUTUMN: {
    name: "Gugur",
    mainColor: "#A29BFE",
    nodeColor: "#FF8F00",
    bgColor: ["#FFCC80", "#EF6C00", "#D84315"],
    pathColor: "#D7B19D",
    pathEdge: "#EF6C00",
    assets: ["maple", "mushroom", "pumpkin", "tree_maple", "wooden_sign", "leaf_pile"]
  },
  WINTER: {
    name: "Dingin",
    mainColor: "#00CEC9",
    nodeColor: "#81D4FA",
    bgColor: ["#E1F5FE", "#B3E5FC", "#81D4FA"],
    pathColor: "#FFFFFF",
    pathEdge: "#00BCD4",
    assets: ["crystal", "snowflake", "bush_snow", "tree_pine", "snow_pile", "ice_rock"]
  }
};

// ── DATA GENERATOR: 32 Levels ──
const generateLevelsData = () => {
  return Array.from({ length: 32 }, (_, i) => {
    const id = i + 1;
    let seasonKey: keyof typeof SEASONS_CONFIG = "SPRING";
    if (i >= 8 && i < 16) seasonKey = "SUMMER";
    else if (i >= 16 && i < 24) seasonKey = "AUTUMN";
    else if (i >= 24) seasonKey = "WINTER";

    const config = SEASONS_CONFIG[seasonKey];
    return {
      id,
      name: `Misi ${id}`,
      color: config.mainColor,
      nodeColor: config.nodeColor,
      bg: config.bgColor,
      seasonName: config.name,
      seasonKey,
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

// ── PREMIUM ILLUSTRATED ASSETS ──
const IllustratedAsset = ({ type, size = 48 }: { type: string, size?: number }) => {
  const gradId = useMemo(() => `grad-${Math.random().toString(36).substr(2, 9)}`, []);
  
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}>
      <defs>
        <radialGradient id={gradId} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* TREES */}
      {type.startsWith("tree_") && (
        <g>
          <rect x="28" y="40" width="8" height="20" rx="4" fill="#5D4037" />
          {type === "tree_sakura" && (
            <g>
              <circle cx="32" cy="28" r="22" fill="#FFB7D5" />
              <circle cx="20" cy="35" r="14" fill="#FF8BB4" />
              <circle cx="44" cy="35" r="14" fill="#FF8BB4" />
            </g>
          )}
          {type === "tree_palm" && (
            <g transform="translate(32,40)">
              {[0, 60, 120, 180, 240, 300].map(r => (
                <path key={r} d="M0 0 Q10 -20 30 -15" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" transform={`rotate(${r})`} />
              ))}
            </g>
          )}
          {type === "tree_maple" && (
            <g>
              <circle cx="32" cy="28" r="22" fill="#EF6C00" />
              <circle cx="20" cy="35" r="14" fill="#D84315" />
              <circle cx="44" cy="35" r="14" fill="#D84315" />
            </g>
          )}
          {type === "tree_pine" && (
            <g>
              <path d="M32 10 L54 45 L10 45 Z" fill="#2E7D32" />
              <path d="M32 25 L48 50 L16 50 Z" fill="#388E3C" />
              <path d="M32 10 L54 45 L10 45 Z" fill="white" opacity="0.3" />
            </g>
          )}
          <circle cx="32" cy="32" r="32" fill={`url(#${gradId})`} opacity="0.2" />
        </g>
      )}

      {/* POND */}
      {type === "pond" && (
        <g>
          <ellipse cx="32" cy="40" rx="28" ry="16" fill="#81D4FA" />
          <ellipse cx="28" cy="38" rx="14" ry="8" fill="#4FC3F7" opacity="0.5" />
          <path d="M15 42 Q20 38 25 42" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>
      )}

      {/* STONES */}
      {(type === "beach_stone" || type === "ice_rock") && (
        <g>
          <rect x="12" y="32" width="24" height="20" rx="10" fill={type === "ice_rock" ? "#B3E5FC" : "#BDBDBD"} />
          <rect x="30" y="40" width="20" height="16" rx="8" fill={type === "ice_rock" ? "#E1F5FE" : "#9E9E9E"} />
        </g>
      )}

      {/* OTHERS (Originals preserved/improved) */}
      {type === "sakura" && (
        <g>
          {[0, 72, 144, 216, 288].map((rot) => (
            <path key={rot} d="M32 32 C32 12 48 12 48 24 C48 36 32 32 32 32" fill="#FFB7D5" transform={`rotate(${rot} 32 32)`} />
          ))}
          <circle cx="32" cy="32" r="6" fill="#FF8BB4" />
        </g>
      )}

      {type === "flower" && (
        <g>
          <circle cx="32" cy="32" r="24" fill="#FFD93D" />
          <circle cx="32" cy="32" r="12" fill="#FF9600" />
        </g>
      )}

      {type === "sun" && (
        <g>
          <circle cx="32" cy="32" r="22" fill="#FFD93D" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
            <rect key={rot} x="30" y="4" width="4" height="14" rx="2" fill="#FF9600" transform={`rotate(${rot} 32 32)`} />
          ))}
        </g>
      )}

      {type === "mushroom" && (
        <g>
          <rect x="22" y="38" width="20" height="20" rx="10" fill="#F5F5F5" />
          <path d="M8 40 Q32 10 56 40 Z" fill="#E53935" />
          <circle cx="24" cy="28" r="5" fill="white" opacity="0.6" />
          <circle cx="40" cy="28" r="5" fill="white" opacity="0.6" />
        </g>
      )}

      {type === "pumpkin" && (
        <g>
          <rect x="28" y="4" width="8" height="12" rx="4" fill="#689F38" />
          <ellipse cx="32" cy="36" rx="28" ry="24" fill="#FB8C00" />
          <ellipse cx="32" cy="36" rx="16" ry="24" fill="#F57C00" />
        </g>
      )}

      {type === "crystal" && (
        <g>
          <path d="M32 6 L56 32 L32 58 L8 32 Z" fill="#81D4FA" />
          <path d="M32 6 L32 58" stroke="white" strokeWidth="2" opacity="0.6" />
        </g>
      )}

      {(type === "bush_lush" || type === "bush_snow") && (
        <g>
          <circle cx="20" cy="42" r="18" fill={type === "bush_snow" ? "#B3E5FC" : "#66BB6A"} />
          <circle cx="44" cy="42" r="18" fill={type === "bush_snow" ? "#B3E5FC" : "#66BB6A"} />
          <circle cx="32" cy="28" r="22" fill={type === "bush_snow" ? "#E1F5FE" : "#81C784"} />
        </g>
      )}

      {type === "leaf_green" && (
        <g>
          <path d="M32 8 C48 8 56 24 56 36 C56 48 48 56 32 56 C16 56 8 48 8 36 C8 24 16 8 32 8" fill="#81C784" />
          <path d="M32 12 L32 52" stroke="#4CAF50" strokeWidth="2" opacity="0.5" />
        </g>
      )}

      {/* GLOSSY OVERLAY FOR ALL */}
      <circle cx="32" cy="32" r="32" fill={`url(#${gradId})`} opacity="0.4" />
    </svg>
  );
};

function FloatingDecorations({ mapHeight }: { mapHeight: number }) {
  const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const y = Math.random() * mapHeight;
    const progress = 1 - (y / mapHeight);
    
    let seasonKey: keyof typeof SEASONS_CONFIG = "SPRING";
    if (progress > 0.75) seasonKey = "WINTER";
    else if (progress > 0.5) seasonKey = "AUTUMN";
    else if (progress > 0.25) seasonKey = "SUMMER";

    const config = SEASONS_CONFIG[seasonKey];
    const type = config.assets[i % config.assets.length];

    return {
      x: Math.random() * 320 + 35,
      y,
      size: Math.random() * 6 + 8,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      type
    };
  }), [mapHeight]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ 
            opacity: [0, 0.35, 0], 
            y: [0, -100, 0],
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            rotate: [0, 180]
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          style={{ position: "absolute", left: p.x, top: p.y }}
        >
          <IllustratedAsset type={p.type} size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}

function WorldScenery({ mapHeight }: { mapHeight: number }) {
  const scenery = useMemo(() => Array.from({ length: 45 }, (_, i) => {
    const y = Math.random() * mapHeight;
    const progress = 1 - (y / mapHeight);
    
    let seasonKey: keyof typeof SEASONS_CONFIG = "SPRING";
    if (progress > 0.75) seasonKey = "WINTER";
    else if (progress > 0.5) seasonKey = "AUTUMN";
    else if (progress > 0.25) seasonKey = "SUMMER";

    const config = SEASONS_CONFIG[seasonKey];
    const type = config.assets[Math.floor(Math.random() * config.assets.length)];

    // Favoring the edges to keep the center path clean
    const x = i % 2 === 0 ? Math.random() * 60 + 20 : Math.random() * 60 + 310;

    return {
      x,
      y,
      size: Math.random() * 20 + 24,
      rotate: Math.random() * 30 - 15,
      seasonKey,
      type,
      zIndex: 1,
      opacity: Math.random() * 0.3 + 0.4
    };
  }), [mapHeight]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {scenery.map((s, i) => (
        <div key={i} style={{ 
          position: "absolute", left: s.x, top: s.y, 
          zIndex: s.zIndex, opacity: s.opacity,
          transform: `rotate(${s.rotate}deg)`,
          filter: "blur(0.5px)"
        }}>
          <IllustratedAsset type={s.type} size={s.size} />
        </div>
      ))}
    </div>
  );
}

function EnvironmentalProp({ seasonKey, index }: { seasonKey: keyof typeof SEASONS_CONFIG, index: number }) {
  const config = SEASONS_CONFIG[seasonKey];
  const type = config.assets[index % config.assets.length];
  const size = index % 3 === 0 ? 48 : index % 3 === 1 ? 36 : 28;
  const rotate = (index * 25) % 360;

  return (
    <motion.div
      animate={{ 
        y: [0, -6, 0], 
        rotate: [rotate - 2, rotate + 2, rotate - 2],
        scale: [1, 1.04, 1]
      }}
      transition={{ duration: 6 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ position: "absolute", inset: -size/2, background: config.mainColor, opacity: 0.08, borderRadius: "50%", filter: "blur(20px)", zIndex: -1 }} />
      <IllustratedAsset type={type} size={size} />

      {index % 4 === 0 && (
        <motion.div 
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: index % 2 }}
          style={{ position: "absolute", top: -10, right: -10 }}
        >
          <Sparkles size={16} color="#FFD93D" fill="#FFD93D" />
        </motion.div>
      )}
    </motion.div>
  );
}

// ── MAP CONFIG ──
const MAP_HEIGHT = 4300;
const generatePathPositions = () => {
  return Array.from({ length: 32 }, (_, i) => {
    // Shifting map further upward for more breathing room above navbar
    const y = MAP_HEIGHT - (i * 125) - 250;
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

  const seasonKey = (level.seasonKey as keyof typeof SEASONS_CONFIG) || "SPRING";
  const seasonConfig = SEASONS_CONFIG[seasonKey] || SEASONS_CONFIG.SPRING;

  const btnBg = isCompleted 
    ? `linear-gradient(180deg, ${seasonConfig.mainColor} 0%, ${seasonConfig.mainColor}CC 100%)` 
    : isCurrent 
      ? "linear-gradient(180deg, #FFD93D 0%, #FF9600 100%)" 
      : "linear-gradient(180deg, #FFFFFF 0%, #E8E8E8 100%)";
  
  const btnShadow = isCompleted 
    ? `0 8px 0 ${seasonConfig.mainColor}99, 0 12px 24px ${seasonConfig.mainColor}33` 
    : isCurrent 
      ? "0 8px 0 #D97B29, 0 12px 24px rgba(255,150,0,0.4)" 
      : "0 8px 0 #D0D0D0, 0 10px 16px rgba(0,0,0,0.08)";
  
  const innerShadow = isCompleted 
    ? "inset 0 -6px 0 rgba(0,0,0,0.1), inset 0 6px 0 rgba(255,255,255,0.4)" 
    : isCurrent 
      ? "inset 0 -6px 0 rgba(0,0,0,0.2), inset 0 6px 0 rgba(255,255,255,0.6)" 
      : "inset 0 -6px 0 rgba(0,0,0,0.08), inset 0 6px 0 #FFFFFF";

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
  const [showSettings, setShowSettings]     = useState(false);
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

    // Terapkan setting audio yang tersimpan (global Howler)
    const settings = getAppSettings();
    Howler.mute(settings.audioMuted);

    // Ambil progres awal dari Supabase
    const fetchProgress = async () => {
      const { data, error } = await supabase.from("game_results").select("*");
      
      const progressMap: Record<number, number> = {};
      if (data) {
        // Cari bintang tertinggi per level
        data.forEach((row) => {
          if (row.stars > 0) {
            progressMap[row.level_id] = Math.max(progressMap[row.level_id] || 0, row.stars);
          }
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }

    setIsDrawerOpen(false);
    setShowDashboardOrtu(false);
    setShowSettings(false);
    setSelected(null);
    setPlayingLevel(null);

    setActiveTab("adventure");
    setUserName("");
    setUserAvatar("bear");

    setShowSplash(false);
    setShowOnboarding(false);
    setShowChildSetup(false);
    setShowTransition(false);
    setShowAuth(true);
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
                {showHeader && activeTab === "adventure" && (
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

          {activeTab === "adventure" && (
            <div onScroll={handleScroll} style={{ flex: 1, overflowY: "auto", position: "relative" }}>
              <div style={{ 
                position: "relative", 
                height: MAP_HEIGHT, 
                width: "100%", 
                background: "linear-gradient(180deg, #E1F5FE 0%, #B3E5FC 20%, #B3E5FC 24%, #FFCC80 26%, #EF6C00 45%, #EF6C00 49%, #FFE082 51%, #FFD54F 70%, #FFD54F 74%, #FFF0F5 76%, #FFE0EE 100%)" 
              }}>

                {/* Animated Environmental Details */}
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                  <WorldScenery mapHeight={MAP_HEIGHT} />
                  
                  {pathPositions.map((pos, i) => {
                    const seasonIdx = Math.floor(i / 8);
                    const seasons: (keyof typeof SEASONS_CONFIG)[] = ["SPRING", "SUMMER", "AUTUMN", "WINTER"];
                    const seasonKey = seasons[seasonIdx];
                    
                    return (
                      <React.Fragment key={i}>
                        <motion.div style={{ position: "absolute", top: pos.y, left: pos.x > 195 ? 60 : 330, zIndex: 15 }}>
                          <EnvironmentalProp seasonKey={seasonKey} index={i} />
                        </motion.div>
                        {i % 4 === 0 && (
                          <motion.div style={{ position: "absolute", top: pos.y - 120, left: pos.x > 195 ? 300 : 70, zIndex: 10 }} animate={{ x: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
                            <Cloud size={56} color="white" fill="white" opacity={0.35} />
                          </motion.div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} viewBox={`0 0 390 ${MAP_HEIGHT}`}>
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%"   stopColor={SEASONS_CONFIG.WINTER.pathColor} />
                      <stop offset="25%"  stopColor={SEASONS_CONFIG.WINTER.pathColor} />
                      <stop offset="25%"  stopColor={SEASONS_CONFIG.AUTUMN.pathColor} />
                      <stop offset="50%"  stopColor={SEASONS_CONFIG.AUTUMN.pathColor} />
                      <stop offset="50%"  stopColor={SEASONS_CONFIG.SUMMER.pathColor} />
                      <stop offset="75%"  stopColor={SEASONS_CONFIG.SUMMER.pathColor} />
                      <stop offset="75%"  stopColor={SEASONS_CONFIG.SPRING.pathColor} />
                      <stop offset="100%" stopColor={SEASONS_CONFIG.SPRING.pathColor} />
                    </linearGradient>
                    <filter id="pathShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                      <feOffset dx="0" dy="6" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.1" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Decorative Outer Glow */}
                  <path d={pathData} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="64" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* The Main Path */}
                  <path d={pathData} fill="none" stroke="url(#pathGradient)" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" filter="url(#pathShadow)" />
                  <path d={pathData} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={pathData} fill="none" stroke="white" strokeWidth="6" strokeDasharray="0, 32" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
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
          )}

          {activeTab === "minigame" && (
            <MissionsScreen 
              stats={{ 
                total_stars: totalStars, 
                missions_completed: levels.filter(l => l.completed).length, 
                perfect_missions: levels.filter(l => l.stars === 3).length 
              }} 
            />
          )}

          {activeTab === "profile" && (
            <ChildProfile 
              userName={userName}
              setUserName={setUserName}
              userAvatar={userAvatar}
              setUserAvatar={setUserAvatar}
              stats={{ 
                total_stars: totalStars, 
                missions_completed: levels.filter(l => l.completed).length, 
                perfect_missions: levels.filter(l => l.stars === 3).length 
              }}
            />
          )}

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
                    const completedLevel = result.stars > 0;

                    if (completedLevel) {
                      await supabase.from("game_results").insert({
                        level_id: playingLevel,
                        stars: result.stars,
                        total_salah: result.totalSalah,
                        rata_waktu: result.rataWaktu,
                        detail_error: result.detailError,
                        dyslexia_assessment: result.dyslexiaAssessment || null,
                      });
                    }

                    setLevels(prev => {
                      const newLevels = prev.map(lvl => {
                        if (completedLevel && lvl.id === playingLevel) {
                          return { ...lvl, stars: Math.max(lvl.stars, result.stars), completed: true };
                        }
                        if (completedLevel && lvl.id === (playingLevel as number) + 1) {
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
              if (label === "Pengaturan") setShowSettings(true);
            }}
          />
          <DashboardOrtu 
            isOpen={showDashboardOrtu} 
            onClose={() => setShowDashboardOrtu(false)} 
            currentLevel={currentLevel}
          />

          <SettingsScreen
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            childName={userName}
            childAvatarId={userAvatar}
            onOpenProfile={() => {
              setActiveTab("profile");
              setShowSettings(false);
            }}
            onSignOut={handleSignOut}
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
