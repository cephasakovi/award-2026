import React from 'react';

// Types for component props
interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  headlineImage?: string;
  headlineElement?: React.ReactNode;
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
  children?: React.ReactNode;
}

// Simplified Hero Component (Content Only)
const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  headlineImage,
  headlineElement,
  subtitle,
  buttons,
  className = "",
  children
}) => {
  return (
    <div className={`relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center ${className}`}>
      {/* ... style jsx ... */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
      
      {/* Children Content (Background elements or foreground) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {children}
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-ivory pt-20">
        {/* Trust Badge */}
        {trustBadge && (
          <div className="mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-6 py-3 bg-gold/10 backdrop-blur-md border border-gold/30 rounded-full text-[10px] uppercase tracking-widest">
              <span className="text-gold">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-6 w-full mx-auto px-4">
          {/* Main Heading with Animation */}
          <div className="space-y-0 flex flex-col items-center w-full">
            {headlineElement ? (
              <div className="animate-fade-in-up animation-delay-200 w-full">
                {headlineElement}
              </div>
            ) : headlineImage ? (
              <div className="animate-fade-in-up animation-delay-200 mb-4">
                <img 
                  src={headlineImage} 
                  alt={headline.line1} 
                  className="h-32 md:h-48 lg:h-64 w-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                />
              </div>
            ) : (
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-sans font-black uppercase tracking-tighter text-ivory animate-fade-in-up animation-delay-200">
                {headline.line1}
              </h1>
            )}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-gold animate-fade-in-up animation-delay-400 -mt-4 md:-mt-8">
              {headline.line2}
            </h1>
          </div>
          
          {/* Subtitle with Animation */}
          <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
            <p className="text-lg md:text-xl lg:text-2xl text-ivory/60 font-light leading-relaxed">
              {subtitle}
            </p>
          </div>
          
          {/* CTA Buttons with Animation */}
          {buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up animation-delay-800">
              {buttons.primary && (
                <button 
                  onClick={buttons.primary.onClick}
                  className="px-10 py-4 bg-gold hover:bg-gold/80 text-anthracite rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105"
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button 
                  onClick={buttons.secondary.onClick}
                  className="px-10 py-4 bg-transparent hover:bg-ivory/5 border border-ivory/20 text-ivory rounded-sm font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
