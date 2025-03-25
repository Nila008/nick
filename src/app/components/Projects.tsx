'use client';
import { motion, PanInfo } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// Type definitions for YouTube API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          events?: {
            onStateChange?: (event: { data: number }) => void;
            onReady?: (event: { target: unknown }) => void;
          };
          videoId?: string;
        }
      ) => unknown;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Project {
  id: number;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Fast-Paced",
    description: "A informative video just like the issac style",
    youtubeId: "0lz5rZFNeRI?si=MkeCgiYDmK99hX9Z",
    category: "Ai"
  },
  {
    id: 2,
    title: "Young Trader",
    description: "Money Related Video",
    youtubeId: "JJoMC11prOM",
    category: "Money"
  },
  {
    id: 3,
    title: "Informative",
    description: "Issac Style",
    youtubeId: "C3suS54H1wg",
    category: "Information"
  },
  {
    id: 4,
    title: "3d Car",
    description: "Car animation",
    youtubeId: "NaZY8HP5DCk",
    category: "Car"
  },
  {
    id: 5,
    title: "Fortnite Video",
    description: "Gaming Video",
    youtubeId: "L7YxgP5qeOc",
    category: "Gaming"
  },
  // Add more projects as needed
];

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [showInfoHint, setShowInfoHint] = useState(false);

  // Add YouTube API script
  useEffect(() => {
    // Add YouTube API if not already added
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Store original callback if it exists
    const originalCallback = window.onYouTubeIframeAPIReady;
    
    // Create global callback for when YouTube API is ready
    window.onYouTubeIframeAPIReady = setupYouTubePlayer;

    // Cleanup
    return () => {
      // Restore original callback or set to empty function
      window.onYouTubeIframeAPIReady = originalCallback || (() => {});
    };
  }, []);

  // Setup YouTube player when API is ready and slide changes
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setupYouTubePlayer();
    }
  }, [currentSlide]);

  // Reset player when manually selecting a video
  useEffect(() => {
    if (isVideoPlaying) {
      // Reset any existing players when a grid video is clicked
      if (window.YT && window.YT.Player && iframeRef.current) {
        setupYouTubePlayer();
      }
    }
  }, [isVideoPlaying]);

  const setupYouTubePlayer = () => {
    // Make sure the iframe is ready in the DOM
    if (!iframeRef.current) return;

    // Get the iframe ID
    const iframeId = iframeRef.current.id;
    if (!iframeId) return;

    // Create new player or destroy existing one
    if (window.YT && window.YT.Player) {
      // Create new YouTube player instance
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const player = new window.YT.Player(iframeId, {
        events: {
          onStateChange: (event: { data: number }) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (event.data === 1) {
              // Video is playing, pause auto-slide
              setIsVideoPlaying(true);
              setAutoPlay(false);
              setShowControls(false); // Hide title initially when playback starts
            } else if (event.data === 0 || event.data === 2) {
              // Video is paused or ended, resume auto-slide
              setIsVideoPlaying(false);
              setAutoPlay(true);
              setShowControls(true); // Show title when paused or ended
            }
          },
          onReady: () => {
            // When video is ready, set up initial state
            console.log("Video ready");
          }
        }
      });
    }
  };

  // Auto-sliding functionality
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    
    if (autoPlay && !isVideoPlaying) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % projects.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      clearInterval(slideInterval);
    };
  }, [autoPlay, isVideoPlaying]);

  // Wrap slide navigation functions in useCallback to prevent infinite dependency cycles
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
    // Pause auto-play temporarily when manually changing slides
    setAutoPlay(false);
    setTimeout(() => {
      if (!isVideoPlaying) {
        setAutoPlay(true);
      }
    }, 5000); // Resume after 5 seconds if video isn't playing
  }, [isVideoPlaying]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    // Pause auto-play temporarily when manually changing slides
    setAutoPlay(false);
    setTimeout(() => {
      if (!isVideoPlaying) {
        setAutoPlay(true);
      }
    }, 5000); // Resume after 5 seconds if video isn't playing
  }, [isVideoPlaying]);

  // Handle drag/swipe gestures for mobile
  const handleDragStart = (e: MouseEvent | TouchEvent | PointerEvent) => {
    setIsDragging(true);
    setAutoPlay(false);
    
    // For touch events
    if ('touches' in e) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // If dragged significantly to the left, go to next slide
    if (info.offset.x < -50) {
      nextSlide();
    }
    
    // If dragged significantly to the right, go to previous slide
    if (info.offset.x > 50) {
      prevSlide();
    }
    
    // Resume autoplay if no video is playing
    if (!isVideoPlaying) {
      setTimeout(() => {
        setAutoPlay(true);
      }, 5000);
    }
  };

  // Add passive event listeners for better touch performance
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // These need to be defined here to reference in both add/remove
    const handleTouchStartPassive = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
      setAutoPlay(false);
    };
    
    const handleTouchEndPassive = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX - touchEndX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      
      if (!isVideoPlaying) {
        setTimeout(() => setAutoPlay(true), 5000);
      }
    };

    // Add passive listeners for better performance
    carousel.addEventListener('touchstart', handleTouchStartPassive, { passive: true });
    carousel.addEventListener('touchend', handleTouchEndPassive, { passive: true });

    return () => {
      carousel.removeEventListener('touchstart', handleTouchStartPassive);
      carousel.removeEventListener('touchend', handleTouchEndPassive);
    };
  }, [touchStartX, isVideoPlaying, nextSlide, prevSlide]);

  // Show hint when video starts playing
  useEffect(() => {
    if (isVideoPlaying) {
      setShowInfoHint(true);
      const timer = setTimeout(() => {
        setShowInfoHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVideoPlaying]);

  return (
    <section className="relative bg-black text-white py-20" id="projects">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">My Projects</h2>
            <p className="text-gray-300 text-base sm:text-lg">Check out some of my best work</p>
          </div>

          {/* Featured Projects Carousel */}
          <div 
            id="featured-carousel" 
            className="relative touch-pan-y select-none max-w-5xl mx-auto"
            ref={carouselRef}
          >
            {/* Progress bar for auto-slide timing */}
            <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-purple-900/20">
              <motion.div 
                className="h-full bg-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: autoPlay && !isVideoPlaying ? "100%" : "0%" }}
                transition={{ 
                  duration: 5, 
                  ease: "linear",
                  repeat: autoPlay && !isVideoPlaying ? Infinity : 0,
                  repeatType: "loop"
                }}
              />
            </div>
            
            <motion.div
              className="relative aspect-video rounded-lg overflow-hidden bg-purple-900/5 shadow-lg shadow-purple-900/20"
              whileHover={{ scale: isDragging ? 1 : 1.02 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0 }}
              key={currentSlide} // Re-render component when slide changes
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              onClick={() => setShowControls(!showControls)}
            >
              {/* Tap for info hint - only shows briefly when video starts */}
              {showInfoHint && isVideoPlaying && (
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-full z-20 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"></path>
                    </svg>
                    <span className="text-sm">Tap for info</span>
                  </div>
                </motion.div>
              )}

              <iframe
                ref={iframeRef}
                id={`youtube-player-${currentSlide}`}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${projects[currentSlide].youtubeId}?enablejsapi=1${isVideoPlaying ? '&autoplay=1' : ''}`}
                title={projects[currentSlide].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                initial={{ opacity: 1 }}
                animate={{ 
                  opacity: isVideoPlaying && !showControls ? 0 : 1,
                  y: isVideoPlaying && !showControls ? 20 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{projects[currentSlide].title}</h3>
                <p className="text-gray-200 text-sm sm:text-base">{projects[currentSlide].description}</p>
                {isVideoPlaying && (
                  <div className="mt-2 text-purple-400 text-xs sm:text-sm">
                    <span className="inline-block animate-pulse">●</span> Video playing - auto-slide paused
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Swipe instructions for mobile - only show when not playing video */}
            {!isVideoPlaying && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/60 text-sm pointer-events-none md:hidden">
                <div className="flex items-center justify-center space-x-2">
                  <span>←</span>
                  <span className="text-xs">Swipe to navigate</span>
                  <span>→</span>
                </div>
              </div>
            )}

            {/* Carousel Controls - hidden on small screens where touch is preferred */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-purple-600/80 p-2 sm:p-3 rounded-full hover:bg-purple-600 transition-colors text-sm sm:text-base hidden sm:block"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-purple-600/80 p-2 sm:p-3 rounded-full hover:bg-purple-600 transition-colors text-sm sm:text-base hidden sm:block"
            >
              →
            </button>
            
            {/* Slide indicators */}
            <div className="absolute bottom-0 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    // Only set autoPlay to false temporarily
                    setAutoPlay(false);
                    // Resume auto-play after 5 seconds if video isn't playing
                    setTimeout(() => {
                      if (!isVideoPlaying) {
                        setAutoPlay(true);
                      }
                    }, 5000);
                  }}
                  className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-purple-500 w-3 sm:w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Project Thumbnails Navigation */}
          <div className="mt-6 overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-3 min-w-min mx-auto max-w-full justify-center">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  className={`relative flex-shrink-0 w-24 sm:w-28 md:w-32 aspect-video rounded-md overflow-hidden transition-all duration-300 ${
                    currentSlide === index 
                      ? 'ring-2 ring-purple-500 scale-110 z-10' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => {
                    setCurrentSlide(index);
                    setAutoPlay(false);
                    if (index !== currentSlide) {
                      setIsVideoPlaying(false);
                    }
                  }}
                >
                  <Image 
                    src={`https://img.youtube.com/vi/${project.youtubeId}/mqdefault.jpg`} 
                    alt={project.title}
                    className="object-cover w-full h-full"
                    width={320}
                    height={180}
                  />
                  {currentSlide === index && isVideoPlaying && (
                    <div className="absolute bottom-1 right-1 bg-purple-600 rounded-full p-0.5">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 