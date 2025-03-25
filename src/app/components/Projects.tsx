'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

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

  // Auto-sliding functionality
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    
    if (autoPlay) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % projects.length);
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      clearInterval(slideInterval);
    };
  // Only re-run when autoPlay changes
  }, [autoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
    // Pause auto-play temporarily when manually changing slides
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000); // Resume after 5 seconds
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    // Pause auto-play temporarily when manually changing slides
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000); // Resume after 5 seconds
  };

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
            <h2 className="text-4xl font-bold mb-4">My Projects</h2>
            <p className="text-gray-300 text-lg">Check out some of my best work</p>
          </div>

          {/* Featured Projects Carousel */}
          <div className="relative">
            {/* Progress bar for auto-slide timing */}
            <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-purple-900/20">
              <motion.div 
                className="h-full bg-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 3, 
                  ease: "linear",
                  repeat: autoPlay ? Infinity : 0,
                  repeatType: "loop"
                }}
              />
            </div>
            
            <motion.div
              className="relative aspect-video rounded-lg overflow-hidden bg-purple-900/5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentSlide} // Re-render component when slide changes
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${projects[currentSlide].youtubeId}`}
                title={projects[currentSlide].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-2xl font-bold mb-2">{projects[currentSlide].title}</h3>
                <p className="text-gray-200">{projects[currentSlide].description}</p>
              </div>
            </motion.div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-purple-600/80 p-3 rounded-full hover:bg-purple-600 transition-colors"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-600/80 p-3 rounded-full hover:bg-purple-600 transition-colors"
            >
              →
            </button>
            
            {/* Slide indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setAutoPlay(false);
                    setTimeout(() => setAutoPlay(true), 5000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "bg-purple-500 w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="relative aspect-video rounded-lg overflow-hidden bg-purple-900/5"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${project.youtubeId}`}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-200">{project.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 