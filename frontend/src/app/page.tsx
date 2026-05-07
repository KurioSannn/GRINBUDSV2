"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const levels = [
  { id: 1,  name: "Huruf Dasar",    emoji: "🔤", color: "#FF6B9D", bg: "#FFF0F5", stars: 3, unlocked: true,  completed: true  },
  { id: 2,  name: "Baca Kata",      emoji: "📖", color: "#FF9F43", bg: "#FFF5EC", stars: 2, unlocked: true,  completed: true  },
  { id: 3,  name: "Susun Kalimat",  emoji: "🧩", color: "#A29BFE", bg: "#F5F3FF", stars: 1, unlocked: true,  completed: false },
  { id: 4,  name: "Tulis Huruf",    emoji: "✏️", color: "#FF7675", bg: "#FFF0F0", stars: 0, unlocked: false, completed: false },
  { id: 5,  name: "Kenali Pola",    emoji: "🔍", color: "#00CEC9", bg: "#F0FFFE", stars: 0, unlocked: false, completed: false },
  { id: 6,  name: "Baca Cepat",     emoji: "⚡", color: "#FDCB6E", bg: "#FFFBF0", stars: 0, unlocked: false, completed: false },
  { id: 7,  name: "Cerita Pendek",  emoji: "📜", color: "#6C5CE7", bg: "#F3F1FF", stars: 0, unlocked: false, completed: false },
  { id: 8,  name: "Ejaan Kata",     emoji: "🔡", color: "#00B894", bg: "#F0FFF8", stars: 0, unlocked: false, completed: false },
  { id: 9,  name: "Dikte",          emoji: "🎤", color: "#E17055", bg: "#FFF1EE", stars: 0, unlocked: false, completed: false },
  { id: 10, name: "Master!",        emoji: "👑", color: "#F9CA24", bg: "#FFFBEC", stars: 0, unlocked: false, completed: false },
];

const pathPositions = [
  { left: "50%", bottom: "4%"  },
  { left: "24%", bottom: "13%" },
  { left: "68%", bottom: "22%" },
  { left: "28%", bottom: "32%" },
  { left: "72%", bottom: "41%" },
  { left: "20%", bottom: "50%" },
  { left: "65%", bottom: "59%" },
  { left: "32%", bottom: "68%" },
  { left: "74%", bottom: "77%" },
  { left: "46%", bottom: "87%" },
];

function Stars({ count, size = 11 }: { count: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          style={{
            fontSize: size,
            color: s <= count ? "#FFD93D" : "rgba(0,0,0,0.12)",
            filter: s <= count ? "drop-shadow(0 0 3px rgba(255,217,61,0.7))" : "none",
          }}
        >★</span>
      ))}
    </div>
  );
}

function LevelNode({
  level, position, index, onClick,
}: {
  level: (typeof levels)[0];
  position: (typeof pathPositions)[0];
  index: number;
  onClick: () => void;
}) {
  const isCurrent = level.unlocked && !level.completed;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 18 }}
      style={{
        position: "absolute",
        left: position.left,
        bottom: position.bottom,
        transform: "translate(-50%, 50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        zIndex: 10,
      }}
    >
      {isCurrent && (
        <motion.div
          animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: -6, left: -6,
            width: 68, height: 68,
            borderRadius: "50%",
            border: `3px solid ${level.color}`,
            pointerEvents: "none",
          }}
        />
      )}

      <motion.button
        whileHover={level.unlocked ? { scale: 1.12 } : {}}
        whileTap={level.unlocked ? { scale: 0.88 } : {}}
        animate={isCurrent ? { y: [0, -5, 0] } : {}}
        transition={isCurrent ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
        onClick={onClick}
        disabled={!level.unlocked}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: level.unlocked ? "pointer" : "not-allowed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: level.unlocked
            ? `linear-gradient(145deg, ${level.bg}, white)`
            : "linear-gradient(145deg, #eeeef5, #d8d8e8)",
          boxShadow: level.unlocked
            ? `0 6px 16px ${level.color}55, 0 0 0 3px white, 0 0 0 5px ${level.color}`
            : "0 4px 10px rgba(0,0,0,0.1), 0 0 0 3px white, 0 0 0 5px #ccc",
        }}
      >
        {level.unlocked ? (
          <>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{level.emoji}</span>
            <span style={{
              fontSize: 9, fontWeight: 900, color: level.color,
              lineHeight: 1, marginTop: 2, fontFamily: "'Nunito', sans-serif",
            }}>
              LVL {level.id}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 20 }}>🔒</span>
        )}
      </motion.button>

      {level.unlocked && <Stars count={level.stars} />}
    </motion.div>
  );
}

function LevelModal({ level, onClose }: { level: (typeof levels)[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          background: "white",
          borderRadius: "32px 32px 0 0",
          padding: "32px 24px 44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          position: "relative",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 36, height: 36, borderRadius: "50%",
            border: "none", background: "#f0f0f5",
            fontSize: 16, cursor: "pointer", color: "#999",
          }}
        >✕</button>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 90, height: 90, borderRadius: 24,
            background: `linear-gradient(135deg, ${level.bg}, white)`,
            border: `3px solid ${level.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 44, boxShadow: `0 8px 24px ${level.color}40`,
          }}
        >
          {level.emoji}
        </motion.div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 28, color: level.color, lineHeight: 1,
          }}>
            Level {level.id}
          </div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15, fontWeight: 800, color: "#888", marginTop: 4,
          }}>
            {level.name}
          </div>
        </div>

        <Stars count={level.stars} size={28} />

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            width: "100%", padding: "16px", borderRadius: 20,
            border: "none",
            background: `linear-gradient(135deg, ${level.color}, ${level.color}cc)`,
            color: "white",
            fontFamily: "'Fredoka One', cursive",
            fontSize: 20, cursor: "pointer",
            boxShadow: `0 8px 24px ${level.color}55`,
            marginTop: 4,
          }}
        >
          {level.completed ? "🔄 Main Lagi" : "▶ Mulai"}
        </motion.button>

        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 12, fontWeight: 700, color: "#ccc",
        }}>
          {level.completed ? "Skor terbaikmu: ⭐⭐⭐" : "Selesaikan untuk dapat bintang!"}
        </p>
      </motion.div>
    </motion.div>
  );
}

const NAV = [
  { label: "Home",      emoji: "🏠" },
  { label: "History",   emoji: "📜" },
  { label: "Dashboard", emoji: "📊" },
  { label: "Profil",    emoji: "👤" },
];

export default function HomePage() {
  const [selected, setSelected] = useState<(typeof levels)[0] | null>(null);
  const [activeNav, setActiveNav] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const completedCount = levels.filter((l) => l.completed).length;
  const totalStars = levels.reduce((s, l) => s + l.stars, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Fredoka+One&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f4ff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      `}</style>

      <div style={{
        width: 390, height: 844,
        borderRadius: 50, overflow: "hidden",
        display: "flex", flexDirection: "column",
        background: "white",
        boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 6px white, 0 0 0 8px #e0e0f0",
        position: "relative",
        fontFamily: "'Nunito', sans-serif",
      }}>

        {/* ── HEADER ── */}
        <div style={{
          background: "linear-gradient(135deg, #FF6B9D, #FF8E53)",
          padding: "20px 20px 16px",
          flexShrink: 0,
          boxShadow: "0 4px 20px rgba(255,107,157,0.3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 24, color: "white",
                textShadow: "2px 3px 0 rgba(0,0,0,0.1)",
              }}>
                🍭 GrinBuds
              </div>
              <div style={{
                fontSize: 10, fontWeight: 900,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2,
              }}>
                Belajar Membaca Menyenangkan!
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ icon: "⭐", val: totalStars }, { icon: "🔥", val: 5 }].map((s) => (
                <div key={s.icon} style={{
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: 20, padding: "5px 12px",
                  display: "flex", alignItems: "center", gap: 5,
                  border: "1.5px solid rgba(255,255,255,0.4)",
                }}>
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "white" }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: 6, fontSize: 11, fontWeight: 900,
              color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>
              <span>Progress {completedCount}/10</span>
              <span>Level {completedCount + 1} ▸</span>
            </div>
            <div style={{
              height: 12, background: "rgba(0,0,0,0.15)",
              borderRadius: 10, overflow: "hidden",
              border: "1.5px solid rgba(255,255,255,0.25)",
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / 10) * 100}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #FFD93D, #FF9F43)",
                  borderRadius: 10,
                  boxShadow: "0 0 10px rgba(255,217,61,0.6)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── MAP ── */}
        <div style={{
          flex: 1, position: "relative", overflow: "hidden",
          background: "linear-gradient(180deg, #EEF2FF 0%, #F8FAFF 60%, #FFF5F8 100%)",
        }}>
          {/* Clouds */}
          {[
            { top: "7%",  left: "6%",  size: 38, op: 0.45 },
            { top: "5%",  left: "60%", size: 52, op: 0.38 },
            { top: "38%", left: "3%",  size: 32, op: 0.32 },
            { top: "58%", left: "68%", size: 42, op: 0.38 },
          ].map((c, i) => (
            <div key={i} style={{
              position: "absolute", top: c.top, left: c.left,
              fontSize: c.size, opacity: c.op, pointerEvents: "none",
            }}>☁️</div>
          ))}

          {/* Trees */}
          {[
            { bottom: "10%", left: "4%",  emoji: "🌴" },
            { bottom: "28%", left: "82%", emoji: "🌲" },
            { bottom: "55%", left: "5%",  emoji: "🌿" },
            { bottom: "80%", left: "78%", emoji: "🌸" },
          ].map((d, i) => (
            <span key={i} style={{
              position: "absolute", bottom: d.bottom, left: d.left,
              fontSize: 26, opacity: 0.45, pointerEvents: "none",
            }}>{d.emoji}</span>
          ))}

          {/* Path */}
          <svg
            style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}
            viewBox="0 0 390 650"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M195,25 C100,60 250,110 120,150 C260,190 115,230 275,270 C80,310 235,350 195,390 C82,430 280,470 138,510 C272,552 180,592 195,630"
              fill="none"
              stroke="#c8d0f8"
              strokeWidth="10"
              strokeDasharray="18,12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>

          {/* Nodes */}
          {mounted && levels.map((lv, i) => (
            <LevelNode
              key={lv.id}
              level={lv}
              position={pathPositions[i]}
              index={i}
              onClick={() => lv.unlocked && setSelected(lv)}
            />
          ))}
        </div>

        {/* ── NAVBAR ── */}
        <div style={{
          background: "white",
          borderTop: "1.5px solid #f0f0f8",
          display: "flex", justifyContent: "space-around",
          padding: "8px 0 16px", flexShrink: 0,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
        }}>
          {NAV.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveNav(idx)}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 3,
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 14px",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
                background: activeNav === idx ? "#FF6B9D18" : "transparent",
                transition: "background 0.2s",
              }}>
                {item.emoji}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 900,
                color: activeNav === idx ? "#FF6B9D" : "#ccc",
                textTransform: "uppercase", letterSpacing: 0.5,
                fontFamily: "'Nunito', sans-serif",
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── MODAL ── */}
        <AnimatePresence>
          {selected && (
            <LevelModal level={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}