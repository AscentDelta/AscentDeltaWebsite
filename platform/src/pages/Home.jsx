import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Marquee from '../components/ui/Marquee';
import BrandPhoneMarquee from '../components/ui/BrandPhoneMarquee';
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
                ? 'border-[#6366f1]'
                : 'border-neutral-800 hover:border-[#6366f1]'
            }`}
          >
            <p className={`text-4xl font-black mb-6 tracking-tight transition-colors ${
              isActive ? 'text-[#6366f1]' : 'text-neutral-600 group-hover:text-[#6366f1]'
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
      title: "Warehouse & Distribution",
      desc: "End-to-end management across warehouse, operations, and delivery.",
      img: "warehouse.png"
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
              Drive D2C growth in <span style={{color: '#6366f1', fontSize: '1.2em', fontWeight: 900}}>AscentDelta</span>
            </h1>

            <p className="text-xl md:text-2xl text-white max-w-2xl font-light leading-relaxed mb-5">
              We are a new-age digital commerce partner who will take full ownership of your P&L. We're not talking only ads and website, we mean running your entire revenue engine.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="rounded-full px-8 py-5 text-lg font-medium flex items-center gap-4 group bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xl transition-colors"
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
                { value: '14+', label: 'Brands Scaled' },
                { value: '5', label: 'Growth Levers' },
                { value: '100', label: 'Days to Impact' },
                { value: '₹500Cr+', label: 'Revenue Influenced' },
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
          <p className="text-xs font-bold tracking-widest uppercase text-[#6366f1] mb-4">Our Approach</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05] text-white mb-4">Why <span style={{color: '#6366f1'}}>AscentDelta</span> Works</h2>
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
          <h2 className="text-sm font-bold tracking-widest uppercase" style={{color: '#6366f1'}}>OUR BRANDS</h2>
        </div>
        <Marquee logos={clientLogos} direction="left" />
      </section>
      )}

      <section className="py-16 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: '#6366f1'}}>Live Storefronts</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
            We don't just manage brands.{' '}
            <span style={{color: '#6366f1'}}>We scale them.</span>
          </h2>
        </div>
        <BrandPhoneMarquee />
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

    </div>
  );
}
