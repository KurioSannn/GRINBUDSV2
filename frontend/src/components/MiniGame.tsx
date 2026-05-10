"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, X, Star, Clock, ArrowRight, Target, Pencil, RefreshCw, Sparkles } from "lucide-react";

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

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const LETTERS = ["b", "d", "p", "q"];

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", width: "100%" }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ background: i < current ? "#1CB0F6" : i === current ? "#1CB0F6" : "#E5E5E5" }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, height: 8, borderRadius: 4, position: "relative" }}
        >
          {i === current && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ position: "absolute", right: -8, top: -6, zIndex: 10 }}
            >
              <Star size={20} fill="#FFD93D" color="#FFD93D" style={{ filter: "drop-shadow(0 2px 4px rgba(255, 217, 61, 0.4))" }} />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function MultipleChoiceGame({ level, onComplete, onClose }: { level: number; onComplete: (res: MiniGameResult) => void; onClose: () => void }) {
  const questions = useMemo(() =>
    Array.from({ length: 5 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]),
  []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MiniGameResult["detailError"]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ opt: string; correct: boolean } | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
    setOptions(shuffleArray(LETTERS));
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (feedback) return;
    const timeMs = Date.now() - startTime;
    const target = questions[currentIndex];
    const isCorrect = answer === target;

    setFeedback({ opt: answer, correct: isCorrect });

    setTimeout(() => {
      const newResults = [...results, { letter: target, wrongAnswer: isCorrect ? undefined : answer, timeMs }];
      setFeedback(null);

      if (currentIndex < questions.length - 1) {
        setResults(newResults);
        setCurrentIndex(i => i + 1);
      } else {
        const totalSalah = newResults.filter(r => r.wrongAnswer).length;
        const rataWaktu = newResults.reduce((acc, r) => acc + r.timeMs, 0) / newResults.length;
        const stars = totalSalah === 0 ? 3 : totalSalah <= 2 ? 2 : 1;
        onComplete({ stars, totalSalah, rataWaktu, detailError: newResults });
      }
    }, 1000);
  };

  const getOptionStyle = (opt: string) => {
    if (!feedback) return { bg: "white", color: "#2A3B5C", shadow: "0 10px 0 #E5E5E5, 0 14px 24px rgba(0,0,0,0.06)" };
    if (opt === questions[currentIndex]) return { bg: "#58CC02", color: "white", shadow: "0 10px 0 #46A302, 0 14px 24px rgba(88,204,2,0.3)" };
    if (opt === feedback.opt && !feedback.correct) return { bg: "#FF4B4B", color: "white", shadow: "0 10px 0 #D32F2F" };
    return { bg: "white", color: "#E5E5E5", shadow: "0 10px 0 #F5F5F5" };
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 16px 0px", zIndex: 10 }}>
      {/* Top Card Header */}
      <div style={{
        background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(12px)",
        borderRadius: 24, padding: "16px 20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06), inset 0 2px 0 white",
        marginBottom: 8, marginTop: 16, display: "flex", flexDirection: "column", gap: 10, flexShrink: 0
      }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
               <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#E8E0FF", padding: "6px 12px", borderRadius: 12, color: "#9b59b6", fontSize: 13, fontWeight: 900, letterSpacing: 0.5 }}>
                  <Star size={14} fill="#9b59b6" /> MODE PILIHAN
               </div>
               <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, fontWeight: 700, color: "#2A3B5C", marginTop: 8, display: "flex", alignItems: "center", gap: 8, lineHeight: 1 }}>
                  Level {level} <Target size={26} color="#1CB0F6" />
               </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={onClose} style={{ width: 44, height: 44, borderRadius: "50%", background: "white", boxShadow: "0 4px 8px rgba(0,0,0,0.06)", border: "none", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
               <X size={22} />
            </motion.button>
         </div>
         <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
               <span style={{ color: "#2A3B5C" }}>Soal {currentIndex + 1} dari 5</span>
               <span style={{ color: "#1CB0F6" }}>{5 - currentIndex} tersisa</span>
            </div>
            <ProgressBar current={currentIndex} total={5} />
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 16, paddingBottom: 100 }}
        >
          <div style={{ marginBottom: 12, fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#2A3B5C", fontSize: 24, textAlign: "center", textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}>
            Huruf apakah ini?
          </div>

          {/* Hero Card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "relative",
              width: 190, height: 190,
              background: "linear-gradient(135deg, #f8ffeb, #dcf0b8)",
              borderRadius: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 16px 0 #bde690, 0 24px 40px rgba(88,204,2,0.2), inset 0 8px 0 rgba(255,255,255,0.7)",
              marginBottom: 16,
              border: "6px solid white",
              flexShrink: 0
            }}
          >
            <div style={{ position: "absolute", inset: -20, background: "#b4f8a4", opacity: 0.5, filter: "blur(24px)", borderRadius: "50%", zIndex: -1 }} />
            <span style={{ fontSize: 130, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#58CC02", lineHeight: 1, textShadow: "0 6px 0 rgba(88,204,2,0.15)" }}>
              {questions[currentIndex]}
            </span>
          </motion.div>

          {/* Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%", maxWidth: 360 }}>
            {options.map((opt, i) => {
              const style = getOptionStyle(opt);
              return (
                <motion.button
                  key={`${currentIndex}-${opt}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={!feedback ? { scale: 0.94, y: 8, boxShadow: "0 0 0 transparent" } : {}}
                  whileHover={!feedback ? { scale: 1.02 } : {}}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    background: style.bg, border: "none",
                    borderRadius: 28, padding: "24px 16px",
                    fontSize: 56, fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
                    color: style.color,
                    boxShadow: style.shadow,
                    cursor: feedback ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Mascot Footer */}
      <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, display: "flex", alignItems: "flex-end", gap: 12, zIndex: 20, pointerEvents: "none" }}>
         <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: 64, height: 64, position: "relative", flexShrink: 0 }}>
             <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle at 30% 30%, #a8f056, #58cc02)", borderRadius: "50%", boxShadow: "0 6px 0 #46a302", position: "relative" }}>
                 {/* Eyes */}
                 <div style={{ position: "absolute", top: 24, left: 14, width: 10, height: 12, background: "#2A3B5C", borderRadius: "50%" }}>
                     <div style={{ position: "absolute", top: 2, left: 2, width: 3, height: 4, background: "white", borderRadius: "50%" }} />
                 </div>
                 <div style={{ position: "absolute", top: 24, right: 14, width: 10, height: 12, background: "#2A3B5C", borderRadius: "50%" }}>
                     <div style={{ position: "absolute", top: 2, left: 2, width: 3, height: 4, background: "white", borderRadius: "50%" }} />
                 </div>
                 {/* Mouth */}
                 <div style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: 14, height: 8, background: "#2A3B5C", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                     <div style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 10, height: 4, background: "#FF6B9D", borderRadius: "50%" }} />
                 </div>
                 {/* Blush */}
                 <div style={{ position: "absolute", top: 34, left: 6, width: 10, height: 6, background: "#FF8FAD", borderRadius: "50%", opacity: 0.6 }} />
                 <div style={{ position: "absolute", top: 34, right: 6, width: 10, height: 6, background: "#FF8FAD", borderRadius: "50%", opacity: 0.6 }} />
                 {/* Sprout */}
                 <div style={{ position: "absolute", top: -12, left: 30, width: 10, height: 16, background: "#46A302", borderRadius: "10px 0 10px 0" }} />
                 <div style={{ position: "absolute", top: -6, left: 22, width: 10, height: 12, background: "#58CC02", borderRadius: "0 10px 0 10px" }} />
             </div>
         </motion.div>
         
         <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", padding: "16px 20px", borderRadius: "20px 20px 20px 8px", boxShadow: "0 4px 16px rgba(0,0,0,0.06), inset 0 2px 0 white", display: "flex", alignItems: "center", gap: 12 }}>
             <Star size={20} color="#FFD93D" fill="#FFD93D" style={{ filter: "drop-shadow(0 2px 4px rgba(255, 217, 61, 0.3))", flexShrink: 0 }} />
             <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 800, color: "#2A3B5C", lineHeight: 1.3 }}>
               {feedback && feedback.correct ? "Hebat! Kamu benar!" : feedback ? "Oops, coba lagi nanti!" : "Ayo, pilih jawaban yang benar!"}
             </span>
         </div>
      </div>
    </div>
  );
}

const DRAW_LETTERS = ["b", "d", "p", "q", "m"];

function DrawingGame({ level, onComplete, onClose }: { level: number; onComplete: (res: MiniGameResult) => void; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MiniGameResult["detailError"]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    setStartTime(Date.now());
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
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
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = 14; ctx.strokeStyle = "#58CC02";
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y); ctx.stroke();
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 16px 0px", zIndex: 10 }}>
      {/* Top Card Header */}
      <div style={{
        background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(12px)",
        borderRadius: 24, padding: "16px 20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06), inset 0 2px 0 white",
        marginBottom: 8, marginTop: 16, display: "flex", flexDirection: "column", gap: 10, flexShrink: 0
      }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
               <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#E8E0FF", padding: "6px 12px", borderRadius: 12, color: "#9b59b6", fontSize: 13, fontWeight: 900, letterSpacing: 0.5 }}>
                  <Pencil size={14} fill="#9b59b6" /> MODE MENULIS
               </div>
               <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 32, fontWeight: 700, color: "#2A3B5C", marginTop: 8, display: "flex", alignItems: "center", gap: 8, lineHeight: 1 }}>
                  Level {level} <Pencil size={26} color="#1CB0F6" />
               </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={onClose} style={{ width: 44, height: 44, borderRadius: "50%", background: "white", boxShadow: "0 4px 8px rgba(0,0,0,0.06)", border: "none", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
               <X size={22} />
            </motion.button>
         </div>
         <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
               <span style={{ color: "#2A3B5C" }}>Huruf {currentIndex + 1} dari 5</span>
               <span style={{ color: "#1CB0F6" }}>{5 - currentIndex} tersisa</span>
            </div>
            <ProgressBar current={currentIndex} total={5} />
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.25 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", paddingTop: 16, paddingBottom: 16 }}
        >
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 24, color: "#2A3B5C", fontWeight: 800, marginBottom: 4, textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}>
               Tulis huruf ini:
            </div>
            <div style={{ fontSize: 100, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#58CC02", lineHeight: 1, textShadow: "0 5px 0 rgba(88,204,2,0.15)" }}>
              {DRAW_LETTERS[currentIndex]}
            </div>
          </div>

          <div style={{ flex: 1, background: "white", borderRadius: 28, boxShadow: "0 8px 0 #E5E5E5, 0 12px 24px rgba(0,0,0,0.08)", position: "relative", overflow: "hidden", border: "3px solid white" }}>
            {/* Ruled lines */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-evenly", opacity: 0.6 }}>
              <div style={{ height: 2, background: "#E8F7FE", width: "100%" }} />
              <div style={{ height: 2, background: "#E8F7FE", width: "100%" }} />
              <div style={{ height: 3, background: "#1CB0F6", width: "100%", opacity: 0.4 }} />
              <div style={{ height: 2, background: "#E8F7FE", width: "100%" }} />
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

          <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
            <motion.button
              whileTap={{ scale: 0.94, y: 4, boxShadow: "0 0 0 #E0E0E0" }}
              whileHover={{ scale: 1.02 }}
              onClick={clearCanvas}
              style={{
                flex: 1, padding: "20px 14px", borderRadius: 28, border: "none",
                background: "white", color: "#888",
                fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                cursor: "pointer", boxShadow: "0 8px 0 #E5E5E5",
              }}
            >
              <RotateCcw size={20} /> Hapus
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94, y: 6, boxShadow: "0 0 0 #46A302" }}
              whileHover={{ scale: 1.02 }}
              onClick={handleNext}
              style={{
                flex: 2, padding: "20px 14px", borderRadius: 28, border: "none",
                background: "#58CC02", color: "white",
                fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 26,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 10px 0 #46A302, 0 16px 24px rgba(88,204,2,0.25)",
                cursor: "pointer",
              }}
            >
              Lanjut <Check size={26} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ResultScreen({ result, onNext, onRetry }: { result: MiniGameResult; onNext: () => void; onRetry: () => void }) {
  const getMessage = (stars: number) => {
    if (stars === 3) return { text: "Luar Biasa!", sub: "Sempurna tanpa kesalahan!", icon: <Star size={28} color="#FFD93D" fill="#FFD93D" /> };
    if (stars === 2) return { text: "Bagus Banget!", sub: "Hampir sempurna, terus semangat!", icon: <Star size={28} color="#FF9600" fill="#FF9600" /> };
    return { text: "Yay, Kamu Berani!", sub: "Sudah mencoba dengan baik!", icon: <Star size={28} color="#1CB0F6" fill="#1CB0F6" /> };
  };

  const msg = getMessage(result.stars);
  const starColor = [null, "#FFD93D", "#FF9600", "#58CC02"][result.stars] ?? "#FFD93D";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px", zIndex: 10 }}
    >
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", padding: "24px 20px", borderRadius: 32, boxShadow: "0 8px 24px rgba(0,0,0,0.06), inset 0 2px 0 white", width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Stars */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "center" }}>
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: starIdx * 0.12, type: "spring", stiffness: 200, damping: 15 }}
                style={{
                  width: starIdx === 2 ? 80 : 60,
                  height: starIdx === 2 ? 80 : 60,
                  transform: starIdx === 2 ? "translateY(-10px)" : "none",
                  color: starIdx <= result.stars ? "#FFD93D" : "#E5E5E5",
                  filter: starIdx <= result.stars ? "drop-shadow(0 6px 12px rgba(255, 217, 61, 0.4))" : "none"
                }}
              >
                <Star size="100%" fill={starIdx <= result.stars ? "#FFD93D" : "#E5E5E5"} color={starIdx <= result.stars ? "#FFD93D" : "#E5E5E5"} />
              </motion.div>
            ))}
          </div>

          {/* Message */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: starColor, margin: "0 0 8px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, lineHeight: 1.1 }}>
              {msg.text} {msg.icon}
            </h2>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, color: "#888", margin: 0 }}>
              {msg.sub}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ display: "flex", gap: 12, width: "100%", marginBottom: 28 }}>
            <div style={{ flex: 1, background: "#FFF0F5", padding: "16px 12px", borderRadius: 24, textAlign: "center", border: "2px solid white", boxShadow: "0 4px 12px rgba(255, 107, 157, 0.15)" }}>
              <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}><X size={24} color="#FF6B9D" /></div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: "#FF6B9D" }}>{result.totalSalah}</div>
              <div style={{ fontSize: 10, color: "#FF9FCC", fontWeight: 900, letterSpacing: 0.5, fontFamily: "'Nunito', sans-serif", marginTop: 4 }}>TOTAL SALAH</div>
            </div>
            <div style={{ flex: 1, background: "#E8F7FE", padding: "16px 12px", borderRadius: 24, textAlign: "center", border: "2px solid white", boxShadow: "0 4px 12px rgba(28, 176, 246, 0.15)" }}>
              <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}><Clock size={24} color="#1CB0F6" /></div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: "#1CB0F6" }}>{(result.rataWaktu / 1000).toFixed(1)}s</div>
              <div style={{ fontSize: 10, color: "#60A8C8", fontWeight: 900, letterSpacing: 0.5, fontFamily: "'Nunito', sans-serif", marginTop: 4 }}>RATA WAKTU</div>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <motion.button whileTap={{ scale: 0.94, y: 4, boxShadow: "0 0 0 #46A302" }} whileHover={{ scale: 1.02 }} onClick={onNext} style={{ width: "100%", padding: "18px", borderRadius: 24, background: "#58CC02", border: "none", color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, boxShadow: "0 6px 0 #46A302, 0 12px 20px rgba(88,204,2,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              Lanjut <ArrowRight size={20} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.01 }} onClick={onRetry} style={{ width: "100%", padding: "16px", borderRadius: 24, background: "transparent", border: "none", color: "#888", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <RefreshCw size={18} /> Ulangi Level
            </motion.button>
          </motion.div>
      </div>
    </motion.div>
  );
}

export default function MiniGame({ level, onFinish }: MiniGameProps) {
  const isLevel8 = level === 8;
  const [result, setResult] = useState<MiniGameResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 200 }}
      style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #dff6d3 0%, #bcedef 100%)",
        zIndex: 500, display: "flex", flexDirection: "column",
        width: "100%", height: "100%", overflow: "hidden",
        borderRadius: 50,
      }}
    >
      {/* Environmental Background Decorations */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
        {/* Soft glowing orb */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "120%", height: 400, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)" }} />
        
        {/* Floating clouds */}
        <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "15%", left: "-10%", width: 140, height: 60, background: "white", borderRadius: 40, filter: "blur(4px)", opacity: 0.6 }} />
        <motion.div animate={{ x: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ position: "absolute", top: "25%", right: "-5%", width: 100, height: 40, background: "white", borderRadius: 20, filter: "blur(3px)", opacity: 0.5 }} />
        <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: "absolute", top: "60%", left: "10%", width: 80, height: 35, background: "white", borderRadius: 20, filter: "blur(5px)", opacity: 0.4 }} />

        {/* Floating sparkles */}
        {[
          { top: "12%", left: "20%", size: 16, delay: 0 },
          { top: "35%", left: "85%", size: 24, delay: 0.5 },
          { top: "45%", left: "15%", size: 14, delay: 1 },
          { top: "65%", left: "80%", size: 18, delay: 1.5 },
        ].map((star, i) => (
          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: star.delay }} style={{ position: "absolute", top: star.top, left: star.left, color: "#FFF" }}>
             <Sparkles size={star.size} fill="white" />
          </motion.div>
        ))}

        {/* Small shapes */}
        <motion.div animate={{ rotate: 360, y: [0, -10, 0] }} transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} style={{ position: "absolute", top: "28%", left: "8%", width: 12, height: 12, background: "#FFD93D", borderRadius: 3 }} />
        <motion.div animate={{ rotate: -360, y: [0, 15, 0] }} transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }} style={{ position: "absolute", top: "52%", right: "12%", width: 14, height: 14, background: "#58CC02", borderRadius: 4 }} />

        {/* Bottom environment hills */}
        <div style={{ position: "absolute", bottom: -50, left: -40, right: -40, height: 100, zIndex: 5, pointerEvents: "none" }}>
           <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "#a8e6b1", borderRadius: "50% 50% 0 0" }} />
           <div style={{ position: "absolute", bottom: -20, left: -20, width: "70%", height: 80, background: "#88d895", borderRadius: "50%" }} />
           <div style={{ position: "absolute", bottom: -10, right: -20, width: "60%", height: 90, background: "#70cd80", borderRadius: "50%" }} />
           {/* Little purple/green puffy bushes */}
           <div style={{ position: "absolute", bottom: 20, right: 40, width: 40, height: 25, background: "#d3b6f4", borderRadius: "30px 30px 15px 15px" }} />
           <div style={{ position: "absolute", bottom: 15, right: 10, width: 50, height: 30, background: "#e8cfff", borderRadius: "30px 30px 15px 15px" }} />
           <div style={{ position: "absolute", bottom: 10, left: 30, width: 60, height: 35, background: "#98eaab", borderRadius: "30px 30px 15px 15px" }} />
        </div>
      </div>

      {result ? (
        <ResultScreen result={result} onNext={() => onFinish(result)} onRetry={() => { setResult(null); setRetryCount(c => c + 1); }} />
      ) : isLevel8 ? (
        <DrawingGame key={`draw-${retryCount}`} level={level} onComplete={setResult} onClose={() => onFinish({ stars: 0, totalSalah: 0, rataWaktu: 0, detailError: [] })} />
      ) : (
        <MultipleChoiceGame key={`mc-${retryCount}`} level={level} onComplete={setResult} onClose={() => onFinish({ stars: 0, totalSalah: 0, rataWaktu: 0, detailError: [] })} />
      )}
    </motion.div>
  );
}
