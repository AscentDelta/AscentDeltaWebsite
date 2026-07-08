import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const [activeImage, setActiveImage] = useState('revenue strategy.png');
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const services = [
    {
      title: "Revenue Strategy & P&L Ownership",
      desc: "Full-funnel planning aligned to contribution and EBITDA targets.",
      features: ["P&L diagnostic audits", "Contribution margin planning", "EBITDA target alignment", "Full-funnel growth modeling"],
      img: "revenue strategy.png"
    },
    {
      title: "Website & Conversion Architecture",
      desc: "CRO, merchandising, funnel optimisation and revenue-led UX.",
      features: ["Shopify theme customization", "Behavioral CRO design layouts", "Mobile-first architectures", "Native subscription/bundling features"],
      img: "website architecture.png"
    },
    {
      title: "Performance Marketing",
      desc: "Paid media structured for profitable scale — not vanity ROAS.",
      features: ["Paid social ads (Meta, YouTube)", "Paid search campaigns (Google)", "Precision pixel tracking", "Full-funnel remarketing"],
      img: "performance marketing.png"
    },
    {
      title: "Affiliates & Partnerships",
      desc: "Marketplace, coupon, loyalty, influencer and strategic revenue partnerships.",
      features: ["Influencer setup & tracking", "Affiliate network models", "Impact/Roposo Clout integrations", "Custom UTM dashboards"],
      img: "affiliates.png"
    },
    {
      title: "Creative & Content",
      desc: "Performance-led creative systems built to scale paid media sustainably.",
      features: ["Studio video production", "UGC video ads creator models", "Static graphic ad design", "A/B copy and asset testing"],
      img: "creative & content.png"
    },
    {
      title: "Warehouse & Distribution",
      desc: "End-to-end management across warehouse, operations, and delivery.",
      features: ["Infrastructure & inventory support", "Operations & workforce support", "Quality control & replenishment", "Delivery management"],
      img: "warehouse.png"
    }
  ];

  const renderFeatures = (features) => {
    const list = [];
    for (let i = 0; i < features.length; i++) {
      list.push(
        <motion.li 
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3 text-sm font-medium"
        >
          <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full flex-shrink-0 mt-2" />
          <span className="leading-tight">{features[i]}</span>
        </motion.li>
      );
    }
    return list;
  };

  const renderServices = () => {
    const items = [];
    for (let i = 0; i < services.length; i++) {
      const isActive = hoveredIndex === i;
      items.push(
        <div 
          key={i}
          className={`relative p-8 mb-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden ${
            isActive 
              ? 'bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl scale-[1.02]' 
              : 'bg-transparent hover:bg-neutral-50/40 dark:hover:bg-neutral-900/40 opacity-60 hover:opacity-100'
          }`}
          onMouseEnter={() => {
            setActiveImage(services[i].img);
            setHoveredIndex(i);
          }}
          onMouseLeave={() => setHoveredIndex(-1)}
          onClick={() => {
            const next = hoveredIndex === i ? -1 : i;
            setHoveredIndex(next);
            if (next !== -1) setActiveImage(services[next].img);
          }}
        >
          <div className="relative z-10 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-black dark:text-white">{services[i].title}</h2>
            
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Image — mobile only, shown inside expanded card */}
                  <div className="lg:hidden w-full h-48 rounded-xl overflow-hidden mb-6">
                    <img
                      src={`/Services thumbnails/${services[i].img}`}
                      alt={services[i].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed text-lg border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    {services[i].desc}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {renderFeatures(services[i].features)}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }
    return items;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 relative min-h-screen">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-black dark:text-white">Our Capabilities</h1>
        <p className="text-xl md:text-2xl text-black dark:text-neutral-300 font-light leading-relaxed mt-6 max-w-xl">High-performance operating lanes designed to launch, scale, and dominate across the digital commerce landscape.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-16 relative items-start">
        <div className="w-full lg:w-1/2 flex flex-col z-10 pb-32">
          {renderServices()}
        </div>
        
        <div className="hidden lg:block w-1/2 sticky top-32 h-[75vh] rounded-[2rem] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
          <AnimatePresence>
            <motion.img
              key={activeImage}
              src={`/Services thumbnails/${activeImage}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Service Preview"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
