"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, X, Pencil, RotateCcw, Check, RefreshCw, Clock, Star, ArrowRight } from "lucide-react";


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
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ background: i < current ? "#58CC02" : i === current ? "#1CB0F6" : "#E5E5E5" }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, height: 10, borderRadius: 5 }}
        />
      ))}
    </div>
  );
}

function MultipleChoiceGame({ onComplete }: { onComplete: (res: MiniGameResult) => void }) {
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
    }, 600);
  };

  const getOptionStyle = (opt: string) => {
    if (!feedback) return { bg: "white", color: "#3C3C3C", shadow: "0 6px 0 #E0E0E0, 0 8px 16px rgba(0,0,0,0.04)", border: "2px solid #F0F0F0" };
    if (opt === questions[currentIndex]) return { bg: "#D7F5B1", color: "#2d7a00", shadow: "0 6px 0 #58CC0244", border: "2px solid #58CC0244" };
    if (opt === feedback.opt && !feedback.correct) return { bg: "#FDECEA", color: "#c0392b", shadow: "none", border: "2px solid #f5c6c0" };
    return { bg: "white", color: "#CCC", shadow: "none", border: "2px solid #F0F0F0" };
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px 36px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, color: "#888", fontSize: 14 }}>
            Soal {currentIndex + 1} dari 5
          </span>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: "#1CB0F6" }}>
            {5 - currentIndex} tersisa
          </span>
        </div>
        <ProgressBar current={currentIndex} total={5} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          {/* Question prompt */}
          <div style={{ marginBottom: 16, fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#888", fontSize: 16, textAlign: "center" }}>
            Huruf apakah ini?
          </div>

          {/* Letter display */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 160, height: 160,
              background: "linear-gradient(145deg, #f0fde4, #d7f5b1)",
              borderRadius: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 10px 0 #c8e8a0, 0 16px 32px rgba(88,204,2,0.15)",
              marginBottom: 44,
              border: "3px solid rgba(88,204,2,0.15)",
            }}
          >
            <span style={{ fontSize: 110, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#46A302", lineHeight: 1 }}>
              {questions[currentIndex]}
            </span>
          </motion.div>

          {/* Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
            {options.map((opt, i) => {
              const style = getOptionStyle(opt);
              return (
                <motion.button
                  key={`${currentIndex}-${opt}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={!feedback ? { scale: 0.92, y: 6 } : {}}
                  whileHover={!feedback ? { scale: 1.04, y: -2 } : {}}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    background: style.bg, border: style.border,
                    borderRadius: 28, padding: "26px",
                    fontSize: 52, fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
                    color: style.color,
                    boxShadow: style.shadow,
                    cursor: feedback ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ margin: "0 24px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, color: "#888", fontSize: 14 }}>
            Huruf {currentIndex + 1} dari 5
          </span>
        </div>
        <ProgressBar current={currentIndex} total={5} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div style={{ textAlign: "center", marginBottom: 12, padding: "0 24px" }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: "#888", fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Pencil size={15} /> Tulis huruf ini:
            </div>
            <div style={{ fontSize: 72, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, color: "#46A302", lineHeight: 1 }}>
              {DRAW_LETTERS[currentIndex]}
            </div>
          </div>

          <div style={{ flex: 1, margin: "0 24px", background: "white", borderRadius: 32, boxShadow: "0 8px 0 #E0E0E0, 0 16px 32px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden", border: "2px solid #F0F0F0" }}>
            {/* Ruled lines */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-evenly", opacity: 0.5 }}>
              <div style={{ height: 1.5, background: "#E8F7FE", width: "100%" }} />
              <div style={{ height: 1.5, background: "#E8F7FE", width: "100%" }} />
              <div style={{ height: 2, background: "#1CB0F6", width: "100%", opacity: 0.3 }} />
              <div style={{ height: 1.5, background: "#E8F7FE", width: "100%" }} />
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

          <div style={{ display: "flex", gap: 14, padding: "20px 24px" }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={clearCanvas}
              style={{
                flex: 1, padding: 16, borderRadius: 22, border: "none",
                background: "#F7F7F7", color: "#888",
                fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                cursor: "pointer", boxShadow: "0 4px 0 #E0E0E0",
              }}
            >
              <RotateCcw size={18} /> Hapus
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95, y: 4 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleNext}
              style={{
                flex: 2, padding: 16, borderRadius: 22, border: "none",
                background: "#58CC02", color: "white",
                fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 6px 0 #46A302, 0 12px 20px rgba(88,204,2,0.25)",
                cursor: "pointer",
              }}
            >
              Lanjut <Check size={18} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ResultScreen({ result, onNext, onRetry }: { result: MiniGameResult; onNext: () => void; onRetry: () => void }) {
  const getFeedback = (stars: number) => {
    if (stars === 3) return { text: "Hebat!", sub: "Kamu pintar banget hari ini!", color: "#58CC02", icon: "🌟" };
    if (stars === 2) return { text: "Bagus!", sub: "Sedikit lagi jadi sempurna!", color: "#FF9600", icon: "✨" };
    return { text: "Yay!", sub: "Kamu sudah mencoba dengan baik!", color: "#1CB0F6", icon: "👍" };
  };

  const msg = getFeedback(result.stars);
  const starColor = msg.color;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}
    >
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20, staggerChildren: 0.15 } }
        }} 
        initial="hidden"
        animate="visible"
        style={{ display: "flex", gap: 16, marginBottom: 40, alignItems: "center" }}
      >
        {[1, 2, 3].map((starIdx) => (
          <motion.div
            key={starIdx}
            variants={{
              hidden: { opacity: 0, scale: 0, rotate: -45 },
              visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
            }}
            style={{
              width: starIdx === 2 ? 90 : 68,
              height: starIdx === 2 ? 90 : 68,
              transform: starIdx === 2 ? "translateY(-12px)" : "none",
              color: starIdx <= result.stars ? "#FFD93D" : "#E5E5E5",
            }}
          >
            <Star size="100%" fill={starIdx <= result.stars ? "#FFD93D" : "#E5E5E5"} color={starIdx <= result.stars ? "#FFD93D" : "#E5E5E5"} />
          </motion.div>
        ))}
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 32, color: starColor, margin: "0 0 8px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          {msg.text} {msg.icon}
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, color: "#888", margin: 0 }}>
          {msg.sub}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{ display: "flex", gap: 14, width: "100%", marginBottom: 36 }}
      >
        <div style={{ flex: 1, background: "#FFF0F5", padding: "18px 14px", borderRadius: 22, textAlign: "center", border: "2px solid #FFE0EE" }}>
          <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}>
            <X size={24} color="#FF6B9D" />
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: "#FF6B9D" }}>{result.totalSalah}</div>
          <div style={{ fontSize: 11, color: "#FF9FCC", fontWeight: 900, letterSpacing: 0.5, fontFamily: "'Nunito', sans-serif" }}>TOTAL SALAH</div>
        </div>
        <div style={{ flex: 1, background: "#E8F7FE", padding: "18px 14px", borderRadius: 22, textAlign: "center", border: "2px solid #B0DFF8" }}>
          <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}>
            <Clock size={24} color="#1CB0F6" />
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26, color: "#1CB0F6" }}>{(result.rataWaktu / 1000).toFixed(1)}s</div>
          <div style={{ fontSize: 11, color: "#60A8C8", fontWeight: 900, letterSpacing: 0.5, fontFamily: "'Nunito', sans-serif" }}>RATA WAKTU</div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}
      >
        <motion.button
          whileTap={{ scale: 0.96, y: 4 }}
          whileHover={{ scale: 1.02 }}
          onClick={onNext}
          style={{
            width: "100%", padding: "18px", borderRadius: 24,
            background: "#58CC02", border: "none",
            color: "white", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20,
            boxShadow: "0 8px 0 #46A302, 0 16px 24px rgba(88,204,2,0.25)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          Lanjut <ArrowRight size={20} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.01 }}
          onClick={onRetry}
          style={{
            width: "100%", padding: "16px", borderRadius: 24,
            background: "white", border: "2.5px solid #E5E5E5",
            color: "#888", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 17,
            boxShadow: "0 4px 0 #E0E0E0",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <RefreshCw size={18} /> Ulangi Level
        </motion.button>
      </motion.div>
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
        background: "white",
        zIndex: 500, display: "flex", flexDirection: "column",
        width: "100%", height: "100%", overflow: "hidden",
        borderRadius: 50,
      }}
    >
      {/* Header */}
      {!result && (
        <div style={{
          padding: "36px 24px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "2px solid #F5F5F5",
          background: "linear-gradient(155deg, #f0fde4 0%, #e8f7fe 100%)",
        }}>
          <div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#888", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
              {isLevel8 ? <><Pencil size={12} /> Mode Menulis</> : <><Target size={12} /> Mode Pilihan</>}
            </div>
            <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 28, color: "#3C3C3C", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              Level {level} <Target size={22} color="#1CB0F6" />
            </h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onFinish({ stars: 0, totalSalah: 0, rataWaktu: 0, detailError: [] })}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "white", border: "2px solid #E5E5E5",
              color: "#888", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 0 #E0E0E0, 0 8px 12px rgba(0,0,0,0.04)", cursor: "pointer",
            }}
          >
            <X size={20} />
          </motion.button>
        </div>
      )}

      {result ? (
        <ResultScreen result={result} onNext={() => onFinish(result)} onRetry={() => { setResult(null); setRetryCount(c => c + 1); }} />
      ) : isLevel8 ? (
        <DrawingGame key={`draw-${retryCount}`} onComplete={setResult} />
      ) : (
        <MultipleChoiceGame key={`mc-${retryCount}`} onComplete={setResult} />
      )}
    </motion.div>
  );
}
