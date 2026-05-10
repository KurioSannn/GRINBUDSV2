"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export interface MiniGameResult {
  stars: number;
  totalSalah: number;
  rataWaktu: number;
  detailError: Array<{ letter: string; wrongAnswer?: string; timeMs: number }>;
}

export interface MiniGameProps {
  level: number;
  onFinish: (result: MiniGameResult) => void;
}

// ── UTILS ──
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// ── SVG ICONS ──
const ICONS = {
  redo: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
    </svg>
  ),
  check: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  starFilled: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#FFD93D">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26Z"/>
    </svg>
  ),
  starEmpty: (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#FFE0EE">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26Z"/>
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9FCC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  cross: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9FCC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  )
};

// ── MULTIPLE CHOICE GAME (Level 1-7) ──
const LETTERS = ["b", "d", "p", "q"];

function MultipleChoiceGame({ onComplete }: { onComplete: (res: MiniGameResult) => void }) {
  const questions = useMemo(() => {
    return Array.from({ length: 5 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MiniGameResult["detailError"]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setStartTime(Date.now());
    setOptions(shuffleArray(LETTERS));
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    const timeMs = Date.now() - startTime;
    const target = questions[currentIndex];
    const isCorrect = answer === target;
    
    const newResults = [...results, { letter: target, wrongAnswer: isCorrect ? undefined : answer, timeMs }];
    
    if (currentIndex < questions.length - 1) {
      setResults(newResults);
      setCurrentIndex(i => i + 1);
    } else {
      const totalSalah = newResults.filter(r => r.wrongAnswer).length;
      const rataWaktu = newResults.reduce((acc, r) => acc + r.timeMs, 0) / newResults.length;
      const stars = totalSalah === 0 ? 3 : totalSalah <= 2 ? 2 : 1;
      onComplete({ stars, totalSalah, rataWaktu, detailError: newResults });
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#FF9FCC", fontSize: 16 }}>
          Soal {currentIndex + 1} / 5
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i <= currentIndex ? "#FF6B9D" : "#FFE0EE" }} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ fontSize: 140, fontFamily: "'Fredoka One', cursive", color: "#333", marginBottom: 60, textShadow: "0 8px 24px rgba(0,0,0,0.12)", lineHeight: 1 }}>
            {questions[currentIndex]}
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: "100%" }}>
            {options.map((opt, i) => (
              <motion.button
                key={`${currentIndex}-${opt}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileTap={{ scale: 0.9, y: 4, boxShadow: "0 0px 0 #FFB8D9" }}
                onClick={() => handleAnswer(opt)}
                style={{
                  background: "white", border: "none", borderRadius: 28, padding: "28px",
                  fontSize: 56, fontFamily: "'Fredoka One', cursive", color: "#FF6B9D",
                  boxShadow: "0 8px 0 #FFB8D9, 0 16px 24px rgba(255,107,157,0.15)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── DRAWING GAME (Level 8) ──
const DRAW_LETTERS = ["b", "d", "p", "q", "m"];

function DrawingGame({ onComplete }: { onComplete: (res: MiniGameResult) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MiniGameResult["detailError"]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }, 350); // tunggu framer motion selesai
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width * window.devicePixelRatio);
    const scaleY = canvas.height / (rect.height * window.devicePixelRatio);
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 16;
    ctx.strokeStyle = "#FF6B9D";
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleNext = () => {
    const timeMs = Date.now() - startTime;
    const target = DRAW_LETTERS[currentIndex];
    
    const newResults = [...results, { letter: target, timeMs }];
    
    if (currentIndex < DRAW_LETTERS.length - 1) {
      setResults(newResults);
      setCurrentIndex(i => i + 1);
    } else {
      const rataWaktu = newResults.reduce((acc, r) => acc + r.timeMs, 0) / newResults.length;
      onComplete({ stars: 3, totalSalah: 0, rataWaktu, detailError: newResults });
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 24px 16px" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#FF9FCC", fontSize: 16 }}>
          Huruf {currentIndex + 1} / 5
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: i <= currentIndex ? "#FF6B9D" : "#FFE0EE" }} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, color: "#FF6B9D", fontWeight: 800, margin: "0 0 8px 0" }}>
              Tulis huruf:
            </h2>
            <div style={{ fontSize: 64, fontFamily: "'Fredoka One', cursive", color: "#333", lineHeight: 1 }}>
              {DRAW_LETTERS[currentIndex]}
            </div>
          </div>
          
          <div style={{ flex: 1, margin: "0 24px", background: "white", borderRadius: 32, boxShadow: "0 8px 32px rgba(255,107,157,0.15)", position: "relative", overflow: "hidden" }}>
             {/* Garis buku tulis */}
             <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-evenly", opacity: 0.7 }}>
                <div style={{ height: 2, background: "#FFF0F5", width: "100%" }} />
                <div style={{ height: 2, background: "#FFF0F5", width: "100%" }} />
                <div style={{ height: 2, background: "#FFB8D9", width: "100%", borderBottom: "3px dashed #FFE0EE" }} />
                <div style={{ height: 2, background: "#FFF0F5", width: "100%" }} />
             </div>
             
             <canvas
               ref={canvasRef}
               style={{ width: "100%", height: "100%", touchAction: "none" }}
               onPointerDown={startDraw}
               onPointerMove={draw}
               onPointerUp={endDraw}
               onPointerCancel={endDraw}
             />
          </div>
          
          <div style={{ display: "flex", gap: 16, padding: "24px" }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={clearCanvas}
              style={{ flex: 1, padding: 18, borderRadius: 24, border: "none", background: "#FFE0EE", color: "#FF6B9D", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}
            >
              {ICONS.redo}
              Ulangi
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95, y: 4, boxShadow: "0 0px 0 #D94A7E" }}
              onClick={handleNext}
              style={{ flex: 1, padding: 18, borderRadius: 24, border: "none", background: "#FF6B9D", color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 6px 0 #D94A7E", cursor: "pointer" }}
            >
              Selesai
              {ICONS.check}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── RESULT SCREEN ──
function ResultScreen({ result, onNext, onRetry }: { result: MiniGameResult; onNext: () => void; onRetry: () => void; }) {
  const getMessage = (stars: number) => {
    if (stars === 3) return "Hebattt! Kamu pintar banget hari ini!";
    if (stars === 2) return "Bagus! Sedikit lagi jadi sempurna!";
    return "Yay! Kamu sudah mencoba dengan baik!";
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20, staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  const starVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}
    >
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20, staggerChildren: 0.15 } }
        } as Variants} 
        style={{ display: "flex", gap: 16, marginBottom: 40, alignItems: "center" }}
      >
        {[1, 2, 3].map((starIdx) => (
          <motion.div 
            key={starIdx}
            variants={starVariants}
            style={{ width: starIdx === 2 ? 100 : 80, height: starIdx === 2 ? 100 : 80, transform: starIdx === 2 ? "translateY(-15px)" : "none" }}
          >
            {starIdx <= result.stars ? ICONS.starFilled : ICONS.starEmpty}
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#FF6B9D", marginBottom: 12, lineHeight: 1.2 }}>
          {getMessage(result.stars)}
        </h2>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: "flex", gap: 16, width: "100%", marginBottom: 48 }}>
        <div style={{ flex: 1, background: "white", padding: 16, borderRadius: 20, boxShadow: "0 8px 16px rgba(255,107,157,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#FFF0F5", padding: 8, borderRadius: "50%" }}>{ICONS.cross}</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#FF6B9D" }}>{result.totalSalah}</div>
          <div style={{ fontSize: 12, color: "#FF9FCC", fontWeight: 800 }}>TOTAL SALAH</div>
        </div>
        <div style={{ flex: 1, background: "white", padding: 16, borderRadius: 20, boxShadow: "0 8px 16px rgba(255,107,157,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#FFF0F5", padding: 8, borderRadius: "50%" }}>{ICONS.clock}</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#FF6B9D" }}>{(result.rataWaktu / 1000).toFixed(1)}s</div>
          <div style={{ fontSize: 12, color: "#FF9FCC", fontWeight: 800 }}>RATA WAKTU</div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          style={{ width: "100%", padding: "18px", borderRadius: 24, background: "#FFD93D", border: "none", color: "white", fontFamily: "'Fredoka One', cursive", fontSize: 20, boxShadow: "0 8px 0 #E5C337, 0 16px 24px rgba(255,217,61,0.3)", cursor: "pointer" }}
        >
          Lanjut
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          style={{ width: "100%", padding: "18px", borderRadius: 24, background: "white", border: "none", color: "#FF6B9D", fontFamily: "'Fredoka One', cursive", fontSize: 18, boxShadow: "0 8px 0 #FFE0EE", cursor: "pointer" }}
        >
          Ulangi Level
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN MINIGAME COMPONENT ──
export default function MiniGame({ level, onFinish }: MiniGameProps) {
  const isLevel8 = level === 8;
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{
        position: "absolute",
        inset: 0,
        background: "#FFF0F5",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header Modal - Hide on Result Screen */}
      {!result && (
        <div style={{ padding: "32px 24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#FF6B9D", margin: 0 }}>
            Level {level}
          </h1>
          <button
            onClick={() => onFinish({ stars: 0, totalSalah: 0, rataWaktu: 0, detailError: [] })}
            style={{ width: 44, height: 44, borderRadius: "50%", background: "white", border: "none", color: "#FF6B9D", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(255,107,157,0.2)", cursor: "pointer" }}
          >
            {ICONS.close}
          </button>
        </div>
      )}

      {result ? (
        <ResultScreen 
          result={result} 
          onNext={() => onFinish(result)} 
          onRetry={() => { setResult(null); setRetryCount(c => c + 1); }} 
        />
      ) : isLevel8 ? (
        <DrawingGame key={`draw-${retryCount}`} onComplete={setResult} />
      ) : (
        <MultipleChoiceGame key={`mc-${retryCount}`} onComplete={setResult} />
      )}
    </motion.div>
  );
}
