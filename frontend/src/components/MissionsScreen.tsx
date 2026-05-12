"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Sparkles, CheckCircle2, Lock, Target, Flag, Zap } from "lucide-react";
import { ACHIEVEMENTS, UserStats, isAchievementUnlocked } from "@/lib/achievements";
import { AVATARS } from "./ChildSetupScreen";

interface MissionsScreenProps {
  stats: UserStats;
}

export function MissionsScreen({ stats }: MissionsScreenProps) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F7F7", overflowY: "auto", paddingBottom: 140, position: "relative" }}>
      <div style={{
        background: "linear-gradient(155deg, #FFF0F5 0%, #FFE0EE 100%)",
        padding: "110px 24px 36px", position: "relative",
        borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
        boxShadow: "0 12px 32px rgba(255,107,157,0.12)"
      }}>
        {/* Decorative Floating Accents */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "30%", left: "5%", opacity: 0.15, pointerEvents: "none" }}
        >
          <Target size={200} color="#FF6B9D" />
        </motion.div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2, textAlign: "center" }}>
          <div style={{ position: "relative", marginBottom: 24 }}>
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 100, height: 100, borderRadius: 32, background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px rgba(255,107,157,0.22)", border: "4px solid white" }}
            >
              <div style={{ position: "relative" }}>
                <Target size={50} color="#FF6B9D" strokeWidth={2.5} />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ position: "absolute", top: -12, right: -12 }}
                >
                  <Sparkles size={22} color="#FFD93D" fill="#FFD93D" />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 32, color: "#3C3C3C", margin: 0, lineHeight: 1 }}>
            Daftar Misi
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#999", fontWeight: 700, marginTop: 12, maxWidth: "80%" }}>
            Selesaikan tantangan ini untuk mendapatkan hadiah eksklusif!
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        {ACHIEVEMENTS.map((achievement, index) => {
          const unlocked = isAchievementUnlocked(achievement, stats);
          const rewardAvatar = AVATARS.find(a => a.id === achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
              whileHover={{ y: -4 }}
              style={{
                background: "white", borderRadius: 28, padding: "24px",
                boxShadow: unlocked ? "0 12px 32px rgba(88,204,2,0.12)" : "0 8px 24px rgba(0,0,0,0.04)",
                border: `3px solid ${unlocked ? "#58CC02" : "#F8F8F8"}`,
                position: "relative", overflow: "hidden"
              }}
            >
              {unlocked && (
                <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: "#E2F9DB", borderRadius: "50%", zIndex: 0, opacity: 0.6 }} />
              )}
              
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                {/* Icon Container */}
                {(() => {
                  const isStarType = achievement.id.includes("star") || achievement.id.includes("kolektor") || achievement.id.includes("cemerlang");
                  
                  return (
                    <div style={{
                      width: 72, height: 72, borderRadius: 24, flexShrink: 0,
                      background: isStarType 
                        ? (unlocked ? "linear-gradient(135deg, #FFD93D, #FFB300)" : "linear-gradient(135deg, #FFF9C4, #FFF176)")
                        : (unlocked && !rewardAvatar ? "linear-gradient(135deg, #58CC02, #46A302)" : (rewardAvatar ? rewardAvatar.bg : "#FFF8E1")),
                      color: isStarType ? "#B8860B" : (unlocked ? "white" : achievement.type === "Badge" ? "#FFD93D" : "#CE82FF"),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: isStarType 
                        ? `0 12px 24px ${unlocked ? "rgba(255,217,61,0.4)" : "rgba(255,217,61,0.1)"}, inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -4px 0 rgba(0,0,0,0.1)`
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
                        <div style={{ width: 56, height: 56, filter: unlocked ? "none" : "opacity(0.85)", position: "relative", zIndex: 1 }}>{rewardAvatar.icon}</div>
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
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: "#3C3C3C", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ lineHeight: 1.2 }}>{achievement.name}</span>
                    {!unlocked && <Lock size={18} color="#D0D0D0" strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#888", fontWeight: 700, marginTop: 6, marginBottom: 16, lineHeight: 1.4 }}>
                    {achievement.description}
                  </div>

                  {/* Progress Bars */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {achievement.targets.total_stars > 0 && (
                      <ProgressBar 
                        icon={<Star size={12} fill="currentColor" strokeWidth={2.5} />} 
                        color="#FFD93D" 
                        label="Bintang" 
                        current={stats.total_stars} 
                        target={achievement.targets.total_stars} 
                      />
                    )}
                    {achievement.targets.missions_completed > 0 && (
                      <ProgressBar 
                        icon={<Flag size={12} fill="currentColor" strokeWidth={2.5} />} 
                        color="#1CB0F6" 
                        label="Misi" 
                        current={stats.missions_completed} 
                        target={achievement.targets.missions_completed} 
                      />
                    )}
                    {achievement.targets.perfect_missions > 0 && (
                      <ProgressBar 
                        icon={<Zap size={12} fill="currentColor" strokeWidth={2.5} />} 
                        color="#CE82FF" 
                        label="Misi Sempurna" 
                        current={stats.perfect_missions} 
                        target={achievement.targets.perfect_missions} 
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div style={{ height: 40 }} />
      </div>
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
        <div style={{ height: 14, background: "#F0F0F0", borderRadius: 99, padding: 2, border: "1.5px solid #EAEAEA" }}>
          <div style={{ height: "100%", width: "100%", borderRadius: 99, overflow: "hidden", position: "relative" }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.1 }}
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
    </div>
  );
}
