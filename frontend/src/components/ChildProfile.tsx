"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trophy, Sparkles, CheckCircle2, ShieldCheck, PawPrint, Lock, Star, Target, Pencil } from "lucide-react";
import { AVATARS } from "./ChildSetupScreen";
import { evaluateAchievements, UserStats } from "@/lib/achievements";

interface ChildProfileProps {
  userName: string;
  setUserName: (name: string) => void;
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
  stats: UserStats;
  initialTab?: "profile" | "achievements";
}

export function ChildProfile({ userName, setUserName, userAvatar, setUserAvatar, stats, initialTab }: ChildProfileProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "achievements">(initialTab || "profile");
  const [tempName, setTempName] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);

  // Sync tab when initialTab prop changes (e.g. from side drawer navigation)
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Get unlocked achievements
  const unlockedRewards = evaluateAchievements(stats);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7FAFC", overflowY: "auto", overflowX: "hidden", paddingBottom: 140, position: "relative", width: "100%" }}>
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(155deg, #ECFFE2 0%, #D8F8B9 58%, #E9F6FF 100%)",
        padding: "104px 24px 52px", position: "relative",
        minHeight: 374,
        boxSizing: "border-box",
        borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
        boxShadow: "0 14px 34px rgba(80,94,120,0.12)",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -70, width: 210, height: 210, borderRadius: "50%", background: "rgba(255,107,157,0.14)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -60, width: 190, height: 190, borderRadius: "50%", background: "rgba(88,204,2,0.13)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 86, left: 34, width: 54, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.55)", pointerEvents: "none" }} />
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
          {/* Avatar Container */}
          <div style={{ position: "relative", marginBottom: 24 }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              style={{ 
                width: 106, height: 106, borderRadius: 34, background: "white", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                boxShadow: "0 18px 38px rgba(88,204,2,0.20), 0 8px 18px rgba(28,176,246,0.10)", 
                border: "4px solid white", position: "relative", zIndex: 2 
              }}
            >
              <div style={{ width: 68, height: 68 }}>
                {AVATARS.find(a => a.id === userAvatar)?.icon || <PawPrint size={50} color="#58CC02" />}
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                position: "absolute", bottom: -6, right: -6, 
                background: "linear-gradient(135deg, #FFD93D, #FF9F43)", width: 40, height: 40, borderRadius: 15, 
                display: "flex", alignItems: "center", justifyContent: "center", 
                border: "4px solid white", boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                zIndex: 3
              }}
            >
              <Trophy size={18} color="white" fill="white" />
            </motion.div>
          </div>
          
          {isEditingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                style={{
                  fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: "#3C3C3C",
                  background: "white", border: "3px solid #58CC02", borderRadius: 20, padding: "10px 16px",
                  textAlign: "center", width: 220, outline: "none", boxShadow: "0 10px 24px rgba(88,204,2,0.14)"
                }}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              />
            </div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }} 
              onClick={() => setIsEditingName(true)}
            >
              <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 34, color: "#26324D", margin: 0, lineHeight: 1 }}>
                {userName || "Pemain"}
              </h1>
              <div style={{ background: "white", padding: "7px 13px", borderRadius: 999, color: "#58CC02", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 6px 16px rgba(88,204,2,0.14)", border: "1px solid rgba(88,204,2,0.14)" }}>
                <span style={{ fontSize: 13, fontWeight: 900, fontFamily: "'Nunito', sans-serif" }}>Ganti Nama</span>
                <Pencil size={14} strokeWidth={2.5} />
              </div>
            </motion.div>
          )}
          
          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.84)", padding: "8px 16px", borderRadius: 99, display: "flex", alignItems: "center", gap: 7, border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 6px 16px rgba(80,94,120,0.06)" }}>
              <Star size={16} color="#FFD93D" fill="#FFD93D" strokeWidth={2.5} />
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#3C4A66", fontWeight: 900 }}>{stats.total_stars}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.84)", padding: "8px 16px", borderRadius: 99, display: "flex", alignItems: "center", gap: 7, border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 6px 16px rgba(80,94,120,0.06)" }}>
              <Target size={16} color="#58CC02" strokeWidth={2.5} />
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#3C4A66", fontWeight: 900 }}>{stats.missions_completed} Misi</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ padding: "36px 24px 0", width: "100%", boxSizing: "border-box" }}>
        <div style={{ 
          display: "flex", 
          background: "#EAF0F7", 
          borderRadius: 24, 
          padding: 6,
          position: "relative",
          boxShadow: "inset 0 0 0 1px #E2E8F0",
        }}>
          <motion.div
            layoutId="tab-indicator"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            style={{
              position: "absolute",
              top: 6, bottom: 6,
              left: activeTab === "profile" ? 6 : "50%",
              width: "calc(50% - 6px)",
              background: activeTab === "profile" ? "#58CC02" : "#FFD93D",
              borderRadius: 20,
              boxShadow: `0 8px 20px ${activeTab === "profile" ? "rgba(88,204,2,0.3)" : "rgba(255,217,61,0.3)"}`,
              zIndex: 1
            }}
          />
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              flex: 1, padding: "14px", borderRadius: 20, border: "none", cursor: "pointer",
              background: "transparent",
              color: activeTab === "profile" ? "white" : "#888",
              fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              position: "relative", zIndex: 2, transition: "color 0.2s"
            }}
          >
            <User size={20} /> Profil
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            style={{
              flex: 1, padding: "14px", borderRadius: 20, border: "none", cursor: "pointer",
              background: "transparent",
              color: activeTab === "achievements" ? "white" : "#888",
              fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              position: "relative", zIndex: 2, transition: "color 0.2s"
            }}
          >
            <Trophy size={20} /> Pencapaian
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "28px 24px 24px", flex: 1, width: "100%", boxSizing: "border-box" }}>
        <AnimatePresence mode="wait">
          {activeTab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div style={{ background: "white", borderRadius: 30, padding: "20px", boxShadow: "0 12px 30px rgba(31,41,55,0.07)", border: "1.5px solid #EEF2F7" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: "#26324D", display: "flex", alignItems: "center", gap: 8 }}>
                      <Sparkles size={20} color="#CE82FF" /> Ganti Profil
                    </div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: "#8A94A8", marginTop: 4 }}>
                      Pilih avatar favorit si kecil.
                    </div>
                  </div>
                  <div style={{ padding: "6px 10px", borderRadius: 999, background: "#F3E8FF", color: "#9333EA", fontSize: 11, fontWeight: 900, fontFamily: "'Nunito', sans-serif", whiteSpace: "nowrap" }}>
                    {unlockedRewards.length} hadiah
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  {AVATARS.map((avatar) => {
                    const isLocked = avatar.unlockBy && !unlockedRewards.some(r => r.id === avatar.unlockBy);
                    const isSel = userAvatar === avatar.id && !isLocked;
                    return (
                      <motion.button
                        key={avatar.id}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        onClick={() => { if (!isLocked) setUserAvatar(avatar.id); }}
                        style={{
                          minHeight: 142,
                          borderRadius: 26, padding: "14px 10px 16px",
                          background: isLocked ? "#F8FAFC" : `linear-gradient(155deg, ${avatar.bg} 0%, #FFFFFF 84%)`, border: `2.5px solid ${isSel ? avatar.ringColor : "#EEF2F7"}`,
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                          boxShadow: isSel ? `0 7px 0 ${avatar.ringColor}, 0 14px 24px ${avatar.ringColor}24` : "0 5px 0 #E6ECF3, 0 10px 18px rgba(31,41,55,0.04)",
                          cursor: isLocked ? "not-allowed" : "pointer", position: "relative",
                          opacity: isLocked ? 0.64 : 1,
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ position: "absolute", top: -28, right: -28, width: 74, height: 74, borderRadius: "50%", background: isSel ? `${avatar.ringColor}20` : "rgba(255,255,255,0.55)", pointerEvents: "none" }} />
                        <div style={{ width: 64, height: 64, borderRadius: 22, background: isLocked ? "#FFFFFFAA" : "rgba(255,255,255,0.78)", display: "flex", alignItems: "center", justifyContent: "center", filter: isLocked ? "grayscale(0.3) opacity(0.85)" : "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.8)", position: "relative", zIndex: 1 }}>
                          <div style={{ width: 50, height: 50 }}>{avatar.icon}</div>
                        </div>
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 14, color: isLocked ? "#667085" : (isSel ? avatar.ringColor : "#526078"), position: "relative", zIndex: 1 }}>
                          {avatar.label}
                        </span>
                        {!isLocked && (
                          <span style={{ fontSize: 10, fontWeight: 900, color: isSel ? avatar.ringColor : "#9AA4B2", fontFamily: "'Nunito', sans-serif", background: isSel ? `${avatar.ringColor}14` : "#F8FAFC", padding: "4px 8px", borderRadius: 999, position: "relative", zIndex: 1 }}>
                            {isSel ? "Sedang dipakai" : "Pilih avatar"}
                          </span>
                        )}
                        {isLocked && (
                          <div style={{ position: "absolute", top: 8, right: 8, color: "#999", background: "white", borderRadius: "50%", padding: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <Lock size={12} />
                          </div>
                        )}
                        {isSel && !isLocked && (
                          <div style={{ position: "absolute", top: 10, right: 10, background: avatar.ringColor, color: "white", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: `0 4px 10px ${avatar.ringColor}40`, zIndex: 2 }}>
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
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#888", fontWeight: 800, textAlign: "center", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Kumpulkan bintang dan selesaikan misi!
              </div>

              {unlockedRewards.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 24px", background: "white", borderRadius: 32, boxShadow: "0 12px 32px rgba(0,0,0,0.04)", border: "2px solid #F0F0F0" }}>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 100, height: 100, margin: "0 auto 24px", background: "#F5F5F5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <ShieldCheck size={56} color="#D0D0D0" />
                  </motion.div>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: "#3C3C3C" }}>Belum Ada Koleksi</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#999", marginTop: 12, fontWeight: 700, lineHeight: 1.5 }}>
                    Wah, petualanganmu baru saja dimulai! Ayo mainkan misi untuk mendapatkan badge pertamamu!
                  </div>
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    style={{ marginTop: 24, padding: "14px 24px", background: "#FFD93D", borderRadius: 20, color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, boxShadow: "0 6px 0 #D9B320", display: "inline-block", cursor: "pointer" }}
                  >
                    Mulai Belajar!
                  </motion.div>
                </div>
              ) : (
                unlockedRewards.map((reward, i) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    style={{
                      background: "white", borderRadius: 28, padding: "20px",
                      display: "flex", gap: 18, alignItems: "center",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.04)", border: "2px solid #F8F8F8",
                      position: "relative", overflow: "hidden"
                    }}
                  >
                    <div style={{
                      width: 64, height: 64, borderRadius: 20, flexShrink: 0,
                      background: reward.type === "Badge" ? "linear-gradient(135deg, #FFF8E1, #FFECB3)" : "linear-gradient(135deg, #F3E5F5, #E1BEE7)",
                      color: reward.type === "Badge" ? "#FFD93D" : "#CE82FF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 8px 16px ${reward.type === "Badge" ? "rgba(255,217,61,0.2)" : "rgba(206,130,255,0.2)"}`
                    }}>
                      {reward.type === "Badge" ? <ShieldCheck size={36} /> : <Sparkles size={36} />}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: "#3C3C3C" }}>{reward.name}</div>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#888", fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>{reward.message}</div>
                    </div>
                    <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, background: reward.type === "Badge" ? "#FFF8E1" : "#F3E5F5", borderRadius: "50%", opacity: 0.5 }} />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
