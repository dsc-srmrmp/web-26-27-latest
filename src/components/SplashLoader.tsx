"use client";

/**
 * SplashLoader — Fullscreen multilingual greeting loader
 * Inspired by kokonutui DynamicText by @dorianbaffier
 * Cycles through greetings in different languages, then reveals the site.
 */

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Greeting {
  text: string;
  language: string;
}

const greetings: Greeting[] = [
  { text: "Hello", language: "English" },
  { text: "こんにちは", language: "Japanese" },
  { text: "Bonjour", language: "French" },
  { text: "Hola", language: "Spanish" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Ciao", language: "Italian" },
  { text: "Hallo", language: "German" },
  { text: "வணக்கம்", language: "Tamil" },
  { text: "नमस्ते", language: "Hindi" },
];

export default function SplashLoader() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  // Always display intro loader on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("dsc-splash-seen");
      } catch {}
      document.body.classList.add("splash-active");
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.classList.remove("splash-active");
      }
    };
  }, []);

  // Cycle through greetings — avoid calling setState from within setState
  useEffect(() => {
    if (!visible) return;

    intervalRef.current = setInterval(() => {
      const nextIndex = indexRef.current + 1;

      if (nextIndex >= greetings.length) {
        // Done cycling — clear interval, hold briefly, then fade
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          setFading(true);
        }, 600);
        return;
      }

      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, 280);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible]);

  // Once fade-out animation ends, remove the loader
  function handleFadeEnd() {
    if (!fading) return;
    setVisible(false);
    if (typeof window !== "undefined") {
      document.body.classList.remove("splash-active");
    }
  }

  if (!visible) return null;

  const progress = (currentIndex + 1) / greetings.length;

  return (
    <motion.div
      className="splash-loader"
      animate={fading ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleFadeEnd}
    >
      {/* Subtle background grain overlay */}
      <div className="splash-grain" />

      {/* Accent glow orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />

      <div className="splash-center">
        <div className="splash-text-container">
          <AnimatePresence mode="popLayout">
            <motion.div
              className="splash-greeting"
              key={currentIndex}
              initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -60, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <span className="splash-dot" />
              <span className="splash-word">{greetings[currentIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="splash-progress-track">
        <motion.div
          className="splash-progress-bar"
          animate={{ scaleX: fading ? 1 : progress }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
