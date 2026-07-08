import { motion } from 'framer-motion';

export default function Marquee({ logos, direction = 'left' }) {
  const allLogos = [];
  const numSets = 4; // 4 sets is enough to cover ultra-wide monitors without exceeding max texture limits
  
  for (let set = 0; set < numSets; set++) {
    for (let i = 0; i < logos.length; i++) {
      const isSmaller = logos[i] === 'Neuro logo.png' || logos[i] === 'Enamor.png';
      const isBSC = logos[i] === 'black-logo.png';
      allLogos.push(
        <div key={`set-${set}-logo-${i}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
          <div className={isBSC ? 'dark:bg-white dark:rounded-xl dark:px-4 dark:py-2' : ''}>
            <img
              src={`/Client Logos/Coloured/${logos[i]}`}
              alt="Client Logo"
              className={`${isSmaller ? 'h-11' : isBSC ? 'h-20' : 'h-16'} w-auto object-contain`}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex overflow-hidden relative w-full py-8">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: scroll-left 50s linear infinite;
        }
        .animate-marquee-right {
          animation: scroll-right 50s linear infinite;
        }
      `}</style>
      <div className={`flex w-max items-center ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}>
        {allLogos}
      </div>
    </div>
  );
}
