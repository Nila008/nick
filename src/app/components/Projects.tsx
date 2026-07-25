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
    title: "Nirbhaya Documentary",
    description: "A documentary about the Nirbhaya case",
    youtubeId: "XE2MH4B0VWk",
    category: "Doocumentary"
  },
  {
    id: 2,
    title: "Technology Video",
    description: "Tech-related content",
    youtubeId: "6OGzclIlKb8",
    category: "Technology"
  },
  {
    id: 3,
    title: "Fast-Paced",
    description: "A informative video for google ads",
    youtubeId: "dwulaAqBltI",
    category: "Motion Graphics"
  },
  {
    id: 4,
    title: "Fitness Vlog",
    description: "Gym related",
    youtubeId: "3h_Vs1Z85T4",
    category: "Fitness"
  },
  {
    id: 5,
    title: "Fitness Video",
    description: "Gym related or Fitness Type",
    youtubeId: "oOS8RVwDMTI",
    category: "Fitness"
  },
  {
    id: 6,
    title: "High Quality Short",
    description: "A high-quality short video",
    youtubeId: "E1kR2N0F2Uo",
    category: "Short"
  },
  {
    id: 7,
    title: "3d Product",
    description: "3D Product Video",
    youtubeId: "WuSubgAsv2c",
    category: "3D"
    },
  {
    id: 8,
    title: "3d animation",
    description: "3D Animation with 2M views",
    youtubeId: "esk5ik_u0j4",
    category: "3D"
  },
  {
    id: 9,
    title: "Zack D Flim",
    description: "Zack D Style",
    youtubeId: "19tdo7Gxabc",
    category: "3D"
  },
  {
    id: 10,
    title: "Bolt Motivation",
    description: "Style like Bolt Motivation",
    youtubeId: "wy2b3KXBmiI",
    category: "Quality"
  },
    {
    id: 11,
    title: "Trading",
    description: "Trading related content",
    youtubeId: "V5NqLQSwwTQ",
    category: "Trading"
  },
  {
    id: 12,
    title: "2D and 3D Mix",
    description: "Both 2D and 3D Animation",
    youtubeId: "RQAMXtrCQmA",
    category: "3D"
  },
    {
    id: 13,
    title: "Gaming Video",
    description: "Gaming content",
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [showInfoHint, setShowInfoHint] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [thumbnailCount, setThumbnailCount] = useState(4);

  // Detect screen size for responsive thumbnail count
  useEffect(() => {
    const updateThumbnailCount = () => {
      const isMobile = window.innerWidth < 640;
      setThumbnailCount(isMobile ? 3 : 4);
    };

    updateThumbnailCount();
    window.addEventListener('resize', updateThumbnailCount);
    return () => window.removeEventListener('resize', updateThumbnailCount);
  }, []);

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
              // Video is playing
              setIsVideoPlaying(true);
              setShowControls(false); // Hide title initially when playback starts
            } else if (event.data === 0 || event.data === 2) {
              // Video is paused or ended
              setIsVideoPlaying(false);
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

  // Auto-sliding disabled - slides change only on manual interaction
  useEffect(() => {
    // Auto-sliding is disabled for manual control
    return () => {};
  }, []);

  // Wrap slide navigation functions in useCallback to prevent infinite dependency cycles
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  }, []);

  // Thumbnail navigation handlers - move by thumbnailCount at a time
  const moveThumbLeft = useCallback(() => {
    setThumbIndex((prev) => Math.max(prev - thumbnailCount, 0));
  }, [thumbnailCount]);

  const moveThumbRight = useCallback(() => {
    setThumbIndex((prev) => Math.min(prev + thumbnailCount, Math.max(projects.length - thumbnailCount, 0)));
  }, [thumbnailCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  }, []);

  // Handle drag/swipe gestures for mobile
  const handleDragStart = (e: MouseEvent | TouchEvent | PointerEvent) => {
    setIsDragging(true);
    
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
  };

  // Add passive event listeners for better touch performance
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // These need to be defined here to reference in both add/remove
    const handleTouchStartPassive = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
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
    };

    // Add passive listeners for better performance
    carousel.addEventListener('touchstart', handleTouchStartPassive, { passive: true });
    carousel.addEventListener('touchend', handleTouchEndPassive, { passive: true });

    return () => {
      carousel.removeEventListener('touchstart', handleTouchStartPassive);
      carousel.removeEventListener('touchend', handleTouchEndPassive);
    };
  }, [touchStartX, nextSlide, prevSlide]);

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
    <section className="relative bg-black text-white py-10 sm:py-16 md:py-20" id="projects">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">My Projects</h2>
            <p className="text-gray-400 text-xs sm:text-base md:text-lg">Check out some of my best work</p>
          </div>

          {/* Featured Projects Carousel */}
          <div 
            id="featured-carousel" 
            className="relative touch-pan-y select-none max-w-5xl mx-auto px-2 sm:px-4 md:px-0"
            ref={carouselRef}
          >
            {/* Progress bar removed - auto-sliding disabled */}
            
            <motion.div
              className="relative aspect-video rounded-md sm:rounded-lg overflow-hidden bg-purple-900/5 shadow-lg shadow-purple-900/20"
              whileHover={{ scale: isDragging ? 1 : 1.02 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
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
                className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent"
                initial={{ opacity: 1 }}
                animate={{ 
                  opacity: isVideoPlaying && !showControls ? 0 : 1,
                  y: isVideoPlaying && !showControls ? 20 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm sm:text-lg md:text-2xl font-bold mb-0.5 sm:mb-2 leading-tight">{projects[currentSlide].title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-snug line-clamp-2 sm:line-clamp-none">{projects[currentSlide].description}</p>
                {isVideoPlaying && (
                  <div className="mt-2 text-purple-400 text-xs sm:text-sm">
                    <span className="inline-block animate-pulse">●</span> Video playing
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Swipe instructions for mobile - removed for cleaner UI */}

            {/* Carousel Controls - visible on all screen sizes */}
            <button
              onClick={prevSlide}
              className="absolute left-1 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 bg-purple-600/80 p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-purple-500 active:bg-purple-700 transition-colors text-base flex items-center justify-center min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] z-10"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-2 md:right-3 top-1/2 -translate-y-1/2 bg-purple-600/80 p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-purple-500 active:bg-purple-700 transition-colors text-base flex items-center justify-center min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] z-10"
              aria-label="Next slide"
            >
              →
            </button>
            
            {/* Slide indicators */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5 z-20">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-purple-500 w-1.5 sm:w-2 h-1.5 sm:h-2" : "bg-white/40 w-1 sm:w-1.5 h-1 sm:h-1.5"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Project Thumbnails Navigation */}
          <div className="mt-8 sm:mt-10 pb-4 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full max-w-5xl mx-auto px-2">

            {/* Left Arrow - NOW VISIBLE ON MOBILE */}
            <button
              onClick={moveThumbLeft}
              disabled={thumbIndex === 0}
              className={`flex flex-shrink-0 p-2 sm:p-2.5 rounded-full transition-all duration-300 items-center justify-center min-w-[36px] min-h-[36px] ${
                thumbIndex === 0
                  ? 'bg-gray-700/40 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-purple-600/80 text-white hover:bg-purple-500 active:bg-purple-700'
              }`}
              aria-label="Previous thumbnails"
            >
              ←
            </button>

            {/* Thumbnails Container */}
            <div className="flex overflow-x-auto no-scrollbar space-x-2 sm:space-x-3 md:space-x-4 px-1">
              {projects.slice(thumbIndex, thumbIndex + thumbnailCount).map((project, sliceIndex) => {
                const actualIndex = thumbIndex + sliceIndex;
                return (
                  <button
                    key={project.id}
                    className={`relative flex-shrink-0 w-24 sm:w-28 md:w-32 aspect-video rounded-md overflow-hidden transition-all duration-300 ${
                      currentSlide === actualIndex 
                        ? 'ring-2 ring-purple-500 scale-105 z-10' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => {
                      setCurrentSlide(actualIndex);
                      if (actualIndex !== currentSlide) {
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

                    {/* Active Indicator */}
                    {currentSlide === actualIndex && (
                      <div className="absolute inset-0 border-2 border-purple-500 rounded-md" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Arrow - NOW VISIBLE ON MOBILE */}
            <button
              onClick={moveThumbRight}
              disabled={thumbIndex >= Math.max(projects.length - thumbnailCount, 0)}
              className={`flex flex-shrink-0 p-2 sm:p-2.5 rounded-full transition-all duration-300 items-center justify-center min-w-[36px] min-h-[36px] ${
                thumbIndex >= Math.max(projects.length - thumbnailCount, 0)
                  ? 'bg-gray-700/40 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-purple-600/80 text-white hover:bg-purple-500 active:bg-purple-700'
              }`}
              aria-label="Next thumbnails"
            >
              →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 