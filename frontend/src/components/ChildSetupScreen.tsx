"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint, CheckCircle2, Loader2, Sparkles, Rocket, Star } from "lucide-react";

export interface ChildSetupProps {
  onFinish: (avatarId: string) => void;
}

export const AVATARS = [
  {
    id: "bear", label: "Beruang", bg: "#FFE0EE", ringColor: "#FF6B9D",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <circle cx="32" cy="36" r="20" fill="#FFB3D1"/>
        <circle cx="17" cy="20" r="8" fill="#FFB3D1"/>
        <circle cx="47" cy="20" r="8" fill="#FFB3D1"/>
        <circle cx="26" cy="33" r="3.5" fill="#3C3C3C"/>
        <circle cx="38" cy="33" r="3.5" fill="#3C3C3C"/>
        <circle cx="27.4" cy="31.8" r="1.2" fill="white"/>
        <circle cx="39.4" cy="31.8" r="1.2" fill="white"/>
        <ellipse cx="32" cy="40" rx="5" ry="4" fill="#FF8FAD"/>
        <path d="M29 43 Q32 46 35 43" stroke="#c06" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <ellipse cx="23" cy="38" rx="4" ry="2.5" fill="#FFB3D1" opacity="0.7"/>
        <ellipse cx="41" cy="38" rx="4" ry="2.5" fill="#FFB3D1" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: "bunny", label: "Kelinci", bg: "#EDD8FF", ringColor: "#CE82FF",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <ellipse cx="24" cy="18" rx="6" ry="14" fill="#D8B4FF"/>
        <ellipse cx="40" cy="18" rx="6" ry="14" fill="#D8B4FF"/>
        <ellipse cx="24" cy="18" rx="3.5" ry="11" fill="#FFB3D1"/>
        <ellipse cx="40" cy="18" rx="3.5" ry="11" fill="#FFB3D1"/>
        <circle cx="32" cy="38" r="18" fill="#D8B4FF"/>
        <circle cx="26" cy="36" r="3" fill="#3C3C3C"/>
        <circle cx="38" cy="36" r="3" fill="#3C3C3C"/>
        <circle cx="27.2" cy="34.8" r="1" fill="white"/>
        <circle cx="39.2" cy="34.8" r="1" fill="white"/>
        <ellipse cx="32" cy="41" rx="3.5" ry="2.5" fill="#FFB3D1"/>
        <path d="M28 43 Q32 47 36 43" stroke="#9b59b6" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: "cat", label: "Kucing", bg: "#FFF3B0", ringColor: "#FFD93D",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <polygon points="13,30 21,14 28,26" fill="#FFE080"/>
        <polygon points="51,30 43,14 36,26" fill="#FFE080"/>
        <circle cx="32" cy="36" r="18" fill="#FFE080"/>
        <circle cx="26" cy="33" r="3" fill="#3C3C3C"/>
        <circle cx="38" cy="33" r="3" fill="#3C3C3C"/>
        <circle cx="27.2" cy="31.8" r="1" fill="white"/>
        <circle cx="39.2" cy="31.8" r="1" fill="white"/>
        <ellipse cx="32" cy="39" rx="4" ry="2.5" fill="#FFB3D1"/>
        <path d="M28 42 Q32 45 36 42" stroke="#e0a000" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <line x1="16" y1="37" x2="26" y2="36" stroke="#e0a000" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="40" x2="26" y2="40" stroke="#e0a000" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="38" y1="36" x2="48" y2="37" stroke="#e0a000" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="38" y1="40" x2="48" y2="40" stroke="#e0a000" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "frog", label: "Katak", bg: "#C8F59A", ringColor: "#58CC02",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <circle cx="20" cy="20" r="9" fill="#82E05A"/>
        <circle cx="44" cy="20" r="9" fill="#82E05A"/>
        <circle cx="32" cy="37" r="20" fill="#82E05A"/>
        <circle cx="20" cy="20" r="5" fill="white"/>
        <circle cx="44" cy="20" r="5" fill="white"/>
        <circle cx="20" cy="20" r="2.5" fill="#2c7a00"/>
        <circle cx="44" cy="20" r="2.5" fill="#2c7a00"/>
        <circle cx="20.8" cy="19.2" r="0.8" fill="white"/>
        <circle cx="44.8" cy="19.2" r="0.8" fill="white"/>
        <path d="M24 42 Q32 50 40 42" stroke="#2c7a00" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: "owl", label: "Burung Hantu", bg: "#E0F7FA", ringColor: "#00BCD4", unlockBy: "avatar_super_jenius",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <circle cx="32" cy="36" r="20" fill="#4DD0E1"/>
        <circle cx="24" cy="32" r="8" fill="white"/>
        <circle cx="40" cy="32" r="8" fill="white"/>
        <circle cx="24" cy="32" r="3" fill="#3C3C3C"/>
        <circle cx="40" cy="32" r="3" fill="#3C3C3C"/>
        <path d="M30 40 L34 40 L32 44 Z" fill="#FFA000"/>
      </svg>
    ),
  },
  {
    id: "tiger", label: "Harimau", bg: "#FFF3E0", ringColor: "#FF9800", unlockBy: "avatar_petualang",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <circle cx="32" cy="36" r="20" fill="#FFB74D"/>
        <path d="M12 24 L20 28 L24 20 Z" fill="#FFB74D"/>
        <path d="M52 24 L44 28 L40 20 Z" fill="#FFB74D"/>
        <circle cx="26" cy="33" r="3" fill="#3C3C3C"/>
        <circle cx="38" cy="33" r="3" fill="#3C3C3C"/>
        <ellipse cx="32" cy="40" rx="6" ry="4" fill="#FFE0B2"/>
        <circle cx="32" cy="38" r="1.5" fill="#3C3C3C"/>
        <path d="M32 40 L32 43" stroke="#3C3C3C" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "star_avatar", label: "Si Bintang", bg: "#FFFDE7", ringColor: "#FFD93D", unlockBy: "avatar_kolektor",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <path d="M32 10 L38 25 L54 25 L41 34 L46 50 L32 40 L18 50 L23 34 L10 25 L26 25 Z" fill="#FFD93D"/>
        <circle cx="26" cy="30" r="3" fill="#3C3C3C"/>
        <circle cx="38" cy="30" r="3" fill="#3C3C3C"/>
        <path d="M28 38 Q32 42 36 38" stroke="#3C3C3C" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "dragon", label: "Naga Merah", bg: "#FCE4EC", ringColor: "#FF4081", unlockBy: "avatar_legenda",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
        <circle cx="32" cy="36" r="20" fill="#FF80AB"/>
        <path d="M18 20 Q24 10 30 20 Z" fill="#FF4081"/>
        <path d="M46 20 Q40 10 34 20 Z" fill="#FF4081"/>
        <circle cx="25" cy="30" r="3" fill="#3C3C3C"/>
        <circle cx="39" cy="30" r="3" fill="#3C3C3C"/>
        <path d="M26 42 Q32 48 38 42" stroke="#FF4081" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <circle cx="29" cy="38" r="1.5" fill="#FF4081"/>
        <circle cx="35" cy="38" r="1.5" fill="#FF4081"/>
      </svg>
    ),
  }
];

const InputField = ({ label, type, placeholder, value, onChange }: {
  label: string; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#555", fontWeight: 800, paddingLeft: 4 }}>
        {label}
      </label>
      <motion.div
        animate={{
          borderColor: focused ? "#58CC02" : "#E5E5E5",
          boxShadow: focused ? "0 0 0 4px rgba(88,204,2,0.10)" : "none",
        }}
        style={{
          background: focused ? "white" : "#F7F7F7",
          padding: "14px 18px", borderRadius: 18,
          border: "2px solid #E5E5E5",
          transition: "background 0.2s ease",
        }}
      >
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            border: "none", outline: "none", width: "100%",
            fontSize: 15, fontFamily: "'Nunito', sans-serif",
            color: "#3C3C3C", background: "transparent", fontWeight: 700,
          }}
        />
      </motion.div>
    </div>
  );
};

const RadioGroup = ({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string; onChange: (v: string) => void;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#555", fontWeight: 800, paddingLeft: 4 }}>
      {label}
    </label>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <motion.div
            key={opt}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt)}
            style={{
              padding: "11px 18px",
              background: isSelected ? "#58CC02" : "#F7F7F7",
              color: isSelected ? "white" : "#555",
              borderRadius: 20,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
              cursor: "pointer",
              border: `2px solid ${isSelected ? "#46A302" : "#E5E5E5"}`,
              boxShadow: isSelected ? "0 4px 0 #46A302" : "none",
              transition: "all 0.2s",
            }}
          >
            {opt}
          </motion.div>
        );
      })}
    </div>
  </div>
);

export function ChildSetupScreen({ onFinish }: ChildSetupProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [schoolClass, setSchoolClass] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [confusedLetters, setConfusedLetters] = useState("");
  const [language, setLanguage] = useState("");
  const [consulted, setConsulted] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAvatar = AVATARS.find(a => a.id === selectedAvatar)!;
  const isFormValid = name && age && gender && schoolClass && difficulty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onFinish(selectedAvatar);
    }, 1500);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F7F7" }}>
      <div style={{
        width: 390, height: 844, display: "flex", flexDirection: "column",
        background: "white", position: "relative", overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.20), 0 0 0 6px white, 0 0 0 9px #e8e8f0",
        borderRadius: "50px",
      }}>
        <AnimatePresence mode="wait">
            <motion.div
              key="setup-form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
            >
              {/* Header */}
              <div style={{
                background: "linear-gradient(155deg, #f9f0ff 0%, #edd8ff 100%)",
                padding: "56px 28px 24px", position: "relative", overflow: "hidden",
              }}>
                <motion.div
                  animate={{ x: [0, 12, -6, 0], y: [0, -8, 5, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", top: "-20%", right: "-15%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(206,130,255,0.2) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(12px)" }}
                />
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#888", fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={15} color="#CE82FF" /> Langkah Terakhir
                </div>
                <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 38, color: "#3C3C3C", margin: 0, lineHeight: 1.1 }}>
                  Profil Si Kecil
                </h1>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "#777", fontWeight: 700, marginTop: 6 }}>
                  Lengkapi data untuk pengalaman yang personal!
                </p>
              </div>

              {/* Scrollable form */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                <form id="child-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Avatar selection */}
                  <div style={{ background: "#F9F9F9", borderRadius: 24, padding: "18px", border: "2px solid #F0F0F0" }}>
                    <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: "#3C3C3C", marginBottom: 14, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <PawPrint size={20} color="#CE82FF" /> Pilih Karakter!
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 22, padding: "12px 14px", marginBottom: 14, boxShadow: "inset 0 0 0 2px #F0F0F0" }}>
                      <div style={{ width: 68, height: 68, borderRadius: 22, background: activeAvatar.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 5px 0 ${activeAvatar.ringColor}55`, flexShrink: 0 }}>
                        <div style={{ width: 52, height: 52 }}>{activeAvatar.icon}</div>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#888", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.4 }}>Karakter terpilih</div>
                        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 20, color: activeAvatar.ringColor, lineHeight: 1.1 }}>{activeAvatar.label}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                      {AVATARS.filter(a => !a.unlockBy).map((avatar) => {
                        const isSel = selectedAvatar === avatar.id;
                        return (
                          <motion.button
                            key={avatar.id}
                            type="button"
                            animate={isSel ? { scale: 1.03, y: -2 } : { scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedAvatar(avatar.id)}
                            style={{
                              width: "100%", aspectRatio: "1 / 1",
                              borderRadius: 22, background: avatar.bg,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              border: `3px solid ${isSel ? avatar.ringColor : "transparent"}`,
                              boxShadow: isSel ? `0 5px 0 ${avatar.ringColor}, 0 10px 18px ${avatar.ringColor}44` : "0 4px 0 #E0E0E0, 0 8px 14px rgba(0,0,0,0.05)",
                              cursor: "pointer", opacity: isSel ? 1 : 0.72,
                              position: "relative", overflow: "hidden",
                            }}
                          >
                            <div style={{ width: 44, height: 44, position: "relative", zIndex: 2 }}>{avatar.icon}</div>
                            {isSel && (
                                <motion.div layoutId="avatarGlow" style={{ position: "absolute", inset: -8, borderRadius: 28, background: avatar.ringColor, opacity: 0.18, filter: "blur(6px)", pointerEvents: "none", zIndex: 1 }} />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    <div style={{ textAlign: "center", marginTop: 12, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: activeAvatar.ringColor, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <CheckCircle2 size={14} /> {activeAvatar.label} dipilih
                    </div>
                  </div>

                  {/* Required data */}
                  <div style={{ background: "#F9F9F9", borderRadius: 24, padding: "20px", border: "2px solid #F0F0F0", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: "#3C3C3C", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#58CC02", color: "white", borderRadius: 12, padding: "2px 10px", fontSize: 13, fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>Wajib</span>
                      Data Anak
                    </div>
                    <InputField label="Nama Panggilan" type="text" placeholder="Contoh: Budi" value={name} onChange={(e) => setName(e.target.value)} />
                    <InputField label="Umur (Tahun)" type="number" placeholder="Contoh: 7" value={age} onChange={(e) => setAge(e.target.value)} />
                    <RadioGroup label="Jenis Kelamin" options={["Laki-laki", "Perempuan"]} selected={gender} onChange={setGender} />
                    <InputField label="Kelas Sekolah" type="text" placeholder="Contoh: Kelas 1 SD" value={schoolClass} onChange={(e) => setSchoolClass(e.target.value)} />
                    <RadioGroup label="Pernah kesulitan membaca?" options={["Ya", "Tidak", "Belum yakin"]} selected={difficulty} onChange={setDifficulty} />
                  </div>

                  {/* Optional data */}
                  <div style={{ background: "#F9F9F9", borderRadius: 24, padding: "20px", border: "2px solid #F0F0F0", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18, color: "#3C3C3C", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#F0F0F0", color: "#888", borderRadius: 12, padding: "2px 10px", fontSize: 13, fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>Opsional</span>
                      Info Tambahan
                    </div>
                    <InputField label="Huruf yang sering tertukar" type="text" placeholder="b & d, p & q, atau angka" value={confusedLetters} onChange={(e) => setConfusedLetters(e.target.value)} />
                    <InputField label="Bahasa sehari-hari" type="text" placeholder="Contoh: Bahasa Indonesia" value={language} onChange={(e) => setLanguage(e.target.value)} />
                    <RadioGroup label="Pernah konsultasi guru/psikolog?" options={["Ya", "Tidak"]} selected={consulted} onChange={setConsulted} />
                    <InputField label="Hobi atau kesukaan anak" type="text" placeholder="Contoh: Menggambar, Dinosaurus" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
                  </div>

                  <div style={{ height: 8 }} />
                </form>
              </div>

              {/* Submit button */}
              <div style={{ padding: "16px 24px 36px", background: "white", borderTop: "1.5px solid #F0F0F0" }}>
                <motion.button
                  form="child-form" type="submit"
                  whileTap={{ scale: 0.97, y: 5 }} whileHover={{ scale: 1.02 }}
                  disabled={isSubmitting || !isFormValid}
                  style={{
                    width: "100%", padding: "18px 24px", borderRadius: 22,
                    background: (isSubmitting || !isFormValid) ? "#CCCCCC" : "#58CC02",
                    border: "none", color: "white",
                    fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20,
                    boxShadow: (isSubmitting || !isFormValid) ? "none" : "0 8px 0 #46A302, 0 16px 24px rgba(88,204,2,0.25)",
                    cursor: (isSubmitting || !isFormValid) ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  }}
                >
                  {isSubmitting ? (
                    <><Loader2 size={22} style={{ animation: "spinSun 1s linear infinite" }} /> Menyimpan...</>
                  ) : (
                    <>Mulai Petualangan! <Rocket size={20} /></>
                  )}
                </motion.button>
              </div>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
