import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import AIScan from './pages/AIScan';
import HeroVisual from './components/ui/HeroVisual';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/ui/CustomCursor';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white font-sans relative">
      <CustomCursor />
      <HeroVisual />
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pt-20 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-scan" element={<AIScan />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
