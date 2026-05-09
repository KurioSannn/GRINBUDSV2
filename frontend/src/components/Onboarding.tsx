"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingProps {
  onFinish: () => void;
}

const slides = [
  {
    id: 0,
    bg: "linear-gradient(160deg, #FF6B9D 0%, #FF8E53 100%)",
    accent: "#FF6B9D",
    illustration: (
      <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Open book */}
        <ellipse cx="110" cy="175" rx="80" ry="12" fill="rgba(0,0,0,0.1)" />
        {/* Book left page */}
        <path d="M30 60 Q30 40 50 38 L108 48 L108 165 L50 158 Q30 156 30 138 Z" fill="white" opacity="0.95" />
        {/* Book right page */}
        <path d="M190 60 Q190 40 170 38 L112 48 L112 165 L170 158 Q190 156 190 138 Z" fill="white" opacity="0.85" />
        {/* Spine */}
        <rect x="107" y="47" width="6" height="119" rx="3" fill="rgba(255,150,150,0.4)" />
        {/* Lines left page */}
        {[70, 85, 100, 115, 130].map((y, i) => (
          <line key={i} x1="48" y1={y} x2="98" y2={y + 2} stroke="#FF6B9D" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        ))}
        {/* Lines right page */}
        {[70, 85, 100, 115, 130].map((y, i) => (
          <line key={i} x1="122" y1={y} x2="172" y2={y + 2} stroke="#FF8E53" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        ))}
        {/* Sparkles */}
        <circle cx="55" cy="45" r="5" fill="#FFD93D" opacity="0.9" />
        <circle cx="168" cy="42" r="4" fill="#FFD93D" opacity="0.8" />
        <path d="M190 30 L192 24 L194 30 L200 32 L194 34 L192 40 L190 34 L184 32 Z" fill="#FFD93D" opacity="0.9" />
        <path d="M20 90 L21.5 85 L23 90 L28 91.5 L23 93 L21.5 98 L20 93 L15 91.5 Z" fill="white" opacity="0.8" />
        {/* Cute face on book */}
        <circle cx="75" cy="105" r="14" fill="#FFB3D1" opacity="0.5" />
        <circle cx="72" cy="103" r="2.5" fill="#FF6B9D" />
        <circle cx="79" cy="103" r="2.5" fill="#FF6B9D" />
        <path d="M70 109 Q75.5 114 81 109" stroke="#FF6B9D" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
    title: "Halo, Selamat Datang! 👋",
    description: "GrinBuds hadir untuk membantu anak-anak belajar membaca dengan cara yang menyenangkan dan penuh semangat!",
  },
  {
    id: 1,
    bg: "linear-gradient(160deg, #A29BFE 0%, #6C5CE7 100%)",
    accent: "#A29BFE",
    illustration: (
      <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="110" cy="178" rx="72" ry="11" fill="rgba(0,0,0,0.12)" />
        {/* Brain/head shape */}
        <ellipse cx="110" cy="95" rx="62" ry="65" fill="white" opacity="0.95" />
        {/* Eyes */}
        <circle cx="90" cy="85" r="12" fill="#A29BFE" />
        <circle cx="130" cy="85" r="12" fill="#A29BFE" />
        <circle cx="90" cy="85" r="6" fill="#6C5CE7" />
        <circle cx="130" cy="85" r="6" fill="#6C5CE7" />
        <circle cx="93" cy="82" r="2" fill="white" />
        <circle cx="133" cy="82" r="2" fill="white" />
        {/* Smile */}
        <path d="M92 112 Q110 126 128 112" stroke="#6C5CE7" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <ellipse cx="80" cy="108" rx="9" ry="6" fill="#FFB3D1" opacity="0.6" />
        <ellipse cx="140" cy="108" rx="9" ry="6" fill="#FFB3D1" opacity="0.6" />
        {/* Letters floating around */}
        <text x="28" y="55" fontFamily="Arial" fontWeight="bold" fontSize="24" fill="white" opacity="0.85">b</text>
        <text x="62" y="30" fontFamily="Arial" fontWeight="bold" fontSize="20" fill="#FFD93D" opacity="0.9">d</text>
        <text x="148" y="38" fontFamily="Arial" fontWeight="bold" fontSize="22" fill="white" opacity="0.8">p</text>
        <text x="178" y="62" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#FFD93D" opacity="0.85">q</text>
        {/* Arrow showing confusion → clarity */}
        <path d="M52 78 Q60 68 72 75" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" fill="none" />
        {/* Stars */}
        <path d="M185 95 L186.5 90 L188 95 L193 96.5 L188 98 L186.5 103 L185 98 L180 96.5 Z" fill="#FFD93D" opacity="0.9" />
        <path d="M22 125 L23 121 L24 125 L28 126 L24 127 L23 131 L22 127 L18 126 Z" fill="white" opacity="0.8" />
      </svg>
    ),
    title: "Deteksi Dini Disleksia 🔍",
    description: "Lewat mini-games seru, AI kami membantu mengenali pola belajar anak dan mendeteksi tanda-tanda disleksia sejak dini.",
  },
  {
    id: 2,
    bg: "linear-gradient(160deg, #00B894 0%, #00CEC9 100%)",
    accent: "#00B894",
    illustration: (
      <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="110" cy="178" rx="78" ry="11" fill="rgba(0,0,0,0.1)" />
        {/* Trophy base */}
        <rect x="90" y="155" width="40" height="12" rx="6" fill="white" opacity="0.9" />
        <rect x="83" y="165" width="54" height="8" rx="4" fill="white" opacity="0.8" />
        {/* Trophy body */}
        <path d="M70 55 L80 140 L140 140 L150 55 Z" fill="white" opacity="0.95" />
        {/* Trophy handles */}
        <path d="M70 55 Q48 55 48 80 Q48 105 75 108" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M150 55 Q172 55 172 80 Q172 105 145 108" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* Star on trophy */}
        <path d="M110 75 L113 86 L125 86 L116 93 L119 104 L110 97 L101 104 L104 93 L95 86 L107 86 Z" fill="#FFD93D" />
        {/* Stars around */}
        <path d="M38 40 L40 33 L42 40 L49 42 L42 44 L40 51 L38 44 L31 42 Z" fill="#FFD93D" opacity="0.9" />
        <path d="M172 30 L174 24 L176 30 L182 32 L176 34 L174 40 L172 34 L166 32 Z" fill="#FFD93D" opacity="0.85" />
        <circle cx="55" cy="130" r="6" fill="white" opacity="0.6" />
        <circle cx="165" cy="125" r="5" fill="white" opacity="0.5" />
        <circle cx="190" cy="65" r="4" fill="#FFD93D" opacity="0.7" />
        {/* Confetti */}
        <rect x="30" y="60" width="8" height="4" rx="2" fill="#FF6B9D" opacity="0.8" transform="rotate(-20 30 60)" />
        <rect x="180" y="85" width="8" height="4" rx="2" fill="#FF8E53" opacity="0.7" transform="rotate(15 180 85)" />
        <rect x="50" y="100" width="6" height="3" rx="1.5" fill="#A29BFE" opacity="0.8" transform="rotate(30 50 100)" />
        <rect x="165" y="55" width="6" height="3" rx="1.5" fill="#FFD93D" opacity="0.8" transform="rotate(-25 165 55)" />
        {/* Progress dots below trophy body */}
        <circle cx="98" cy="125" r="5" fill="#00B894" opacity="0.7" />
        <circle cx="110" cy="125" r="5" fill="#00B894" opacity="0.9" />
        <circle cx="122" cy="125" r="5" fill="#00CEC9" opacity="0.6" />
      </svg>
    ),
    title: "Capai Bintang Bersama! ⭐",
    description: "Setiap level selesai, anak mendapat bintang dan pencapaian. Pantau perkembangan si kecil lewat dashboard orang tua.",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
};

export function Onboarding({ onFinish }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent((p) => p + 1);
    } else {
      onFinish();
    }
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 6px white, 0 0 0 8px #e0e0f0",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* Animated background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              inset: 0,
              background: slide.bg,
              zIndex: 0,
            }}
          />
        </AnimatePresence>

        {/* Background blobs */}
        <motion.div
          animate={{ x: [0, 18, -8, 0], y: [0, -12, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-10%", left: "-10%",
            width: "60vw", height: "60vw",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            filter: "blur(2px)",
            zIndex: 1,
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 10, 0], y: [0, 15, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{
            position: "absolute",
            bottom: "-15%", right: "-15%",
            width: "70vw", height: "70vw",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            filter: "blur(3px)",
            zIndex: 1,
          }}
        />

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onFinish}
          style={{
            position: "absolute",
            top: "max(20px, env(safe-area-inset-top, 20px))",
            right: "20px",
            zIndex: 10,
            background: "rgba(255,255,255,0.25)",
            border: "none",
            borderRadius: "20px",
            padding: "8px 18px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            color: "white",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          Lewati
        </motion.button>

        {/* Slide content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 32px 32px",
            position: "relative",
            zIndex: 5,
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
                width: "100%",
                maxWidth: "360px",
              }}
            >
              {/* Illustration card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: "32px",
                  padding: "28px 24px",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255,255,255,0.35)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {slide.illustration}
              </motion.div>

              {/* Text */}
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h1
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: "clamp(24px, 7vw, 32px)",
                    color: "white",
                    textShadow: "0 3px 10px rgba(0,0,0,0.15)",
                    lineHeight: 1.2,
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(14px, 4vw, 16px)",
                    color: "rgba(255,255,255,0.88)",
                    lineHeight: 1.6,
                    textShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {slide.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom area */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            padding: "0 32px max(32px, env(safe-area-inset-bottom, 32px))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Dots */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {slides.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                animate={{
                  width: i === current ? 28 : 10,
                  opacity: i === current ? 1 : 0.5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  height: 10,
                  borderRadius: 5,
                  background: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* CTA button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            onClick={goNext}
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "18px 24px",
              borderRadius: "20px",
              border: "none",
              background: "white",
              color: slide.accent,
              fontFamily: "'Fredoka One', cursive",
              fontSize: "20px",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15), 0 2px 0 rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "color 0.3s ease",
            }}
          >
            {current < slides.length - 1 ? (
              <>
                Selanjutnya
                <motion.svg
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  width="22" height="22" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </>
            ) : (
              <>
                Mulai Sekarang! 🚀
              </>
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
