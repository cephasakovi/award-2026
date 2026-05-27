"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroCinematic() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if intro was already shown in this session
    const hasSeenIntro = sessionStorage.getItem("awards-intro-seen");
    if (hasSeenIntro) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("awards-intro-seen", "true");
    }, 1000); // Wait for fade out animation
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden cursor-pointer"
          onClick={handleDismiss}
        >
          {/* Background Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            onCanPlayThrough={() => {
              if (videoRef.current) videoRef.current.playbackRate = 0.8;
            }}
          >
            <source src="/intro-video.mp4" type="video/mp4" />
          </video>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-radial-gradient" 
               style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }} 
          />

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col items-center h-full justify-between py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="font-signature text-gold text-4xl md:text-6xl mb-2 drop-shadow-lg">
                Bienvenue à la cérémonie
              </div>
              <div className="text-ivory/60 text-[10px] tracking-[0.4em] uppercase">
                Édition Universitaire 2026
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-ivory/50 text-xs tracking-[0.6em] uppercase drop-shadow-md"
            >
              Cliquez pour entrer
            </motion.div>
          </div>

          {/* Border Decoration */}
          <div className="absolute inset-8 border border-gold/10 pointer-events-none" />
          <div className="absolute inset-12 border border-gold/5 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
