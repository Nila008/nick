'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollThreshold = 10; // Amount of scroll needed to trigger hide/show

  // Handle scroll event with debouncing
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we're at the hero section
      const isAtHero = currentScrollY < 50;
      
      // Update background based on scroll position
      setIsScrolled(currentScrollY > 10);
      
      // Calculate scroll difference
      const scrollDifference = currentScrollY - lastScrollY.current;
      
      // Debounce rapid scroll changes to prevent flickering
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // Only trigger visibility changes when scroll difference exceeds threshold
      if (Math.abs(scrollDifference) > scrollThreshold) {
        // Show navbar when:
        // 1. At the top/hero section, OR
        // 2. Scrolling up
        if (isAtHero || scrollDifference < 0) {
          setIsVisible(true);
        } 
        // Hide navbar when scrolling down and not at hero
        else if (scrollDifference > 0) {
          // Short delay before hiding to prevent flickering on scroll direction changes
          scrollTimer.current = setTimeout(() => {
            setIsVisible(false);
            // Close mobile menu when hiding navbar
            if (isMenuOpen) {
              setIsMenuOpen(false);
            }
          }, 100);
        }
      }
      
      // Update the last scroll position
      lastScrollY.current = currentScrollY;
    };
    
    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.16, 1, 0.3, 1] // Custom spring-like easing for smoother motion
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white font-bold text-xl"
            >
              <Link href="/">
                <span className="text-purple-500 hover:text-purple-400 transition-colors duration-300">
                  Nick<span className="text-white">Editz</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:flex space-x-8"
            >
              {['projects', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-white hover:text-purple-400 transition-colors duration-300 capitalize"
                >
                  {item}
                </button>
              ))}
            </motion.nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 focus:outline-none"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className="w-6 flex flex-col items-end justify-center space-y-1.5">
                  <motion.span
                    animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    className={`block h-0.5 ${isMenuOpen ? 'w-6' : 'w-6'} bg-white transition-transform duration-300`}
                  ></motion.span>
                  <motion.span
                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block h-0.5 w-5 bg-white transition-opacity duration-300"
                  ></motion.span>
                  <motion.span
                    animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    className={`block h-0.5 ${isMenuOpen ? 'w-6' : 'w-4'} bg-white transition-transform duration-300`}
                  ></motion.span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 py-5 space-y-4">
                {['projects', 'about', 'contact'].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    <button
                      onClick={() => scrollToSection(item)}
                      className="text-white hover:text-purple-400 transition-colors duration-300 capitalize w-full text-left py-2 border-b border-purple-900/30"
                    >
                      {item}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Scroll Up Indicator - Only shows when navbar is hidden and not at very top */}
      <AnimatePresence>
        {!isVisible && isScrolled && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-40 px-4 py-1 bg-purple-600/80 rounded-b-lg backdrop-blur-sm cursor-pointer shadow-md"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsVisible(true);
            }}
          >
            <div className="flex items-center space-x-1 text-white text-xs">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-bounce"
              >
                <path d="M18 15l-6-6-6 6"/>
              </svg>
              <span>Scroll up for menu</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 