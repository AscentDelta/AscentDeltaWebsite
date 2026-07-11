import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Marquee from '../components/ui/Marquee';
import BrandDesktopMarquee from '../components/ui/BrandDesktopMarquee';
import ArrowIcon from '../components/ui/ArrowIcon';
import Button from '../components/ui/Button';

const approachItems = [
  { number: '01', title: 'Full P&L Ownership',       desc: 'We take accountability for your revenue, margins, and profitability — not just impressions and clicks.' },
  { number: '02', title: 'Speed to Market',           desc: 'From diagnostic to live execution in days. No long strategy decks. Just action, iteration, and results.' },
  { number: '03', title: 'Data-Driven at Every Step', desc: 'Every decision is backed by cohort data, SKU-level P&L, and real-time channel analytics.' },
];

function ApproachCards() {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {approachItems.map((item, i) => {
        const isActive = activeIndex === i;
        return (
          <motion.div
            key={item.number}
            whileHover={{ y: -6 }}
            whileTap={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveIndex(isActive ? null : i)}
            className={`p-8 border rounded-2xl bg-neutral-950 transition-colors duration-300 cursor-pointer ${
              isActive
                ? 'border-[#14b8ab]'
                : 'border-neutral-800 hover:border-[#14b8ab]'
            }`}
          >
            <p className={`text-4xl font-black mb-6 tracking-tight transition-colors ${
              isActive ? 'text-[#14b8ab]' : 'text-neutral-600 group-hover:text-[#14b8ab]'
            }`}>
              {item.number}
            </p>
            <h3 className="text-xl font-bold tracking-tight text-white mb-3">{item.title}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const clientLogos = [
    'Avon-Logo.png', 'Enamor.png', 'Levis.png', 'Neuro logo.png', 'Ryze.png', 'TheMomsCo-logo.png',
    'bikaji.png', 'colgate.png', 'crax_logo.png', 'dixcy-scott-logo.png', 'CP logo.png', 'Durex/Durex-Logo-5.png', 'black-logo.png',
    'Avon-Logo.png', 'Enamor.png', 'Levis.png', 'Neuro logo.png', 'Ryze.png', 'TheMomsCo-logo.png',
    'bikaji.png', 'colgate.png', 'crax_logo.png', 'dixcy-scott-logo.png', 'CP logo.png', 'Durex/Durex-Logo-5.png', 'black-logo.png',
    'Avon-Logo.png', 'Enamor.png', 'Levis.png', 'Neuro logo.png', 'Ryze.png', 'TheMomsCo-logo.png',
    'bikaji.png', 'colgate.png', 'crax_logo.png', 'dixcy-scott-logo.png', 'CP logo.png', 'Durex/Durex-Logo-5.png', 'black-logo.png',
    'Avon-Logo.png', 'Enamor.png', 'Levis.png', 'Neuro logo.png', 'Ryze.png', 'TheMomsCo-logo.png',
    'bikaji.png', 'colgate.png', 'crax_logo.png', 'dixcy-scott-logo.png', 'CP logo.png', 'Durex/Durex-Logo-5.png', 'black-logo.png'
  ];

  const servicesList = [
    {
      title: "Revenue Strategy & P&L Ownership",
      desc: "Full-funnel planning aligned to contribution and EBITDA targets.",
      img: "revenue strategy.png"
    },
    {
      title: "Website & Conversion Architecture",
      desc: "CRO, merchandising, funnel optimisation and revenue-led UX.",
      img: "website architecture.png"
    },
    {
      title: "Performance Marketing",
      desc: "Paid media structured for profitable scale — not vanity ROAS.",
      img: "performance marketing.png"
    },
    {
      title: "Affiliates & Partnerships",
      desc: "Marketplace, coupon, loyalty, influencer and strategic revenue partnerships.",
      img: "affiliates.png"
    },
    {
      title: "Creative & Content",
      desc: "Performance-led creative systems built to scale paid media sustainably.",
      img: "creative & content.png"
    },
    {
      title: "SEO & Organic Growth",
      desc: "Search visibility strategies that increase qualified traffic, SERP share, and brand discovery.",
      img: "seo organic growth.png"
    }
  ];

  const renderServiceCards = () => {
    const cards = [];
    for (let i = 0; i < servicesList.length; i++) {
      const s = servicesList[i];
      cards.push(
        <Link
          key={i}
          to="/services"
          className="group flex flex-col bg-black border border-transparent rounded-[2rem] p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 min-h-[380px] flex-shrink-0 w-[75vw] md:w-auto snap-start"
        >
          <div className="w-full h-56 rounded-2xl overflow-hidden bg-neutral-900 relative">
            <img
              src={`/Services thumbnails/${s.img}`}
              alt={s.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col flex-grow mt-6 justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-100 transition-colors duration-300 leading-tight">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-400 mt-2.5 leading-relaxed font-light">
                {s.desc}
              </p>
            </div>
            <span className="text-xs font-bold tracking-widest uppercase mt-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-white">
              Explore <ArrowIcon size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      );
    }
    return cards;
  };

  return (
    <div className="flex flex-col w-full">
      <section className="relative min-h-screen flex items-start md:items-center w-full overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-start mt-24 md:mt-0 pb-16 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] mb-4 text-white">
              Drive D2C growth with{' '}
              <span
                className="font-black"
                style={{
                  fontSize: '1.15em',
                  background: 'linear-gradient(100deg, #1fd4c4 10%, #14b8ab 40%, #2f7fc0 90%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                AscentDelta
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white max-w-2xl font-light leading-relaxed mb-5">
              We are a new-age digital commerce partner who will take full ownership of your P&L. We're not talking only ads and website, we mean running your entire revenue engine.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="rounded-full px-8 py-5 text-lg font-medium flex items-center gap-4 group text-white shadow-xl transition-all hover:shadow-[0_20px_50px_rgba(20,184,171,0.25)]"
              style={{ background: 'linear-gradient(110deg, #14b8ab, #1b5e97)' }}
            >
              Build Your AscentDelta Plan
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </motion.button>

            <div className="mt-3 pt-3 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              {[
                { value: '3', label: 'Brands Scaled' },
                { value: '5', label: 'Growth Levers' },
                { value: '100', label: 'Days to Impact' },
                { value: 'High', label: 'Business Impact' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-sm text-neutral-400 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-[#14b8ab] mb-4">Our Approach</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05] text-white mb-4">Why <span style={{color: '#14b8ab'}}>AscentDelta</span> Works</h2>
          <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed max-w-2xl">
            We don't consult. We co-own — embedding inside your business as operators, not advisors.
          </p>
        </div>
        <ApproachCards />
      </section>

      {/* OUR BRANDS — hidden, re-enable by changing false to true */}
      {false && (
      <section className="py-24 bg-[#121212] text-white border-y border-neutral-900 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-sm font-bold tracking-widest uppercase" style={{color: '#14b8ab'}}>OUR BRANDS</h2>
        </div>
        <Marquee logos={clientLogos} direction="left" />
      </section>
      )}

      <section className="py-16 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#14b8ab'}}>Live Storefronts</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
            We don't just manage brands.{' '}
            <span style={{color: '#14b8ab'}}>We scale them.</span>
          </h2>
        </div>
        <BrandDesktopMarquee />
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05] text-white mb-4">Our Capabilities</h2>
          <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed">Core operating lanes for high-growth commerce.</p>
        </div>
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {renderServiceCards()}
        </div>
      </section>

      {/* THE FIRST 100 DAYS */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-[#14b8ab] mb-4">How We Engage</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05] text-white mb-4">
            The First{' '}
            <span className="bg-gradient-to-r from-[#1fd4c4] to-[#2f7fc0] bg-clip-text text-transparent">100 Days</span>
          </h2>
          <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed max-w-2xl">
            No retainers that drift. Every engagement follows a structured, accountable roadmap from day one.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              days: 'Days 0–15',
              title: 'Diagnose',
              desc: 'Full P&L audit, channel deep-dive, cohort and margin analysis. You get a clear picture of where revenue leaks and where the upside sits.',
            },
            {
              days: 'Days 16–45',
              title: 'Build',
              desc: 'Fix the foundations — storefront conversion, tracking, creative systems, and channel structure — so every rupee of spend works harder.',
            },
            {
              days: 'Days 46–100',
              title: 'Scale',
              desc: 'Ramp profitable spend, open new channels and partnerships, and report against contribution margin — not vanity metrics.',
            },
          ].map((phase, i) => (
            <motion.div
              key={phase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative p-8 border border-neutral-800 rounded-2xl bg-neutral-950 overflow-hidden group hover:border-[#14b8ab]/60 transition-colors duration-500"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px] opacity-80"
                style={{ background: 'linear-gradient(90deg, #1fd4c4, #2f7fc0)' }}
              />
              <p className="text-xs font-bold tracking-widest uppercase text-[#14b8ab] mb-5">{phase.days}</p>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-3 flex items-baseline gap-3">
                <span className="text-4xl font-black bg-gradient-to-r from-[#1fd4c4] to-[#2f7fc0] bg-clip-text text-transparent">
                  0{i + 1}
                </span>
                {phase.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{phase.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GROWTH ENGINE TEASER */}
      <section className="py-8 max-w-7xl mx-auto px-6 w-full relative z-10">
        <Link
          to="/growth-engine"
          className="group relative flex flex-col md:flex-row md:items-center gap-6 rounded-[2rem] border border-neutral-800 hover:border-[#14b8ab]/70 transition-colors duration-500 px-8 py-10 md:px-12 overflow-hidden"
          style={{ background: 'linear-gradient(100deg, rgba(20,184,171,0.10), rgba(27,94,151,0.06) 60%, transparent)' }}
        >
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest uppercase text-[#14b8ab] mb-3">
              New · Interactive
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">
              Are your ads buying{' '}
              <span className="bg-gradient-to-r from-[#1fd4c4] to-[#2f7fc0] bg-clip-text text-transparent">profit — or losses?</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-400 font-light leading-relaxed max-w-xl">
              Drag six sliders to your real numbers and get your growth grade, your break-even
              ROAS, and a 100-day projection. No email. 60 seconds.
            </p>
          </div>
          <span
            className="flex-shrink-0 self-start md:self-center rounded-full px-7 py-4 text-base font-semibold text-white shadow-xl transition-all group-hover:shadow-[0_20px_50px_rgba(20,184,171,0.25)] group-hover:scale-[1.03]"
            style={{ background: 'linear-gradient(110deg, #14b8ab, #1b5e97)' }}
          >
            Grade my growth engine →
          </span>
        </Link>
      </section>

      {/* CLOSING CTA */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full relative z-10">
        <div
          className="relative rounded-[2.5rem] border border-neutral-800 overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center"
          style={{ background: 'radial-gradient(ellipse 90% 120% at 50% -20%, rgba(20,184,171,0.14), rgba(27,94,151,0.06) 55%, transparent 80%)' }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05] text-white mb-6">
            Ready to own your{' '}
            <span className="bg-gradient-to-r from-[#1fd4c4] to-[#2f7fc0] bg-clip-text text-transparent">growth curve?</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Tell us where your P&L stands today. We'll show you exactly what the next 100 days should look like — no decks, no fluff.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="rounded-full px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:shadow-[0_20px_50px_rgba(20,184,171,0.25)]"
              style={{ background: 'linear-gradient(110deg, #14b8ab, #1b5e97)' }}
            >
              Start the Conversation
            </motion.button>
            <Link
              to="/ai-scan"
              className="rounded-full px-8 py-4 text-base font-semibold border border-neutral-700 text-white hover:border-[#14b8ab] hover:text-[#14b8ab] transition-colors"
            >
              Run a Free AI Scan
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
