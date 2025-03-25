import dynamic from 'next/dynamic';

// Lazy load components for better performance
const Navbar = dynamic(() => import('./components/Navbar'), {
  loading: () => <div className="h-16 bg-transparent" />
});

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
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
