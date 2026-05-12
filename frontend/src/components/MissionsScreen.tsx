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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F7F7", overflowY: "auto", paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(155deg, #FFF0F5 0%, #FFE0EE 100%)",
        padding: "48px 24px 24px", position: "relative", overflow: "hidden",
        borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
        boxShadow: "0 8px 24px rgba(255,107,157,0.15)"
      }}>
        <motion.div
          animate={{ x: [0, 12, -6, 0], y: [0, -8, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-20%", right: "-15%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,157,0.15) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(12px)" }}
        />
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(255,107,157,0.2)", marginBottom: 16 }}>
            <Target size={40} color="#FF6B9D" />
          </div>
          
          <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 32, color: "#3C3C3C", margin: 0, lineHeight: 1.1 }}>
            Daftar Misi
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#777", fontWeight: 800, marginTop: 8 }}>
            Selesaikan tantangan di bawah ini untuk mendapatkan hadiah eksklusif!
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {ACHIEVEMENTS.map((achievement, index) => {
          const unlocked = isAchievementUnlocked(achievement, stats);
          const rewardAvatar = AVATARS.find(a => a.unlockBy === achievement.id);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: "white", borderRadius: 24, padding: "20px",
                boxShadow: unlocked ? "0 8px 24px rgba(88,204,2,0.15)" : "0 4px 16px rgba(0,0,0,0.05)",
                border: `3px solid ${unlocked ? "#58CC02" : "transparent"}`,
                position: "relative", overflow: "hidden"
              }}
            >
              {unlocked && (
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "#E2F9DB", borderRadius: "50%", zIndex: 0 }} />
              )}
              
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                {/* Icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                  background: unlocked && !rewardAvatar ? "#58CC02" : (rewardAvatar ? rewardAvatar.bg : "#FFF8E1"),
                  color: unlocked ? "white" : achievement.type === "Badge" ? "#FFD93D" : "#CE82FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: unlocked ? "0 4px 12px rgba(88,204,2,0.3)" : "none",
                  position: "relative"
                }}>
                  {rewardAvatar ? (
                    <div style={{ width: 44, height: 44, filter: unlocked ? "none" : "grayscale(100%) opacity(0.7)" }}>{rewardAvatar.icon}</div>
                  ) : (
                    unlocked ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />
                  )}
                  {unlocked && rewardAvatar && (
                    <div style={{ position: "absolute", top: -4, right: -4, background: "white", borderRadius: "50%", padding: 2 }}>
                      <CheckCircle2 size={16} color="#58CC02" fill="#58CC02" stroke="white" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: "#3C3C3C", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {achievement.name}
                    {!unlocked && <Lock size={16} color="#CCC" />}
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#888", fontWeight: 700, marginTop: 4, marginBottom: 12 }}>
                    {achievement.description}
                  </div>

                  {/* Progress Bars */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {achievement.targets.total_stars > 0 && (
                      <ProgressBar 
                        icon={<Star size={12} fill="currentColor" />} 
                        color="#FFD93D" 
                        label="Bintang" 
                        current={stats.total_stars} 
                        target={achievement.targets.total_stars} 
                      />
                    )}
                    {achievement.targets.missions_completed > 0 && (
                      <ProgressBar 
                        icon={<Flag size={12} fill="currentColor" />} 
                        color="#1CB0F6" 
                        label="Misi Selesai" 
                        current={stats.missions_completed} 
                        target={achievement.targets.missions_completed} 
                      />
                    )}
                    {achievement.targets.perfect_missions > 0 && (
                      <ProgressBar 
                        icon={<Zap size={12} fill="currentColor" />} 
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
      </div>
    </div>
  );
}

function ProgressBar({ icon, color, label, current, target }: { icon: React.ReactNode, color: string, label: string, current: number, target: number }) {
  const progress = Math.min(100, Math.max(0, (current / target) * 100));
  const isComplete = current >= target;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ 
        width: 24, height: 24, borderRadius: "50%", background: `${color}22`, color: color, 
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, color: "#888" }}>
          <span>{label}</span>
          <span style={{ color: isComplete ? "#58CC02" : "#888" }}>{Math.min(current, target)} / {target}</span>
        </div>
        <div style={{ height: 8, background: "#F0F0F0", borderRadius: 4, overflow: "hidden" }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
            style={{ height: "100%", background: isComplete ? "#58CC02" : color, borderRadius: 4 }} 
          />
        </div>
      </div>
    </div>
  );
}
