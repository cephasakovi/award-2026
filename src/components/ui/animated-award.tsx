"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AnimatedAwardProps {
  className?: string;
}

export default function AnimatedAward({ className = "" }: AnimatedAwardProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[150%] h-[150%] bg-gold/20 blur-[100px] rounded-full"
      />

      {/* Main Trophy */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: [-15, 15, -15],
          opacity: 1,
          rotateY: [-5, 5, -5]
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotateY: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: { duration: 1.5 }
        }}
        className="relative z-10 perspective-1000"
      >
        <Image
          src="/trophy-transparent.png"
          alt="Award Trophy"
          width={600}
          height={800}
          className="w-auto h-[400px] md:h-[600px] object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]"
          priority
        />

        {/* Shine Effect */}
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "linear",
          }}
          className="absolute inset-0 z-20 overflow-hidden pointer-events-none opacity-30"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            transform: "skewX(-20deg)",
          }}
        />
      </motion.div>

      {/* Decorative Particles (Simulated with div) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100],
            x: [0, (i % 2 === 0 ? 50 : -50)],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
          className="absolute w-1 h-1 bg-gold rounded-full blur-[1px]"
          style={{
            left: `${40 + Math.random() * 20}%`,
            top: `${50 + Math.random() * 20}%`,
          }}
        />
      ))}
    </div>
  );
}
