import { Link } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Capabilities' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/contact', label: 'Contact' },
];

const services = [
  'Revenue Strategy & P&L',
  'Website & CRO',
  'Performance Marketing',
  'Affiliates & Partnerships',
  'Creative & Content',
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/ascentdelta',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ascentdelta.co',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/ascentdeltaco',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <Link to="/" className="inline-block mb-6">
            <img src="/logo-black.png" alt="AscentDelta" className="h-8 w-auto dark:hidden" />
            <img src="/logo-white.png" alt="AscentDelta" className="h-8 w-auto hidden dark:block" />
          </Link>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8 max-w-xs">
            A full-stack digital commerce partner that owns your P&L — from website to warehouse.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Company links */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#14b5bc] mb-6">
            Company
          </p>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services links */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#14b5bc] mb-6">
            Capabilities
          </p>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s}>
                <Link
                  to="/services"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#14b5bc] mb-6">
            Reach Us
          </p>
          <div className="space-y-4">
            <a
              href="mailto:ascentxdelta@gmail.com"
              className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors group"
            >
              <span className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-[#14b5bc] group-hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              ascentxdelta@gmail.com
            </a>
            <a
              href="tel:+919643601472"
              className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors group"
            >
              <span className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-[#14b5bc] group-hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              +91-9643601472
            </a>
            <a
              href="https://maps.app.goo.gl/NyHFpD3vWrvgn6Xz8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors group"
            >
              <span className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#14b5bc] group-hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span>5th Floor, Vipul Plaza,<br />Sector 54, Gurugram — 122011</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">© 2026 ascentdelta.com · All rights reserved.</p>
          <p className="text-xs text-neutral-400 tracking-wide">Scaling D2C India, One Brand at a Time.</p>
        </div>
      </div>

    </footer>
  );
}
