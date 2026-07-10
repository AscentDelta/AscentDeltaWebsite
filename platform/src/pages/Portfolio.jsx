import { useState } from 'react';
import { motion } from 'framer-motion';

const clients = [
  { logo: 'ambiencelogo.png',  brand: 'The Ambience Hotel', category: 'Hospitality', metric: 'Digital Transformation', channel: 'Brand Experience' },
  { logo: 'samarpanlogo.jpg',  brand: 'Samarpan',            category: 'Retail',      metric: 'Ecommerce Growth',       channel: 'Conversion Strategy' },
  { logo: 'upharkarologo.png', brand: 'Upharkaro',           category: 'Mobility',    metric: 'Marketplace Scale',      channel: 'Digital Commerce' },
];

const lastRowColStart = ['lg:col-start-1', 'lg:col-start-3', 'lg:col-start-5'];

function getTileClasses(index, total) {
  const base =
    'group relative overflow-hidden rounded-2xl aspect-square bg-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-colors duration-300 cursor-pointer';
  const lastRowStart = total - (total % 5 || 5);
  if (index >= lastRowStart && total % 5 !== 0) {
    const posInRow = index - lastRowStart;
    return `${base} ${lastRowColStart[posInRow] ?? ''}`;
  }
  return base;
}

export default function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleTap = (i) => {
    setActiveIndex(prev => prev === i ? null : i);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-white mb-4">
          Portfolio
        </h1>
        <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed mb-16 max-w-xl">
          {clients.length} brands. One shared goal — profitable, scalable growth.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {clients.map((client, i) => {
          const isActive = activeIndex === i;
          return (
            <motion.div
              key={client.brand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={getTileClasses(i, clients.length)}
              onClick={() => handleTap(i)}
            >
              {/* Logo layer */}
              <div className={`absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-90 group-hover:opacity-0 ${isActive ? 'scale-90 opacity-0' : ''}`}>
                <div className={client.darkInvert ? 'dark:bg-white dark:rounded-xl dark:px-3 dark:py-2' : ''}>
                  <img
                    src={`/Client Logos/Coloured/${client.logo}`}
                    alt={client.brand}
                    className={`max-w-full ${client.logoSize ?? 'max-h-16'} object-contain`}
                  />
                </div>
              </div>

              {/* Detail overlay — slides up from bottom on hover or tap */}
              <div className={`absolute inset-0 bg-neutral-900 border border-neutral-700 transition-transform duration-500 ease-out flex flex-col justify-end p-5 rounded-2xl group-hover:translate-y-0 ${isActive ? 'translate-y-0' : 'translate-y-full'}`}>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#14b8ab] mb-2">
                  {client.category}
                </span>
                <h3 className="text-lg font-black text-white leading-tight mb-1">
                  {client.metric}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{client.channel}</p>
                <div className="mt-4 pt-3 border-t border-neutral-700">
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold tracking-wide">
                    {client.brand}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
