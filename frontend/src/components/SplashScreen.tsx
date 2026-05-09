"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onFinish: () => void;
}

const CandyIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');`}</style>
    {/* Candy stick */}
    <rect x="30" y="30" width="6" height="18" rx="3" fill="white" opacity="0.9" transform="rotate(-45 30 30)" />
    {/* Candy ball */}
    <circle cx="20" cy="20" r="14" fill="white" opacity="0.95" />
    <circle cx="20" cy="20" r="14" fill="url(#candyGrad)" opacity="0.9" />
    {/* Candy swirl */}
    <path d="M20 8 Q28 14 20 20 Q12 26 20 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2" fill="none" opacity="0.4" />
    <defs>
      <radialGradient id="candyGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FF8E53" />
        <stop offset="100%" stopColor="#FF6B9D" />
      </radialGradient>
    </defs>
  </svg>
);

const StarBurst = ({ x, y, size, color, delay }: { x: number | string; y: number | string; size: number; color: string; delay: number }) => (
  <motion.div
    style={{ position: "absolute", left: x, top: y, width: size, height: size }}
    initial={{ opacity: 0, scale: 0, rotate: 0 }}
    animate={{ opacity: [0, 0.7, 0.5], scale: [0, 1.2, 1], rotate: [0, 15, 0] }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L13.5 9.5L21 8L15.5 13.5L18 21L12 17L6 21L8.5 13.5L3 8L10.5 9.5Z" />
    </svg>
  </motion.div>
);

const HeartDecor = ({ x, y, size, delay }: { x: number | string; y: number | string; size: number; delay: number }) => (
  <motion.div
    style={{ position: "absolute", left: x, top: y }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: [0, 0.6, 0.4], y: [10, 0, 10] }}
    transition={{ delay, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </motion.div>
);

export function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const dots = ["#FF6B9D", "#FF8E53", "#FFD93D"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
      `}</style>

      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          background: "linear-gradient(135deg, #FF6B9D 0%, #FF8E53 50%, #FFD93D 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 6px white, 0 0 0 8px #e0e0f0",
        }}
      >
        {/* Animated background blobs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {/* Blob 1 — top left, candy pink */}
          <motion.div
            animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0], scale: [1, 1.08, 0.95, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "-10%",
              left: "-15%",
              width: "55vw",
              height: "55vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 70%)",
              filter: "blur(2px)",
            }}
          />
          {/* Blob 2 — bottom right, peach */}
          <motion.div
            animate={{ x: [0, -25, 15, 0], y: [0, 20, -10, 0], scale: [1, 0.92, 1.06, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{
              position: "absolute",
              bottom: "-15%",
              right: "-20%",
              width: "65vw",
              height: "65vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 70%)",
              filter: "blur(3px)",
            }}
          />
          {/* Blob 3 — middle, lavender tint */}
          <motion.div
            animate={{ x: [0, 15, -20, 0], y: [0, -20, 5, 0], scale: [1, 1.12, 0.9, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{
              position: "absolute",
              top: "25%",
              left: "35%",
              width: "50vw",
              height: "50vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(162,155,254,0.2) 0%, rgba(255,255,255,0.03) 70%)",
              filter: "blur(4px)",
            }}
          />
        </motion.div>

        {/* Scattered decorations */}
        <StarBurst x="8%" y="12%" size={20} color="rgba(255,255,255,0.6)" delay={0.8} />
        <StarBurst x="78%" y="8%" size={14} color="rgba(255,255,255,0.5)" delay={1.0} />
        <StarBurst x="88%" y="65%" size={18} color="rgba(255,255,255,0.4)" delay={1.2} />
        <StarBurst x="5%" y="70%" size={12} color="rgba(255,255,255,0.5)" delay={1.4} />
        <StarBurst x="50%" y="5%" size={10} color="rgba(255,255,255,0.4)" delay={1.1} />
        <HeartDecor x="15%" y="30%" size={16} delay={1.3} />
        <HeartDecor x="75%" y="40%" size={12} delay={1.6} />
        <HeartDecor x="60%" y="78%" size={14} delay={1.8} />

        {/* Floating bubbles */}
        {[
          { left: "20%", top: "15%", size: 12, delay: 0.9 },
          { left: "70%", top: "20%", size: 8, delay: 1.1 },
          { left: "85%", top: "50%", size: 10, delay: 1.3 },
          { left: "10%", top: "55%", size: 14, delay: 1.0 },
          { left: "45%", top: "88%", size: 8, delay: 1.5 },
        ].map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.5, 0.3, 0.5], y: [0, -12, 0] }}
            transition={{ delay: b.delay, duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              boxShadow: "0 0 6px rgba(255,255,255,0.4)",
            }}
          />
        ))}

        {/* === CENTER CONTENT === */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", zIndex: 10, padding: "0 24px" }}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 14 }}
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeInOut" }}
            >
              <CandyIcon />
            </motion.div>
            <span
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "clamp(42px, 12vw, 64px)",
                color: "white",
                textShadow: "0 4px 0 rgba(200, 80, 120, 0.4), 0 8px 20px rgba(0,0,0,0.15)",
                letterSpacing: "1px",
                lineHeight: 1,
              }}
            >
              GrinBuds
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(15px, 4vw, 20px)",
              color: "rgba(255,255,255,0.92)",
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0,0,0,0.12)",
              letterSpacing: "0.3px",
            }}
          >
            Belajar Membaca Menyenangkan!
          </motion.p>

          {/* Bouncing dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.3 }}
            style={{ display: "flex", gap: "10px", marginTop: "8px" }}
          >
            {dots.map((color, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -14, 0] }}
                transition={{
                  delay: 1.0 + i * 0.15,
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 0.4,
                  ease: "easeInOut",
                }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 4px 10px ${color}80`,
                  border: "2px solid rgba(255,255,255,0.6)",
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Version text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: "max(20px, env(safe-area-inset-bottom, 20px))",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 400,
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.5px",
            zIndex: 10,
          }}
        >
          v1.0.0
        </motion.p>
      </div>
    </>
  );
}
