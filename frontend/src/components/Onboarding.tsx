"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star, Sparkles, BookOpen, Search, Trophy, ArrowRight } from "lucide-react";

interface OnboardingProps {
  onFinish: () => void;
}

// Custom SVGs for Illustrations
const BookIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" style={{ filter: "drop-shadow(0px 16px 24px rgba(88,204,2,0.15))" }}>
    <rect x="20" y="30" width="46" height="66" rx="8" fill="white" />
    <rect x="25" y="36" width="36" height="54" rx="4" fill="#F0FDE4" />
    {[46, 58, 70, 82].map((y, i) => (
      <rect key={i} x="30" y={y} width={i % 2 === 0 ? 26 : 20} height="5" rx="2.5" fill="#58CC02" opacity={0.6} />
    ))}
    <rect x="74" y="30" width="46" height="66" rx="8" fill="white" />
    <rect x="79" y="36" width="36" height="54" rx="4" fill="#E8F7FE" />
    {[46, 58, 70, 82].map((y, i) => (
      <rect key={i} x="84" y={y} width={i % 2 === 0 ? 20 : 26} height="5" rx="2.5" fill="#1CB0F6" opacity={0.6} />
    ))}
    {/* Spine */}
    <rect x="66" y="24" width="8" height="78" rx="4" fill="#E5E5E5" />
    {/* Checkmarks */}
    <circle cx="36" cy="24" r="10" fill="#FFD93D" />
    <path d="M32 24 L35 27 L40 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="104" cy="24" r="10" fill="#FFD93D" />
    <path d="M100 24 L103 27 L108 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Sparkles */}
    <path d="M10 20 L13 14 L16 20 L22 23 L16 26 L13 32 L10 26 L4 23 Z" fill="#FFD93D" opacity="0.9" />
    <path d="M124 30 L126 26 L128 30 L132 32 L128 34 L126 38 L124 34 L120 32 Z" fill="#FF9600" opacity="0.8" />
  </svg>
);

const AIMascotIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
    <filter id="aiGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <ellipse cx="70" cy="115" rx="36" ry="6" fill="#1CB0F6" opacity="0.15" />
    <circle cx="70" cy="65" r="38" fill="url(#aiMascotGrad)" filter="url(#aiGlow)" />
    <defs>
      <radialGradient id="aiMascotGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#E2F4FF" />
        <stop offset="100%" stopColor="#BCE6FF" />
      </radialGradient>
    </defs>
    {/* Eyes */}
    <circle cx="56" cy="60" r="6" fill="#1CB0F6" />
    <circle cx="84" cy="60" r="6" fill="#1CB0F6" />
    <circle cx="58" cy="58" r="2" fill="white" />
    <circle cx="86" cy="58" r="2" fill="white" />
    {/* Blush */}
    <ellipse cx="44" cy="68" rx="5" ry="3" fill="#FF6B9D" opacity="0.4" />
    <ellipse cx="96" cy="68" rx="5" ry="3" fill="#FF6B9D" opacity="0.4" />
    {/* Smile */}
    <path d="M60 72 Q70 82 80 72" stroke="#1CB0F6" strokeWidth="3" strokeLinecap="round" fill="none" />
    
    {/* Floating Letters */}
    <text x="25" y="45" fontFamily="'Fredoka', sans-serif" fontSize="22" fill="#1CB0F6" fontWeight="bold">b</text>
    <text x="45" y="25" fontFamily="'Fredoka', sans-serif" fontSize="20" fill="#FFD93D" fontWeight="bold">d</text>
    <text x="100" y="35" fontFamily="'Fredoka', sans-serif" fontSize="24" fill="#CE82FF" fontWeight="bold">p</text>
    <text x="110" y="75" fontFamily="'Fredoka', sans-serif" fontSize="22" fill="#FF9600" fontWeight="bold">q</text>
  </svg>
);

const TrophyIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
    <ellipse cx="70" cy="115" rx="36" ry="6" fill="#FF9600" opacity="0.15" />
    {/* Trophy Handles */}
    <path d="M40 40 C 20 40, 20 70, 40 70" stroke="#FF9600" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M100 40 C 120 40, 120 70, 100 70" stroke="#FF9600" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M40 40 C 20 40, 20 70, 40 70" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M100 40 C 120 40, 120 70, 100 70" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Trophy Cup */}
    <path d="M35 30 L105 30 C105 80, 75 90, 70 90 C65 90, 35 80, 35 30 Z" fill="url(#trophyGrad)" />
    <defs>
      <linearGradient id="trophyGrad" x1="35" y1="30" x2="105" y2="90">
        <stop offset="0%" stopColor="#FFE566" />
        <stop offset="50%" stopColor="#FFD93D" />
        <stop offset="100%" stopColor="#FF9600" />
      </linearGradient>
    </defs>
    {/* Base */}
    <rect x="62" y="90" width="16" height="12" fill="#E67E00" />
    <rect x="50" y="102" width="40" height="10" rx="4" fill="#8C5042" />
    <rect x="55" y="98" width="30" height="4" fill="#A86A58" />
    {/* Star inside cup */}
    <path d="M70 42 L73 50 L81 50 L75 55 L77 63 L70 58 L63 63 L65 55 L59 50 L67 50 Z" fill="#FFFFFF" opacity="0.9" />
    {/* Sparkles */}
    <path d="M20 20 L23 14 L26 20 L32 23 L26 26 L23 32 L20 26 L14 23 Z" fill="#1CB0F6" opacity="0.8" />
    <path d="M110 15 L112 11 L114 15 L118 17 L114 19 L112 23 L110 19 L106 17 Z" fill="#FF6B9D" opacity="0.8" />
  </svg>
);

const slides = [
  {
    id: 0,
    gradient: "linear-gradient(180deg, #E2F9DB 0%, #C4EDF8 100%)",
    accent: "#58CC02",
    accentDark: "#46A302",
    badge: "100% Gratis",
    badgeIcon: <Star size={12} fill="currentColor" />,
    badgeColor: "#3a8a00",
    title: "Halo, Selamat Datang!",
    description: "GrinBuds hadir untuk membantu anak-anak belajar membaca dengan cara yang menyenangkan dan penuh semangat!",
    cta: "Selanjutnya",
    Illustration: BookIllustration,
    landscapeType: "hills",
  },
  {
    id: 1,
    gradient: "linear-gradient(180deg, #D4EFFF 0%, #E2F9DB 100%)",
    accent: "#1CB0F6",
    accentDark: "#158ECB",
    badge: "Didukung AI",
    badgeIcon: <Search size={12} />,
    badgeColor: "#158ECB",
    title: "Deteksi Dini Disleksia",
    description: "Lewat mini-games seru, AI kami membantu mengenali pola belajar anak dan mendeteksi tanda-tanda disleksia sejak dini.",
    cta: "Selanjutnya",
    Illustration: AIMascotIllustration,
    landscapeType: "river",
  },
  {
    id: 2,
    gradient: "linear-gradient(180deg, #FFF0CA 0%, #FFD494 100%)",
    accent: "#FF9600",
    accentDark: "#D67D00",
    badge: "32 Level Seru",
    badgeIcon: <Trophy size={12} />,
    badgeColor: "#D67D00",
    title: "Capai Bintang Bersama!",
    description: "Setiap level selesai, anak mendapat bintang dan pencapaian. Pantau perkembangan si kecil lewat dashboard orang tua.",
    cta: "Mulai Sekarang!",
    Illustration: TrophyIllustration,
    landscapeType: "path",
  },
];

// Landscapes
const LandscapeHills = () => (
  <svg width="100%" height="180" viewBox="0 0 390 180" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0 }}>
    <path d="M0 100 Q 90 60 180 110 T 390 90 L 390 180 L 0 180 Z" fill="#B9F38E" />
    <path d="M0 130 Q 120 90 200 140 T 390 120 L 390 180 L 0 180 Z" fill="#90E560" />
    <path d="M-20 180 Q 80 120 180 180 Z" fill="#58CC02" />
    <path d="M200 180 Q 300 130 410 180 Z" fill="#58CC02" />
    {/* Trees & Flowers */}
    <circle cx="45" cy="115" r="24" fill="#58CC02" />
    <circle cx="355" cy="125" r="28" fill="#58CC02" />
    <circle cx="80" cy="160" r="14" fill="#FFFFFF" />
    <circle cx="80" cy="160" r="5" fill="#FFD93D" />
    <circle cx="320" cy="150" r="14" fill="#FF9FCC" />
    <circle cx="320" cy="150" r="5" fill="#FFD93D" />
  </svg>
);

const LandscapeRiver = () => (
  <svg width="100%" height="180" viewBox="0 0 390 180" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0 }}>
    <path d="M0 100 Q 90 60 180 110 T 390 90 L 390 180 L 0 180 Z" fill="#A8ECF8" />
    <path d="M0 130 Q 120 90 200 140 T 390 120 L 390 180 L 0 180 Z" fill="#90E560" />
    <path d="M140 180 Q 180 140 240 180 Z" fill="#58CC02" />
    <path d="M170 120 Q 200 150 210 180 L 150 180 Q 140 140 170 120 Z" fill="#1CB0F6" opacity="0.6" />
    {/* Trees */}
    <circle cx="40" cy="110" r="26" fill="#1CB0F6" />
    <circle cx="360" cy="130" r="22" fill="#58CC02" />
    <circle cx="320" cy="160" r="12" fill="#FF6B9D" />
    <circle cx="320" cy="160" r="4" fill="#FFFFFF" />
  </svg>
);

const LandscapePath = () => (
  <svg width="100%" height="180" viewBox="0 0 390 180" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0 }}>
    <path d="M0 100 Q 90 60 180 110 T 390 90 L 390 180 L 0 180 Z" fill="#B9F38E" />
    <path d="M0 130 Q 120 90 200 140 T 390 120 L 390 180 L 0 180 Z" fill="#90E560" />
    {/* Path */}
    <path d="M195 120 Q 150 150 100 180 L 280 180 Q 230 150 195 120 Z" fill="#FFD93D" opacity="0.8" />
    <path d="M-20 180 Q 80 120 100 180 Z" fill="#58CC02" />
    <path d="M280 180 Q 300 130 410 180 Z" fill="#58CC02" />
    {/* Trees */}
    <circle cx="50" cy="115" r="28" fill="#58CC02" />
    <circle cx="350" cy="120" r="24" fill="#58CC02" />
    <circle cx="80" cy="165" r="14" fill="#FF9600" />
    <circle cx="80" cy="165" r="5" fill="#FFFFFF" />
    <circle cx="340" cy="165" r="14" fill="#FF6B9D" />
    <circle cx="340" cy="165" r="5" fill="#FFFFFF" />
  </svg>
);

export function Onboarding({ onFinish }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else onFinish();
  };

  const skip = () => onFinish();

  const current = slides[step];

  return (
    <div style={{
      width: 390, height: 844, borderRadius: 50,
      background: current.gradient,
      boxShadow: "0 32px 80px rgba(0,0,0,0.20), 0 0 0 6px white, 0 0 0 9px #e0e0f0",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "background 0.6s ease-in-out"
    }}>
      {/* Background Landscapes */}
      <AnimatePresence mode="wait">
        <motion.div key={`land-${step}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {current.landscapeType === "hills" && <LandscapeHills />}
          {current.landscapeType === "river" && <LandscapeRiver />}
          {current.landscapeType === "path" && <LandscapePath />}
        </motion.div>
      </AnimatePresence>

      {/* Floating Decor (Stars / Clouds) */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: "absolute", top: "12%", left: "8%", zIndex: 2 }}>
        <Star size={24} fill="#FFD93D" color="#FFD93D" opacity={0.8} />
      </motion.div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: "absolute", top: "25%", right: "12%", zIndex: 2 }}>
        <Star size={18} fill="white" color="white" opacity={0.9} />
      </motion.div>
      <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity }} style={{ position: "absolute", top: "18%", left: "-5%", zIndex: 2, opacity: 0.6 }}>
        <svg width="80" height="50" viewBox="0 0 100 60" fill="white">
          <circle cx="30" cy="30" r="20" /><circle cx="50" cy="20" r="20" /><circle cx="70" cy="30" r="20" /><rect x="30" y="30" width="40" height="20" />
        </svg>
      </motion.div>
      <motion.div animate={{ x: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }} style={{ position: "absolute", top: "8%", right: "5%", zIndex: 2, opacity: 0.7 }}>
        <svg width="70" height="40" viewBox="0 0 100 60" fill="white">
          <circle cx="30" cy="30" r="20" /><circle cx="50" cy="20" r="20" /><circle cx="70" cy="30" r="20" /><rect x="30" y="30" width="40" height="20" />
        </svg>
      </motion.div>

      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "30px 24px", zIndex: 10 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={skip}
          style={{
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
            border: "none", borderRadius: 20, padding: "8px 16px",
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
            color: current.accentDark, display: "flex", alignItems: "center", gap: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer",
          }}
        >
          Lewati <ChevronRight size={14} strokeWidth={3} />
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", zIndex: 10, marginTop: -30 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
          >
            {/* Badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.3)", backdropFilter: "blur(12px)",
              padding: "6px 14px", borderRadius: 20, marginBottom: 24,
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12,
              color: current.badgeColor,
            }}>
              {current.badgeIcon} {current.badge}
            </div>

            {/* Illustration Card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 220, height: 220,
                background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
                borderRadius: 40,
                boxShadow: "0 24px 48px rgba(0,0,0,0.06), 0 0 0 4px rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24, position: "relative"
              }}
            >
              <current.Illustration />
              
              {/* Cute corner star on card */}
              {step === 0 && (
                <div style={{ position: "absolute", bottom: -10, right: -15 }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 2L24 14L38 14L26 22L30 36L20 28L10 36L14 22L2 14L16 14L20 2Z" fill="#FFD93D" />
                    <circle cx="16" cy="20" r="2" fill="#3C3C3C" />
                    <circle cx="24" cy="20" r="2" fill="#3C3C3C" />
                    <path d="M18 24 Q20 27 22 24" stroke="#3C3C3C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Typography */}
            <h2 style={{
              fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 32,
              color: "#1E2A4F", textAlign: "center", lineHeight: 1.2, marginBottom: 8,
              textShadow: "0 2px 8px rgba(255,255,255,0.8)"
            }}>
              {current.title.split(" ").map((word, i) => (
                <span key={i} style={{ color: word === "Datang!" || word === "Disleksia" || word === "Bersama!" ? current.accent : "#1E2A4F" }}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14,
              color: "#4A5D78", textAlign: "center", lineHeight: 1.5,
              maxWidth: 300,
              textShadow: "0 2px 4px rgba(255,255,255,0.6)"
            }}>
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div style={{ padding: "0 32px 64px", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Progress Dots */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: step === i ? 20 : 8, height: 8,
              borderRadius: 4, background: step === i ? current.accent : "rgba(255,255,255,0.6)",
              transition: "all 0.3s ease",
              boxShadow: step === i ? `0 2px 6px ${current.accent}66` : "none"
            }} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95, y: 4 }}
          onClick={nextStep}
          className="btn-press"
          style={{
            width: "100%", height: 64, borderRadius: 24, border: "none",
            background: current.accent,
            boxShadow: `0 6px 0 ${current.accentDark}, 0 24px 40px rgba(0,0,0,0.1), 0 12px 24px ${current.accent}55, inset 0 -4px 0 rgba(0,0,0,0.05)`,
            color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            cursor: "pointer", position: "relative"
          }}
        >
          {current.cta}
          {step === 2 ? <Sparkles size={20} strokeWidth={2.5} /> : <ArrowRight size={20} strokeWidth={3} />}
        </motion.button>
      </div>
    </div>
  );
}
