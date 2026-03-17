'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { label: 'Years Experience', value: '1.5+' },
    { label: 'Projects Completed', value: '30+' },
    { label: 'Happy Clients', value: '10+' },
  ];

  return (
    <section className="relative bg-black text-white" id="about">
      {/* Background gradient to match hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-green-900/10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image Section */}
          <div className="relative group mx-auto lg:mx-0 max-w-md w-full">
            <motion.div
              className="relative rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/profile-image.jpg"
                alt="Jimmy Turner"
                width={500}
                height={600}
                className="object-cover w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
              />
              <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/20 transition-colors duration-300" />
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">About Me</h2>
              <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">
                I&apos;m a professional video editor with a passion for creating compelling visual stories. 
                With extensive experience in Adobe Premiere Pro, After Effects. 
                I bring creativity and technical expertise to every project.
              </p>
              <p className="text-gray-300 text-base sm:text-lg">
                My journey in video editing began with a fascination for storytelling through visual media. 
                Today, I specialize in creating engaging content that captures attention and delivers messages effectively.
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      delay: 0.6 + (index * 0.1)
                    }}
                  >
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-500 mb-1 sm:mb-2">{stat.value}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                  </motion.div>
                </div>
              ))}
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-6 sm:pt-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Technical Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  'Adobe Premiere Pro',
                  'After Effects',
                  'Motion Graphics',
                  'Color Grading',
                  'Sound Design'
                ].map((skill, index) => (
                  <motion.div
                    key={index}
                    className="bg-purple-900/20 rounded-lg p-3 hover:bg-purple-900/30 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About; 