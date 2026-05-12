"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Sparkles, CheckCircle2, Lock, Gamepad2, Flag, Zap } from "lucide-react";
import { ACHIEVEMENTS, UserStats, isAchievementUnlocked } from "@/lib/achievements";
import { AVATARS } from "./ChildSetupScreen";

interface MissionsScreenProps {
  stats: UserStats;
}

const getMainTarget = (targets: { total_stars: number; missions_completed: number; perfect_missions: number }) => {
  if (targets.total_stars > 0) return { currentKey: "total_stars" as const, label: "bintang", currentLabel: "Bintang", target: targets.total_stars, icon: <Star size={14} fill="currentColor" /> };
  if (targets.missions_completed > 0) return { currentKey: "missions_completed" as const, label: "misi", currentLabel: "Misi", target: targets.missions_completed, icon: <Flag size={14} fill="currentColor" /> };
  return { currentKey: "perfect_missions" as const, label: "misi sempurna", currentLabel: "Sempurna", target: targets.perfect_missions, icon: <Zap size={14} fill="currentColor" /> };
};

const getRequirementText = (targets: { total_stars: number; missions_completed: number; perfect_missions: number }) => {
  const parts = [
    targets.total_stars > 0 ? `${targets.total_stars} bintang` : "",
    targets.missions_completed > 0 ? `${targets.missions_completed} misi selesai` : "",
    targets.perfect_missions > 0 ? `${targets.perfect_missions} misi bintang 3` : "",
  ].filter(Boolean);

  return parts.join(", ");
};

export function MissionsScreen({ stats }: MissionsScreenProps) {
  const unlockedCount = ACHIEVEMENTS.filter((achievement) => isAchievementUnlocked(achievement, stats)).length;
  const nextAchievement = ACHIEVEMENTS.find((achievement) => !isAchievementUnlocked(achievement, stats));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7FAFC", overflowY: "auto", overflowX: "hidden", paddingBottom: 80, position: "relative", width: "100%" }}>
      <div style={{
        background: "linear-gradient(155deg, #FFF0F5 0%, #EAF7FF 100%)",
        padding: "82px 22px 40px",
        minHeight: 450,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        boxShadow: "0 10px 22px rgba(80,94,120,0.06)",
      }}>
        <div style={{ position: "absolute", top: -70, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,107,157,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 160, height: 160, borderRadius: "50%", background: "rgba(28,176,246,0.10)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 16 }}>
            <div style={{ width: 84, height: 84, borderRadius: 28, background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(255,107,157,0.18)", border: "4px solid white", color: "#FF6B9D", marginBottom: 14 }}>
              <Gamepad2 size={44} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 30, color: "#26324D", margin: 0, lineHeight: 1 }}>
              Pencapaian
            </h1>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#6C7890", fontWeight: 800, margin: "8px 0 0", lineHeight: 1.35, maxWidth: 260 }}>
              Selesaikan tantangan untuk membuka badge dan avatar eksklusif.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, background: "rgba(255,255,255,0.62)", border: "1px solid rgba(226,232,240,0.7)", borderRadius: 20, padding: 8 }}>
            <SummaryPill icon={<ChunkyShieldGreen size={20} />} label="Terbuka" value={`${unlockedCount}/${ACHIEVEMENTS.length}`} color="#58CC02" />
            <SummaryPill icon={<ChunkyStarGold size={22} />} label="Bintang" value={stats.total_stars} color="#FFB800" />
            <SummaryPill icon={<ChunkyFlagBlue size={20} />} label="Misi" value={stats.missions_completed} color="#1CB0F6" />
          </div>

          {nextAchievement && (
            <div style={{ marginTop: 12, background: "rgba(255,255,255,0.78)", border: "1.5px solid rgba(255,255,255,0.92)", borderRadius: 18, padding: "11px 13px", display: "flex", alignItems: "center", gap: 8}}>
              <Sparkles size={16} color="#CE82FF" fill="#CE82FF" style={{ flexShrink: 0 }} />
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: "#516078", fontWeight: 800, lineHeight: 1.35, minWidth: 0 }}>
                Berikutnya: <span style={{ color: "#26324D" }}>{nextAchievement.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "24px 20px 24px", display: "flex", flexDirection: "column", gap: 14, width: "100%", boxSizing: "border-box" }}>
        {ACHIEVEMENTS.map((achievement, index) => {
          const unlocked = isAchievementUnlocked(achievement, stats);
          const rewardAvatar = AVATARS.find(a => a.unlockBy === achievement.id);
          const mainTarget = getMainTarget(achievement.targets);
          const currentValue = stats[mainTarget.currentKey];
          const progress = Math.min(100, Math.max(0, (currentValue / mainTarget.target) * 100));
          const remaining = Math.max(0, mainTarget.target - currentValue);
          const rewardLabel = rewardAvatar ? `Avatar ${rewardAvatar.label}` : achievement.type === "Badge" ? "Badge Eksklusif" : "Hadiah Eksklusif";
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
              whileHover={{ y: -4 }}
              style={{
                background: "white", borderRadius: 26, padding: "18px",
                boxShadow: unlocked ? "0 12px 28px rgba(88,204,2,0.12)" : "0 8px 22px rgba(31,41,55,0.06)",
                border: `2px solid ${unlocked ? "#B9F4A6" : "#EEF2F7"}`,
                position: "relative", overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", top: -32, right: -32, width: 112, height: 112, background: unlocked ? "#E2F9DB" : "#F1F5F9", borderRadius: "50%", zIndex: 0, opacity: 0.72 }} />
              
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                {/* Icon Container */}
                {(() => {
                  const isStarType = achievement.id.includes("star") || achievement.id.includes("kolektor") || achievement.id.includes("cemerlang");
                  
                  return (
                    <div style={{
                      width: 66, height: 66, borderRadius: 22, flexShrink: 0,
                      background: isStarType 
                        ? (unlocked ? "linear-gradient(135deg, #FFD93D, #FFB300)" : "linear-gradient(135deg, #FFF9C4, #FFF176)")
                        : (unlocked && !rewardAvatar ? "linear-gradient(135deg, #58CC02, #46A302)" : (rewardAvatar ? rewardAvatar.bg : "#FFF8E1")),
                      color: isStarType ? "#B8860B" : (unlocked ? "white" : achievement.type === "Badge" ? "#FFD93D" : "#CE82FF"),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: isStarType 
                        ? `0 10px 20px ${unlocked ? "rgba(255,217,61,0.35)" : "rgba(255,217,61,0.1)"}, inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -4px 0 rgba(0,0,0,0.08)`
                        : (unlocked ? "0 8px 20px rgba(88,204,2,0.25)" : "none"),
                      position: "relative",
                      border: isStarType ? "3px solid white" : "none"
                    }}>
                      {isStarType && (
                        <motion.div 
                          animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          style={{ position: "absolute", inset: -8, opacity: unlocked ? 0.4 : 0.1, pointerEvents: "none" }}
                        >
                          <Sparkles size={88} color="#FFD93D" />
                        </motion.div>
                      )}

                      {rewardAvatar ? (
                        <div style={{ width: 52, height: 52, filter: unlocked ? "none" : "grayscale(0.25) opacity(0.85)", position: "relative", zIndex: 1 }}>{rewardAvatar.icon}</div>
                      ) : (
                        isStarType ? (
                          <Star size={40} strokeWidth={2.5} fill={unlocked ? "#FFF" : "#FFD93D"} color={unlocked ? "#B8860B" : "#B8860B"} style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 8px rgba(184,134,11,0.3))" }} />
                        ) : (
                          unlocked ? <CheckCircle2 size={36} strokeWidth={2.5} /> : (achievement.type === "Badge" ? <ShieldCheck size={36} strokeWidth={2.5} /> : <Sparkles size={36} strokeWidth={2.5} />)
                        )
                      )}
                      {unlocked && (
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{ position: "absolute", top: -8, right: -8, background: "white", borderRadius: "50%", padding: 3, boxShadow: "0 4px 8px rgba(0,0,0,0.1)", zIndex: 2 }}
                        >
                          <CheckCircle2 size={18} color="#58CC02" fill="#58CC02" stroke="white" />
                        </motion.div>
                      )}
                    </div>
                  );
                })()}

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ padding: "4px 8px", borderRadius: 999, background: unlocked ? "#E2F9DB" : "#F1F5F9", color: unlocked ? "#46A302" : "#7A879A", fontSize: 10, fontWeight: 900, fontFamily: "'Nunito', sans-serif" }}>
                      {unlocked ? "TERBUKA" : "TERKUNCI"}
                    </span>
                    <span style={{ padding: "4px 8px", borderRadius: 999, background: achievement.type === "Avatar" ? "#F3E8FF" : "#FFF6D6", color: achievement.type === "Avatar" ? "#9333EA" : "#B8860B", fontSize: 10, fontWeight: 900, fontFamily: "'Nunito', sans-serif" }}>
                      {rewardLabel}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 19, color: "#26324D", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ lineHeight: 1.2 }}>{achievement.name}</span>
                    {!unlocked && <Lock size={18} color="#D0D0D0" strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#6C7890", fontWeight: 800, marginTop: 6, marginBottom: 12, lineHeight: 1.45 }}>
                    {achievement.description}
                  </div>
                  <div style={{ background: unlocked ? "#F3FFF0" : "#F8FAFC", border: `1px solid ${unlocked ? "#B9F4A6" : "#E2E8F0"}`, borderRadius: 16, padding: "10px 12px", marginBottom: 14 }}>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#526078", fontWeight: 900, lineHeight: 1.4 }}>
                      {unlocked
                        ? `Hadiah ${rewardLabel.toLowerCase()} sudah bisa dipakai.`
                        : `Selesaikan ${remaining} ${mainTarget.label} lagi untuk membuka ${rewardLabel.toLowerCase()}.`}
                    </div>
                    <div style={{ fontSize: 11, color: "#8A94A8", fontWeight: 800, marginTop: 4 }}>
                      Target: {getRequirementText(achievement.targets)}
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <ProgressBar 
                      icon={mainTarget.icon}
                      color={achievement.type === "Avatar" ? "#CE82FF" : "#FFD93D"} 
                      label={mainTarget.currentLabel}
                      current={currentValue} 
                      target={mainTarget.target} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: 10,
            background: "linear-gradient(135deg, #FFF7ED 0%, #FFF1F2 100%)",
            borderRadius: 24,
            padding: "24px 20px",
            border: "2px dashed #FECACA",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(255,107,157,0.15)" }}>
            <Sparkles size={24} color="#FF6B9D" fill="#FF6B9D" />
          </div>
          <div style={{ fontFamily: "Fredoka, sans-serif", fontSize: 18, color: "#26324D", fontWeight: 700, lineHeight: 1.3 }}>
            Semangat terus ya! ✨
          </div>
          <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#6C7890", fontWeight: 800, lineHeight: 1.5 }}>
            Nanti bakalan kami kasih hadiah yang menarik lagi untukmu! Intinya terus eksplorasi ya!
          </div>
        </motion.div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

function SummaryPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: React.ReactNode; color: string }) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "9px 6px", border: "1px solid rgba(226,232,240,0.8)", textAlign: "center", minWidth: 0 }}>
      <div style={{ color, display: "flex", justifyContent: "center", marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "#26324D", fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 9, color: "#7A879A", fontWeight: 900, marginTop: 3, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
    </div>
  );
}

function ProgressBar({ icon, color, label, current, target }: { icon: React.ReactNode, color: string, label: string, current: number, target: number }) {
  const progress = Math.min(100, Math.max(0, (current / target) * 100));
  const isComplete = current >= target;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ 
        width: 32, height: 32, borderRadius: 12, background: isComplete ? "#58CC0222" : `${color}22`, color: isComplete ? "#58CC02" : color, 
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: isComplete ? "0 4px 12px rgba(88,204,2,0.1)" : "none",
        border: `1px solid ${isComplete ? "#58CC0233" : `${color}33`}`
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 900, color: "#777" }}>
          <span>{label}</span>
          <span style={{ color: isComplete ? "#58CC02" : "#999", fontSize: 13 }}>
            {Math.min(current, target)} <span style={{ fontWeight: 700, color: "#CCC", margin: "0 4px" }}>/</span> {target}
          </span>
        </div>
        <div style={{ height: 10, background: "#E2E8F0", borderRadius: 99, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)" }} />
          <motion.div 
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
            style={{ 
              height: "100%", 
              background: isComplete 
                ? "linear-gradient(90deg, #58CC02, #76D62F)" 
                : `linear-gradient(90deg, ${color}, ${color}EE)`, 
              borderRadius: 99,
              position: "relative",
              boxShadow: isComplete ? "0 0 15px rgba(88,204,2,0.4)" : `0 0 10px ${color}33`,
            }} 
          >
            {/* Glossy Overlay */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "rgba(255,255,255,0.25)", borderRadius: "99px 99px 0 0" }} />
            
            {/* Glowing Tip */}
            {progress > 0 && progress < 100 && (
              <motion.div 
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 4, background: "white", filter: "blur(2px)" }}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CHUNKY SVG ICONS FOR MISSION HEADER
// ==========================================

const ChunkyShieldGreen = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(88,204,2,0.25))" }}>
    <defs><linearGradient id="shieldGreenG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#81C784" /><stop offset="100%" stopColor="#58CC02" /></linearGradient></defs>
    <path d="M16 2 L28 6 L28 16 C28 24, 16 30, 16 30 C16 30, 4 24, 4 16 L4 6 Z" fill="url(#shieldGreenG)" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 8 L20 12 L16 16 L12 12 Z" fill="#FFF" opacity="0.8" />
  </svg>
);

const ChunkyStarGold = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(255,184,0,0.25))" }}>
    <defs><radialGradient id="starGoldG" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FFD54F" /><stop offset="100%" stopColor="#FFB800" /></radialGradient></defs>
    <path d="M16 2 L20 11 L30 13 L23 20 L24 30 L16 26 L8 30 L9 20 L2 13 L12 11 Z" fill="url(#starGoldG)" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ChunkyFlagBlue = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ filter: "drop-shadow(0 4px 6px rgba(28,176,246,0.25))" }}>
    <defs><linearGradient id="flagBlueG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4FC3F7" /><stop offset="100%" stopColor="#1CB0F6" /></linearGradient></defs>
    <rect x="8" y="2" width="4" height="28" rx="2" fill="#A0856C" />
    <path d="M12 4 L30 10 L12 16 Z" fill="url(#flagBlueG)" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
