"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trophy, Sparkles, CheckCircle2, ShieldCheck, PawPrint, Lock } from "lucide-react";
import { AVATARS } from "./ChildSetupScreen";
import { evaluateAchievements, UserStats, UnlockedReward } from "@/lib/achievements";

interface ChildProfileProps {
  userName: string;
  setUserName: (name: string) => void;
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
  stats: UserStats;
}

export function ChildProfile({ userName, setUserName, userAvatar, setUserAvatar, stats }: ChildProfileProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "achievements">("profile");
  const [tempName, setTempName] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);

  // Get unlocked achievements
  const unlockedRewards = evaluateAchievements(stats);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F7F7", overflowY: "auto", paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(155deg, #f0fde4 0%, #d7f5b1 100%)",
        padding: "48px 24px 24px", position: "relative", overflow: "hidden",
        borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
        boxShadow: "0 8px 24px rgba(88,204,2,0.15)"
      }}>
        <motion.div
          animate={{ x: [0, 12, -6, 0], y: [0, -8, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-20%", right: "-15%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(88,204,2,0.15) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(12px)" }}
        />
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(88,204,2,0.2)", position: "relative", marginBottom: 16 }}>
            <div style={{ width: 64, height: 64 }}>
              {AVATARS.find(a => a.id === userAvatar)?.icon || <PawPrint size={48} color="#58CC02" />}
            </div>
            <div style={{ position: "absolute", bottom: -5, right: -5, background: "#FFD93D", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid white", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <Trophy size={18} color="white" fill="white" />
            </div>
          </div>
          
          {isEditingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                style={{
                  fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 24, color: "#3C3C3C",
                  background: "white", border: "2px solid #58CC02", borderRadius: 16, padding: "8px 16px",
                  textAlign: "center", width: 180, outline: "none"
                }}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setIsEditingName(true)}>
              <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: "#3C3C3C", margin: 0, lineHeight: 1.1 }}>
                {userName || "Pemain"}
              </h1>
              <span style={{ fontSize: 14, color: "#58CC02" }}>✎</span>
            </div>
          )}
          
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#777", fontWeight: 800, marginTop: 4, display: "flex", gap: 16 }}>
            <span>⭐ {stats.total_stars} Bintang</span>
            <span>🎯 {stats.missions_completed} Misi</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", padding: "20px 24px 0", gap: 12 }}>
        <button
          onClick={() => setActiveTab("profile")}
          style={{
            flex: 1, padding: "12px", borderRadius: 20, border: "none", cursor: "pointer",
            background: activeTab === "profile" ? "#58CC02" : "#E8E8E8",
            color: activeTab === "profile" ? "white" : "#888",
            fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: activeTab === "profile" ? "0 4px 0 #46A302" : "none",
            transition: "all 0.2s"
          }}
        >
          <User size={18} /> Profil
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          style={{
            flex: 1, padding: "12px", borderRadius: 20, border: "none", cursor: "pointer",
            background: activeTab === "achievements" ? "#FFD93D" : "#E8E8E8",
            color: activeTab === "achievements" ? "white" : "#888",
            fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: activeTab === "achievements" ? "0 4px 0 #D9B320" : "none",
            transition: "all 0.2s"
          }}
        >
          <Trophy size={18} /> Pencapaian
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "24px", flex: 1 }}>
        <AnimatePresence mode="wait">
          {activeTab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div style={{ background: "white", borderRadius: 24, padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: "#3C3C3C", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={20} color="#CE82FF" /> Pilih Avatar
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  {AVATARS.map((avatar) => {
                    const isLocked = avatar.unlockBy && !unlockedRewards.some(r => r.id === avatar.unlockBy);
                    const isSel = userAvatar === avatar.id && !isLocked;
                    return (
                      <motion.button
                        key={avatar.id}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        onClick={() => { if (!isLocked) setUserAvatar(avatar.id); }}
                        style={{
                          borderRadius: 20, padding: "16px",
                          background: isLocked ? "#F5F5F5" : avatar.bg, border: `3px solid ${isSel ? avatar.ringColor : "transparent"}`,
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                          boxShadow: isSel ? `0 6px 0 ${avatar.ringColor}` : "0 4px 0 #E0E0E0",
                          cursor: isLocked ? "not-allowed" : "pointer", position: "relative",
                          opacity: isLocked ? 0.6 : (isSel ? 1 : 0.7)
                        }}
                      >
                        <div style={{ width: 48, height: 48, filter: isLocked ? "grayscale(100%) opacity(0.5)" : "none" }}>{avatar.icon}</div>
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: isLocked ? "#999" : (isSel ? avatar.ringColor : "#666") }}>
                          {avatar.label}
                        </span>
                        {isLocked && (
                          <div style={{ position: "absolute", top: 8, right: 8, color: "#999" }}>
                            <Lock size={16} />
                          </div>
                        )}
                        {isSel && !isLocked && (
                          <div style={{ position: "absolute", top: -8, right: -8, background: "#58CC02", color: "white", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                            <CheckCircle2 size={14} />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#888", fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
                Kumpulkan bintang dan selesaikan misi untuk membuka lebih banyak pencapaian!
              </div>

              {unlockedRewards.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: 24, border: "2px dashed #E0E0E0" }}>
                  <ShieldCheck size={48} color="#D0D0D0" style={{ margin: "0 auto 16px" }} />
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: "#888" }}>Belum ada pencapaian</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#AAA", marginTop: 8 }}>Ayo mainkan misi untuk mendapatkan badge pertamamu!</div>
                </div>
              ) : (
                unlockedRewards.map((reward, i) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{
                      background: "white", borderRadius: 20, padding: "16px",
                      display: "flex", gap: 16, alignItems: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "2px solid #F0F0F0"
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                      background: reward.type === "Badge" ? "#FFF8E1" : "#F3E5F5",
                      color: reward.type === "Badge" ? "#FFD93D" : "#CE82FF",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {reward.type === "Badge" ? <ShieldCheck size={32} /> : <Sparkles size={32} />}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: "#3C3C3C" }}>{reward.name}</div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#888", fontWeight: 700, marginTop: 2 }}>{reward.message}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
