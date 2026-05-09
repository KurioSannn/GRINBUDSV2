"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChildSetupProps {
  onFinish: () => void;
}

const AVATARS = [
  {
    id: "bear",
    bg: "#FFB3D1",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="36" r="20" fill="white"/>
        <circle cx="16" cy="20" r="8" fill="white"/>
        <circle cx="48" cy="20" r="8" fill="white"/>
        <circle cx="26" cy="34" r="3" fill="#6C5CE7"/>
        <circle cx="38" cy="34" r="3" fill="#6C5CE7"/>
        <path d="M32 40 Q 32 44 38 44" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M32 40 Q 32 44 26 44" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="32" cy="38" r="4" fill="#6C5CE7"/>
      </svg>
    )
  },
  {
    id: "bunny",
    bg: "#A29BFE",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <ellipse cx="24" cy="20" rx="6" ry="14" fill="white"/>
        <ellipse cx="40" cy="20" rx="6" ry="14" fill="white"/>
        <circle cx="32" cy="38" r="18" fill="white"/>
        <circle cx="26" cy="36" r="2.5" fill="#6C5CE7"/>
        <circle cx="38" cy="36" r="2.5" fill="#6C5CE7"/>
        <circle cx="32" cy="40" r="3" fill="#FFB3D1"/>
        <path d="M28 42 Q 32 46 36 42" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    )
  },
  {
    id: "cat",
    bg: "#FFD93D",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <polygon points="12,30 20,14 28,24" fill="white"/>
        <polygon points="52,30 44,14 36,24" fill="white"/>
        <circle cx="32" cy="36" r="18" fill="white"/>
        <circle cx="26" cy="34" r="2.5" fill="#6C5CE7"/>
        <circle cx="38" cy="34" r="2.5" fill="#6C5CE7"/>
        <polygon points="32,40 29,37 35,37" fill="#FFB3D1"/>
        <path d="M22 38 L 14 36 M 22 40 L 14 42 M 42 38 L 50 36 M 42 40 L 50 42" stroke="#6C5CE7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: "frog",
    bg: "#00CEC9",
    icon: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="22" cy="22" r="8" fill="white"/>
        <circle cx="42" cy="22" r="8" fill="white"/>
        <circle cx="32" cy="36" r="20" fill="white"/>
        <circle cx="22" cy="22" r="3" fill="#00B894"/>
        <circle cx="42" cy="22" r="3" fill="#00B894"/>
        <path d="M24 40 Q 32 48 40 40" stroke="#00B894" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <circle cx="20" cy="34" r="3" fill="#FFB3D1"/>
        <circle cx="44" cy="34" r="3" fill="#FFB3D1"/>
      </svg>
    )
  }
];

const InputField = ({ label, type, placeholder, value, onChange }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.95)", fontWeight: 800, paddingLeft: 4 }}>
      {label}
    </label>
    <div style={{
      display: "flex", alignItems: "center", background: "rgba(255,255,255,0.15)",
      padding: "16px 20px", borderRadius: 20, border: "2px solid rgba(255,255,255,0.3)"
    }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          border: "none", outline: "none", width: "100%", fontSize: 16,
          fontFamily: "'Nunito', sans-serif", color: "white", background: "transparent", fontWeight: 700
        }}
      />
    </div>
  </div>
);

const RadioGroup = ({ label, options, selected, onChange }: any) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.95)", fontWeight: 800, paddingLeft: 4 }}>
      {label}
    </label>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt: string) => {
        const isSelected = selected === opt;
        return (
          <div
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "12px 16px",
              background: isSelected ? "white" : "rgba(255,255,255,0.15)",
              color: isSelected ? "#6C5CE7" : "rgba(255,255,255,0.9)",
              borderRadius: 20,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              border: isSelected ? "2px solid white" : "2px solid rgba(255,255,255,0.3)",
              boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s"
            }}
          >
            {opt}
          </div>
        );
      })}
    </div>
  </div>
);

export function ChildSetupScreen({ onFinish }: ChildSetupProps) {
  // Data Wajib
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [schoolClass, setSchoolClass] = useState("");
  const [difficulty, setDifficulty] = useState("");
  
  // Data Pendukung
  const [confusedLetters, setConfusedLetters] = useState("");
  const [language, setLanguage] = useState("");
  const [consulted, setConsulted] = useState("");
  const [hobbies, setHobbies] = useState("");

  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeAvatar = AVATARS.find(a => a.id === selectedAvatar)!;

  const isFormValid = name && age && gender && schoolClass && difficulty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        onFinish();
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
      <div style={{
        width: 390, height: 844, display: "flex", flexDirection: "column",
        background: "linear-gradient(160deg, #A29BFE 0%, #6C5CE7 100%)", position: "relative", overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 6px white, 0 0 0 8px #e0e0f0", borderRadius: "50px"
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');
          * { box-sizing: border-box; }
          input::placeholder { color: rgba(255,255,255,0.6); font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Animated Background Blobs */}
        <motion.div
          animate={{ x: [0, 18, -8, 0], y: [0, -12, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-10%", left: "-10%", width: "60vw", height: "60vw",
            borderRadius: "50%", background: "rgba(255,255,255,0.15)", filter: "blur(2px)", zIndex: 1
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 10, 0], y: [0, 15, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{
            position: "absolute", bottom: "-15%", right: "-15%", width: "70vw", height: "70vw",
            borderRadius: "50%", background: "rgba(255,255,255,0.12)", filter: "blur(3px)", zIndex: 1
          }}
        />

        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="setup-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 5, position: "relative" }}
            >
              <div style={{ padding: "48px 24px 20px", textAlign: "center" }}>
                <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "white", margin: "0 0 8px 0", textShadow: "0 3px 10px rgba(0,0,0,0.15)" }}>
                  Profil Si Kecil
                </h1>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.9)", fontWeight: 700, margin: 0 }}>
                  Lengkapi data untuk personalisasi game!
                </p>
              </div>

              <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
                <form id="child-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  
                  {/* AVATAR SELECTION */}
                  <div style={{ 
                    background: "rgba(255,255,255,0.18)", padding: "24px 20px", borderRadius: 32, 
                    backdropFilter: "blur(10px)", border: "2px solid rgba(255,255,255,0.35)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)"
                  }}>
                    <label style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "white", display: "block", marginBottom: 16, textAlign: "center", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                      Pilih Karakter!
                    </label>
                    <div className="no-scrollbar" style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
                      {AVATARS.map((avatar) => {
                        const isSelected = selectedAvatar === avatar.id;
                        return (
                          <motion.div
                            key={avatar.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedAvatar(avatar.id)}
                            style={{
                              width: 80, height: 80, flexShrink: 0,
                              borderRadius: 24, background: avatar.bg,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              border: isSelected ? "4px solid white" : "4px solid transparent",
                              boxShadow: isSelected ? "0 8px 20px rgba(0,0,0,0.2)" : "none",
                              cursor: "pointer", transition: "all 0.2s", opacity: isSelected ? 1 : 0.8
                            }}
                          >
                            <div style={{ width: 56, height: 56 }}>
                              {avatar.icon}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DATA WAJIB */}
                  <div style={{ 
                    background: "rgba(255,255,255,0.18)", padding: "24px 20px", borderRadius: 32, 
                    backdropFilter: "blur(10px)", border: "2px solid rgba(255,255,255,0.35)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)"
                  }}>
                    <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "white", margin: "0 0 20px 0", fontSize: 20, textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>Data Wajib</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <InputField label="Nama Panggilan" type="text" placeholder="Contoh: Budi" value={name} onChange={(e: any) => setName(e.target.value)} />
                      <InputField label="Umur (Tahun)" type="number" placeholder="Contoh: 7" value={age} onChange={(e: any) => setAge(e.target.value)} />
                      <RadioGroup label="Jenis Kelamin" options={["Laki-laki", "Perempuan"]} selected={gender} onChange={setGender} />
                      <InputField label="Kelas Sekolah" type="text" placeholder="Contoh: Kelas 1 SD" value={schoolClass} onChange={(e: any) => setSchoolClass(e.target.value)} />
                      <RadioGroup label="Pernah kesulitan membaca?" options={["Ya", "Tidak", "Belum yakin"]} selected={difficulty} onChange={setDifficulty} />
                    </div>
                  </div>

                  {/* DATA PENDUKUNG */}
                  <div style={{ 
                    background: "rgba(255,255,255,0.12)", padding: "24px 20px", borderRadius: 32, 
                    backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)"
                  }}>
                    <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "white", margin: "0 0 20px 0", fontSize: 18, textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>Data Pendukung (Opsional)</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <InputField label="Huruf yang sering tertukar" type="text" placeholder="b & d, p & q, atau angka" value={confusedLetters} onChange={(e: any) => setConfusedLetters(e.target.value)} />
                      <InputField label="Bahasa sehari-hari" type="text" placeholder="Contoh: Bahasa Indonesia" value={language} onChange={(e: any) => setLanguage(e.target.value)} />
                      <RadioGroup label="Pernah konsultasi dengan guru/psikolog?" options={["Ya", "Tidak"]} selected={consulted} onChange={setConsulted} />
                      <InputField label="Hobi atau kesukaan anak" type="text" placeholder="Contoh: Menggambar, Dinosaurus" value={hobbies} onChange={(e: any) => setHobbies(e.target.value)} />
                    </div>
                  </div>
                  
                  <div style={{ height: 10 }} />
                </form>
              </div>

              {/* STICKY SUBMIT BUTTON */}
              <div style={{ padding: "20px 32px 32px" }}>
                <motion.button
                  form="child-form"
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03 }}
                  disabled={isSubmitting || !isFormValid}
                  style={{
                    width: "100%", padding: "18px 24px", borderRadius: "20px", background: "white",
                    border: "none", color: "#6C5CE7", fontFamily: "'Fredoka One', cursive", fontSize: 20,
                    boxShadow: "0 6px 24px rgba(0,0,0,0.15), 0 2px 0 rgba(0,0,0,0.08)",
                    cursor: (isSubmitting || !isFormValid) ? "not-allowed" : "pointer",
                    opacity: (isSubmitting || !isFormValid) ? 0.7 : 1,
                    transition: "color 0.3s ease"
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Mulai Sekarang! 🚀"}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-splash"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: 24, textAlign: "center", zIndex: 10, position: "relative"
              }}
            >
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", width: "150%", height: "150%", background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)", pointerEvents: "none" }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                style={{ width: 160, height: 160, background: activeAvatar.bg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2), inset 0 0 0 6px white", marginBottom: 32, zIndex: 10 }}
              >
                <div style={{ width: 100, height: 100 }}>
                  {activeAvatar.icon}
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: "white", margin: "0 0 16px 0", zIndex: 10, textShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
              >
                Siap Bertualang, <br /> {name}!
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.9)", fontWeight: 700, margin: 0, zIndex: 10 }}
              >
                Membuka peta sihir...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
