import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BackToTopButtonProps {
  /** Scroll threshold in pixels before the button appears. Default is 420 (past hero section) */
  threshold?: number;
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({ threshold = 420 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show when scrolled down past hero section
      if (currentScrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress percentage (0 to 100)
      if (totalScrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalScrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    // Passive listener for best performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG Circle calculation for circular progress ring
  const size = 44;
  const strokeWidth = 2.5;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-22 right-6 z-40"
        >
          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Scroll back to top"
            className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-[#1C1917] hover:bg-[#2C2723] text-[#FAF7F2] hover:text-[#C5A059] shadow-xl border border-[#DFCBB0]/60 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/60"
          >
            {/* Circular SVG Scroll Progress Indicator */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-stone-800"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress track in Antique Gold */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-[#C5A059] transition-[stroke-dashoffset] duration-150 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Icon */}
            <ArrowUp className="w-4 h-4 text-[#E8DCC4] group-hover:text-[#C5A059] transition-transform duration-300 group-hover:-translate-y-0.5 z-10" />

            {/* Hover Tooltip for desktop */}
            <span className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 bg-[#1C1917] text-[#FAF7F2] text-[10px] font-semibold tracking-wider uppercase rounded-md shadow-lg border border-[#DFCBB0]/40 whitespace-nowrap hidden sm:block">
              Back to Top
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
