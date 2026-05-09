"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AuthScreenProps {
  onSuccess: () => void;
}

const ICONS = {
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  lock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  google: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 800, paddingLeft: 8, letterSpacing: 0.5 }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.15)",
        padding: "16px 20px", borderRadius: 20, border: "2px solid rgba(255,255,255,0.3)",
        transition: "all 0.2s"
      }}>
        <div style={{ opacity: 0.9 }}>{icon}</div>
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

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi!");
      return;
    }

    if (!isLogin && !name) {
      setErrorMsg("Nama wajib diisi!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
      <div style={{
        width: 390, height: 844, display: "flex", flexDirection: "column",
        background: "linear-gradient(160deg, #FF6B9D 0%, #FF8E53 100%)", position: "relative", overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 6px white, 0 0 0 8px #e0e0f0", borderRadius: "50px"
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');
          * { box-sizing: border-box; }
          input::placeholder { color: rgba(255,255,255,0.6); font-weight: 700; }
          input:focus { color: white; }
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

        {/* HEADER TEXT */}
        <div style={{ position: "relative", zIndex: 5, padding: "72px 32px 16px", textAlign: "center" }}>
          <motion.div
            key={isLogin ? "login-title" : "register-title"}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, margin: "0 0 4px 0", color: "rgba(255,255,255,0.9)", fontWeight: 800 }}>
              {isLogin ? "Halo Kembali," : "Halo,"}
            </h2>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 44, margin: 0, color: "white", textShadow: "0 3px 10px rgba(0,0,0,0.15)" }}>
              {isLogin ? "Masuk!" : "Daftar!"}
            </h1>
          </motion.div>
        </div>

        {/* FORM CONTAINER */}
        <motion.div
          key={isLogin ? "login-form" : "register-form"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="no-scrollbar"
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            padding: "16px 24px", zIndex: 5, overflowY: "auto"
          }}
        >
          <div style={{ 
            background: "rgba(255,255,255,0.18)", padding: "28px 24px", borderRadius: 32, 
            backdropFilter: "blur(10px)", border: "2px solid rgba(255,255,255,0.35)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
            display: "flex", flexDirection: "column", gap: 20
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InputField
                      label="Nama Lengkap"
                      icon={ICONS.user}
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
                icon={ICONS.mail}
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                label="Password"
                icon={ICONS.lock}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "white", background: "rgba(255,0,0,0.5)", padding: "8px 12px", borderRadius: 12, fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 800, textAlign: "center", marginTop: 4 }}>
                  {errorMsg}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
                style={{
                  width: "100%", padding: "18px", borderRadius: 24, background: "white",
                  border: "none", color: "#FF6B9D", fontFamily: "'Fredoka One', cursive", fontSize: 20,
                  boxShadow: "0 6px 24px rgba(0,0,0,0.15), 0 2px 0 rgba(0,0,0,0.08)",
                  cursor: isLoading ? "not-allowed" : "pointer", marginTop: 12,
                  opacity: isLoading ? 0.7 : 1, transition: "all 0.2s"
                }}
              >
                {isLoading ? "Memproses..." : (isLogin ? "Masuk" : "Daftar")}
              </motion.button>
            </form>

            {/* SOCIAL LOGIN & TOGGLE */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.3)" }} />
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 700, textTransform: "uppercase" }}>atau</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.3)" }} />
              </div>

              <motion.button
                onClick={handleGoogleLogin}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
                style={{
                  width: "100%", padding: "16px", borderRadius: 24, background: "rgba(255,255,255,0.9)",
                  border: "none", color: "#374151", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                  opacity: isLoading ? 0.7 : 1, boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                {ICONS.google}
                Lanjut dengan Google
              </motion.button>
            </div>
          </div>

          <div style={{ textAlign: "center", fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.9)", fontWeight: 700, padding: "24px 0" }}>
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <span
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
              style={{ color: "white", fontWeight: 800, cursor: "pointer", textDecoration: "underline", textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
            >
              {isLogin ? "Daftar sekarang" : "Masuk di sini"}
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
