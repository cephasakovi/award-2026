"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type Nominee = {
  id: string;
  name: string;
  description: string;
  score: number;
  photo?: string;
};

type Category = {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  nominees: Nominee[];
};

interface InteractiveVotingProps {
  categories: Category[];
  votes: Record<string, string>;
  handleVote: (categoryId: string, nomineeId: string) => Promise<void>;
  loadingVote: string | null;
}

export default function InteractiveVoting({
  categories,
  votes,
  handleVote,
  loadingVote,
}: InteractiveVotingProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="vote" className="relative min-h-screen w-full overflow-hidden flex flex-col pt-20">
      {/* Parisian Salon Wall Background */}
      <div className="absolute inset-0 bg-[#0a0a0a] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,50,40,0.25),transparent_80%)] z-0" />
      
      {/* Decorative Wall Molding (Haussmann Style) */}
      <div className="absolute inset-x-0 top-[30%] h-[1px] bg-ivory/[0.05] z-0" />
      <div className="absolute inset-x-0 top-[32%] h-[2px] bg-ivory/[0.03] z-0" />

      <AnimatePresence mode="wait">
        {!activeCategoryId ? (
          <motion.div
            key="categories-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex-1 flex flex-col"
          >
            {/* Gallery Header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 mb-12 sm:mb-20 text-center">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-signature text-4xl sm:text-6xl text-gold mb-4 sm:mb-6"
              >
                Le Grand Salon
              </motion.div>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl text-ivory tracking-[0.12em] sm:tracking-[0.2em] uppercase font-light">
                Les Œuvres de l&apos;Excellence
              </h2>
              <div className="mt-6 sm:mt-10 flex items-center justify-center gap-3 sm:gap-6">
                <div className="h-[0.5px] w-10 sm:w-24 bg-gold/40" />
                <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.6em] text-gold/80 italic">
                  Sélection Officielle 2026
                </span>
                <div className="h-[0.5px] w-10 sm:w-24 bg-gold/40" />
              </div>
            </div>

            {/* Gallery Wall - Categories */}
            <div className="flex-1 flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 sm:px-6 md:px-[15vw] pb-28 sm:pb-40 md:pb-48">
              <div className="flex gap-8 sm:gap-16 md:gap-24">
                {categories.map((category, idx) => {
                  const isVoted = !!votes[category.id];
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ delay: idx * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -15, transition: { duration: 0.5 } }}
                      onClick={() => setActiveCategoryId(category.id)}
                      className="flex-none w-[88vw] sm:w-[350px] md:w-[450px] snap-center cursor-pointer group"
                    >
                      {/* Parisian Ornate Frame for Categories */}
                      <div className="parisian-frame group-hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,1),0_0_30px_rgba(212,175,55,0.15)] transition-all duration-1000">
                        <div className="parisian-frame-inner">
                          <article className="relative h-[430px] sm:h-[480px] md:h-[600px] bg-[#050505] flex flex-col items-center justify-center p-4 sm:p-6 md:p-14 text-center">
                            {/* Texture background */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
                            
                            <div className="relative z-10">
                              <span className="font-serif text-6xl sm:text-9xl text-gold/[0.05] block mb-6 sm:mb-10 italic group-hover:text-gold/[0.1] transition-colors duration-1000">
                                {category.index}
                              </span>
                              <h3 className="font-serif text-3xl sm:text-5xl text-ivory/90 mb-6 sm:mb-8 leading-[1.1] tracking-tight group-hover:text-gold transition-colors duration-700">
                                {category.name}
                              </h3>
                              <p className="text-[10px] text-gold/40 uppercase tracking-[0.5em] mb-12 italic">
                                {category.subtitle}
                              </p>
                            </div>

                            <div className="mt-auto flex flex-col items-center z-10">
                              <div className="w-16 h-[0.5px] bg-gold/30 mb-8" />
                              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-ivory/20 group-hover:text-gold/60 transition-all">
                                Découvrir le Portrait
                              </span>
                              {isVoted && (
                                <div className="mt-8 font-signature text-3xl text-gold animate-pulse">Voté</div>
                              )}
                            </div>

                            {/* Lighting effect on "canvas" */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                          </article>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="nominees-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex-1 flex flex-col w-full"
          >
            {/* Nominees Gallery Header */}
            <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 pt-8 sm:pt-10 mb-10 sm:mb-12">
              <button
                onClick={() => setActiveCategoryId(null)}
                className="flex items-center gap-2 sm:gap-4 text-gold/40 hover:text-gold transition-all mb-8 sm:mb-12 group"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-3 transition-transform" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.6em] italic">Quitter le Salon</span>
              </button>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-10 border-b border-ivory/5 pb-10 sm:pb-16">
                <div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-signature text-4xl sm:text-5xl text-gold mb-3 sm:mb-4"
                  >
                    {activeCategory?.subtitle}
                  </motion.div>
                  <h2 className="font-serif text-3xl sm:text-5xl md:text-8xl text-ivory tracking-[0.18em] sm:tracking-widest uppercase font-light">
                    {activeCategory?.name}
                  </h2>
                </div>
                
                <div className="hidden sm:flex gap-6 pb-2">
                  <button 
                    onClick={() => scroll("left")}
                    className="w-18 h-18 md:w-20 md:h-20 border border-ivory/10 flex items-center justify-center rounded-full hover:border-gold hover:text-gold transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] group"
                  >
                    <ChevronLeft size={32} className="opacity-40 group-hover:opacity-100" />
                  </button>
                  <button 
                    onClick={() => scroll("right")}
                    className="w-18 h-18 md:w-20 md:h-20 border border-ivory/10 flex items-center justify-center rounded-full hover:border-gold hover:text-gold transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] group"
                  >
                    <ChevronRight size={32} className="opacity-40 group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Slider - Nominees as Framed Parisian Portraits */}
            <div 
              ref={scrollRef}
              className="flex-1 flex items-center overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 md:px-[calc(50vw-min(650px,45vw))] pb-28 sm:pb-40 md:pb-56"
            >
              <div className="flex gap-8 sm:gap-16 md:gap-32">
                {activeCategory?.nominees.map((nominee, idx) => {
                  const alreadyVoted = votes[activeCategory.id] === nominee.id;
                  const categoryLocked = !!votes[activeCategory.id];
                  
                  return (
                    <motion.div
                      key={nominee.id}
                      initial={{ opacity: 0, scale: 0.8, rotateX: 10 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="flex-none w-[90vw] sm:w-[450px] md:w-[550px] snap-center"
                    >
                      {/* The Haussmann Parisian Frame */}
                      <div className="parisian-frame-haussmann group hover:shadow-[0_80px_120px_-30px_rgba(0,0,0,1)] transition-all duration-1000">
                        <div className="parisian-frame-inner">
                          <article className="relative h-[520px] sm:h-[560px] md:h-[750px] bg-[#080808] flex flex-col group overflow-hidden">
                            
                            {/* Real Portrait Image */}
                            <div className="relative h-[65%] w-full bg-[#111] overflow-hidden">
                              {nominee.photo ? (
                                nominee.photo.startsWith("data:") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={nominee.photo}
                                    alt={nominee.name}
                                    className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                  />
                                ) : (
                                  <Image
                                    src={nominee.photo}
                                    alt={nominee.name}
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                  />
                                )
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="font-serif text-[150px] text-ivory/[0.03]">
                                    {nominee.name[0]}
                                  </span>
                                </div>
                              )}
                              
                              {/* Oil Painting Varnish Effect */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/5 pointer-events-none" />
                              
                              {/* Bottom Label of the Painting */}
                              <div className="absolute bottom-0 w-full p-6 sm:p-12 bg-gradient-to-t from-black via-black/60 to-transparent">
                                <motion.h3 
                                  className="font-serif text-3xl sm:text-5xl text-ivory tracking-wide mb-2 sm:mb-4"
                                >
                                  {nominee.name}
                                </motion.h3>
                                <p className="text-[9px] sm:text-[11px] text-gold/70 uppercase tracking-[0.25em] sm:tracking-[0.5em] italic font-light">
                                  {nominee.description}
                                </p>
                              </div>
                            </div>

                            {/* Canvas Bottom - Actions & Brass Plate */}
                            <div className="flex-1 p-4 sm:p-6 md:p-12 flex flex-col justify-center items-center bg-[#050505] relative">
                              {/* Museum Brass Plate Effect */}
                              <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 px-4 sm:px-8 py-2 sm:py-3 bg-[#c5a059] text-black shadow-lg">
                                <div className="text-[9px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">
                                  Sélection Officielle • N°{idx + 1}
                                </div>
                                <div className="absolute inset-1 border border-black/20" />
                              </div>

                              <div className="mt-4 md:mt-8 w-full">
                                <button
                                  className={`w-full py-3 sm:py-4 md:py-7 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.5em] transition-all relative overflow-hidden group/btn ${
                                    alreadyVoted 
                                      ? "bg-gold text-black border-gold" 
                                      : categoryLocked 
                                      ? "bg-transparent text-ivory/10 border border-ivory/5 cursor-not-allowed" 
                                      : "bg-transparent text-gold border border-gold/30 hover:border-gold hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]"
                                  }`}
                                  onClick={() => handleVote(activeCategory.id, nominee.id)}
                                  disabled={categoryLocked || loadingVote === nominee.id}
                                >
                                  <span className="relative z-10">
                                    {loadingVote === nominee.id 
                                      ? "Homologation..." 
                                      : alreadyVoted 
                                      ? "Veu enregistré ✓" 
                                      : categoryLocked 
                                      ? "Session Cloturée" 
                                      : "Exprimer mon Choix"}
                                  </span>
                                  
                                  {!alreadyVoted && !categoryLocked && (
                                    <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </article>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {/* Spacer to allow centering last item */}
                <div className="flex-none w-[10vw] sm:w-[25vw]" />
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="fixed bottom-20 sm:bottom-32 left-0 w-full flex justify-center pointer-events-none z-20">
               <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-ivory/40 text-[9px] sm:text-[10px] uppercase tracking-[0.5em] sm:tracking-[1em] flex flex-col items-center gap-4 sm:gap-6"
               >
                 <span>Voyage au cœur de l&apos;art</span>
                 <div className="h-[50px] w-[0.5px] bg-gold/20 relative">
                   <motion.div 
                     animate={{ y: [0, 50] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-gold/60 to-transparent" 
                   />
                 </div>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Museum Floor Element - Parisian Wood Parquet */}
      <div className="museum-floor-parisian" />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Parisian Golden Frame Style */
        .parisian-frame {
          padding: 18px;
          background: #d4af37;
          background: linear-gradient(135deg, #8b6508 0%, #d4af37 20%, #ffd700 45%, #d4af37 70%, #8b6508 100%);
          box-shadow: 
            0 40px 80px -20px rgba(0,0,0,0.9),
            inset 0 2px 4px rgba(255,255,255,0.5),
            inset 0 -2px 4px rgba(0,0,0,0.5);
          position: relative;
          border-radius: 2px;
        }

        /* Haussmann Black & Gold Frame Style */
        .parisian-frame-haussmann {
          padding: 18px;
          background: #111;
          background: linear-gradient(145deg, #000 0%, #222 45%, #111 55%, #000 100%);
          box-shadow: 
            0 50px 100px -25px rgba(0,0,0,1),
            inset 0 1px 1px rgba(255,255,255,0.1);
          position: relative;
          border-radius: 2px;
        }

        .parisian-frame-inner {
          border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 4px;
          position: relative;
        }

        .parisian-frame::before, .parisian-frame-haussmann::before {
          content: "";
          position: absolute;
          inset: 8px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          pointer-events: none;
        }

        .parisian-frame-haussmann::after {
          content: "";
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          pointer-events: none;
        }

        /* Parisian Versailles Parquet Floor */
        .museum-floor-parisian {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 160px;
          background: #1a1510;
          background-image: 
            linear-gradient(rgba(0,0,0,0.9) 0%, transparent 100%),
            url('https://www.transparenttextures.com/patterns/wood-pattern.png');
          z-index: 5;
          pointer-events: none;
          box-shadow: inset 0 60px 100px rgba(0,0,0,1);
          opacity: 0.8;
        }

        @media (min-width: 640px) {
          .parisian-frame {
            padding: 30px;
          }

          .parisian-frame-haussmann {
            padding: 35px;
          }

          .museum-floor-parisian {
            height: 250px;
          }
        }

        .museum-floor-parisian::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
        }
      `}</style>
    </section>
  );
}
