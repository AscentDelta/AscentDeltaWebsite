import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ArrowIcon from '../ui/ArrowIcon';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Capabilities' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/ai-scan', label: 'AI Scan', highlight: true },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/90 border-b border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link
            to="/"
            onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex-shrink-0"
          >
            <span className="flex items-center gap-2.5">
              <img
                src="/logo-mark.png"
                alt="AscentDelta"
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-extrabold tracking-[0.08em] text-white leading-none">
                ASCENT<span className="bg-gradient-to-r from-[#14b8ab] to-[#1b5e97] bg-clip-text text-transparent">DELTA</span>
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full border border-[#14b8ab] text-[#14b8ab] hover:bg-[#14b8ab] hover:text-white transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 bg-[#14b8ab] rounded-full animate-pulse" />
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative group pb-0.5 ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#14b8ab] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#14b8ab] hover:bg-[#0f9d92] text-white transition-colors"
            >
              Get in Touch <ArrowIcon size={13} color="white" />
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X size={20} className="text-white" />
                : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-20 left-0 right-0 bg-neutral-950 border-b border-neutral-800 shadow-2xl transition-all duration-300 ${
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col">
            {[...navLinks, { path: '/contact', label: 'Contact' }].map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-bold tracking-tight py-4 border-b border-neutral-800 last:border-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-8 flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-medium bg-[#14b8ab] hover:bg-[#0f9d92] text-white transition-colors"
            >
              Get in Touch <ArrowIcon size={13} color="white" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
