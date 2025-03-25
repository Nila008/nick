'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';

const Hero = () => {
  // Typewriter effect - use useMemo to prevent recreation on each render
  const titles = useMemo(() => ["VIDEO EDITOR", "GRAPHIC DESIGNER", "3D EDITOR"], []);
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    
    // Handle deleting and typing
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
        setTypingSpeed(150);
        
        // If we finished typing
        if (displayText.length === currentTitle.length) {
          // Pause at the end
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
        setTypingSpeed(50);
        
        // If we finished deleting
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((titleIndex + 1) % titles.length);
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex, titles, typingSpeed]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-green-900/20" />
      
      {/* Floating software icons with pop-up animations */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ 
          scale: { type: "spring", stiffness: 260, damping: 20, delay: 0.5 },
          opacity: { duration: 0.8, delay: 0.5 }
        }}
        className="absolute top-1/4 left-1/4 transform -translate-x-1/2"
        whileHover={{
          scale: 1.1,
          opacity: 0.8,
          filter: "brightness(1.2)",
          transition: { duration: 0.3 }
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            delay: 1.5,
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/pr-icon.png"
            alt="Premiere Pro Icon"
            width={150}
            height={150}
            className="filter drop-shadow-[0_0_15px_rgba(187,37,181,0.6)] transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(187,37,181,0.8)]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.75 }}
        transition={{ 
          scale: { type: "spring", stiffness: 260, damping: 20, delay: 0.8 },
          opacity: { duration: 0.8, delay: 0.8 }
        }}
        className="absolute top-1/2 right-1/4 transform translate-x-1/3"
        whileHover={{
          scale: 1.1,
          opacity: 0.9,
          filter: "brightness(1.2)",
          transition: { duration: 0.3 }
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            delay: 1.8,
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/ae-icon.png"
            alt="After Effects Icon"
            width={120}
            height={120}
            className="filter drop-shadow-[0_0_15px_rgba(187,37,181,0.6)] transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(187,37,181,0.8)]"
          />
        </motion.div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4 sm:px-6 lg:px-8"
        >
          <motion.h2 
            className="text-purple-500 font-mono mb-2 transition-colors duration-300 hover:text-purple-400 cursor-default"
            whileHover={{ scale: 1.02 }}
          >
            Nick's Portfolio
          </motion.h2>
          <motion.h1 
            className="text-white text-6xl sm:text-7xl font-bold mb-4 leading-tight transition-colors duration-300 hover:text-purple-100 cursor-default"
            whileHover={{ scale: 1.01 }}
          >
            PROFESSIONAL<br />
            <span className="inline-block min-h-[1.2em]">{displayText}</span>
            <span className="text-purple-500 animate-blink">|</span>
          </motion.h1>
          <motion.p 
            className="text-gray-300 text-xl mb-8 transition-colors duration-300 hover:text-white cursor-default"
            whileHover={{ scale: 1.02 }}
          >
            Making Your Videos Look More Cool.
          </motion.p>
          <Link 
            href="#projects"
            scroll={false}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(147,51,234,0.7)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-8 py-3 rounded-md font-mono
                         hover:bg-purple-500 transition-all duration-300
                         shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            >
              VIEW PORTFOLIO
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 
