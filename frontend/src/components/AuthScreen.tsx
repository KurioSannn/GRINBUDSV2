"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, AlertTriangle, Loader2, ArrowRight, Sparkles, PartyPopper } from "lucide-react";

export interface AuthScreenProps {
  onSuccess: () => void;
}

const ICONS = {
  google: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
};

interface InputFieldProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({ icon, type, placeholder, label, value, onChange }: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{
        fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#555",
        fontWeight: 800, paddingLeft: 4, letterSpacing: 0.3,
      }}>
        {label}
      </label>
      <motion.div
        animate={{
          borderColor: focused ? "#58CC02" : "#E5E5E5",
          boxShadow: focused ? "0 0 0 4px rgba(88,204,2,0.12), 0 4px 12px rgba(0,0,0,0.04)" : "0 2px 8px rgba(0,0,0,0.03)",
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          background: focused ? "white" : "#F8F8F8",
          padding: "15px 18px", borderRadius: 20,
          border: "2px solid #E5E5E5",
          transition: "background 0.2s ease",
        }}
      >
        <motion.div
          animate={{ color: focused ? "#58CC02" : "#BBBBBB" }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: "none", outline: "none", width: "100%", fontSize: 16,
            fontFamily: "'Nunito', sans-serif", color: "#3C3C3C",
            background: "transparent", fontWeight: 700,
          }}
        />
      </motion.div>
    </div>
  );
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) { setErrorMsg("Email dan password wajib diisi!"); return; }
    if (!isLogin && !name) { setErrorMsg("Nama wajib diisi!"); return; }
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onSuccess(); }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onSuccess(); }, 1500);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0FDE4" }}>
      <div style={{
        width: 390, height: 844, display: "flex", flexDirection: "column",
        background: "white", position: "relative", overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.20), 0 0 0 6px white, 0 0 0 9px #e8e8f0",
        borderRadius: "50px",
      }}>
        {/* Decorative top header */}
        <div style={{
          background: "linear-gradient(155deg, #f0fde4 0%, #d0f5b0 60%, #b8eea0 100%)",
          padding: "60px 32px 36px",
          position: "relative", overflow: "hidden",
        }}>
          {/* Ambient blob */}
          <motion.div
            animate={{ x: [0, 14, -8, 0], y: [0, -10, 6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "-30%", right: "-20%",
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(88,204,2,0.2) 0%, transparent 70%)",
              pointerEvents: "none", filter: "blur(12px)",
            }}
          />

          {/* Floating decorative dots */}
          {[
            { left: "10%", top: "20%", size: 6, color: "#FFD93D", delay: 0 },
            { left: "80%", top: "15%", size: 5, color: "#CE82FF", delay: 0.5 },
            { left: "60%", top: "30%", size: 4, color: "#1CB0F6", delay: 1 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
              style={{
                position: "absolute", left: dot.left, top: dot.top,
                width: dot.size, height: dot.size, borderRadius: "50%",
                background: dot.color,
              }}
            />
          ))}

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-title" : "register-title"}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#777",
                fontWeight: 800, marginBottom: 6,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {isLogin ? (
                  <><Sparkles size={16} color="#FFD93D" fill="#FFD93D" /> Selamat datang kembali</>
                ) : (
                  <><PartyPopper size={16} color="#58CC02" /> Buat akun baru</>
                )}
              </div>
              <h1 style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
                fontSize: 44, margin: 0, color: "#3C3C3C", lineHeight: 1,
              }}>
                {isLogin ? "Masuk!" : "Daftar!"}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Form */}
        <motion.div
          key={isLogin ? "login-form" : "register-form"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 24px", overflowY: "auto" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <InputField
                      label="Nama Lengkap"
                      icon={<User size={20} />}
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputField
                label="Alamat Email"
                icon={<Mail size={20} />}
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                label="Password"
                icon={<Lock size={20} />}
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{
                    color: "#c0392b", background: "#fdf0ee", padding: "12px 16px",
                    borderRadius: 16, fontFamily: "'Nunito', sans-serif",
                    fontSize: 13, fontWeight: 800, textAlign: "center",
                    border: "1.5px solid #f5c6c0",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  <AlertTriangle size={16} />
                  {errorMsg}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.96, y: 5 }}
                whileHover={{ scale: 1.02 }}
                disabled={isLoading}
                style={{
                  width: "100%", padding: "18px", borderRadius: 22,
                  background: isLoading ? "#ccc" : "#58CC02",
                  border: "none", color: "white",
                  fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20,
                  boxShadow: isLoading ? "none" : "0 8px 0 #46A302, 0 16px 24px rgba(88,204,2,0.25)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  marginTop: 8, transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
              >
                {isLoading ? (
                  <><Loader2 size={22} style={{ animation: "spinSun 1s linear infinite" }} /> Memproses...</>
                ) : (
                  <>{isLogin ? "Masuk" : "Daftar"} <ArrowRight size={20} /></>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1.5, background: "#F0F0F0", borderRadius: 1 }} />
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#BBBBBB",
                fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
              }}>atau</span>
              <div style={{ flex: 1, height: 1.5, background: "#F0F0F0", borderRadius: 1 }} />
            </div>

            {/* Google button */}
            <motion.button
              onClick={handleGoogleLogin}
              whileTap={{ scale: 0.96, y: 3 }}
              whileHover={{ scale: 1.02 }}
              disabled={isLoading}
              style={{
                width: "100%", padding: "16px", borderRadius: 22,
                background: "white", border: "2px solid #E5E5E5",
                color: "#3C3C3C", fontFamily: "'Nunito', sans-serif",
                fontWeight: 800, fontSize: 15, cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                opacity: isLoading ? 0.6 : 1,
                boxShadow: "0 4px 0 #E0E0E0, 0 8px 16px rgba(0,0,0,0.04)",
              }}
            >
              {ICONS.google}
              Lanjut dengan Google
            </motion.button>
          </div>

          <div style={{
            textAlign: "center", fontFamily: "'Nunito', sans-serif",
            fontSize: 14, color: "#888", fontWeight: 700, padding: "24px 0 8px",
          }}>
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <span
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
              style={{ color: "#58CC02", fontWeight: 900, cursor: "pointer" }}
            >
              {isLogin ? "Daftar sekarang" : "Masuk di sini"}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
