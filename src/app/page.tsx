import dynamic from 'next/dynamic';

// Lazy load components for better performance
const Hero = dynamic(() => import('./components/Hero'), {
  loading: () => <div className="min-h-screen bg-black" />
});

const About = dynamic(() => import('./components/About'), {
  loading: () => <div className="min-h-screen bg-black" />
});

const Projects = dynamic(() => import('./components/Projects'), {
  loading: () => <div className="min-h-screen bg-black" />
});

const Contact = dynamic(() => import('./components/Contact'), {
  loading: () => <div className="min-h-screen bg-black" />
});

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
