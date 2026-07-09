const brands = [
  {
    name: 'The Ambience Hotel',
    url: 'theambiencehotel.com',
    img: '/brand-screenshots/theambiencehotel-desktop.png',
    logo: '/Client Logos/Coloured/ambiencelogo.png',
    logoSize: '98px',
    theme: {
      accent: '#f59e0b', // Gold/Amber
      badgeBg: 'rgba(245, 158, 11, 0.1)',
      borderAccent: 'border-amber-500/30'
    }
  },
  {
    name: 'Samarpan',
    url: 'samarpanshop.com',
    img: '/brand-screenshots/samarpan-desktop.png',
    logo: '/Client Logos/Coloured/samarpanlogo.jpg',
    logoSize: '105px',
    theme: {
      accent: '#10b981', // Emerald
      badgeBg: 'rgba(16, 185, 129, 0.1)',
      borderAccent: 'border-emerald-500/30'
    }
  },
  {
    name: 'Upharkaro',
    url: 'upharkaro.com',
    img: '/brand-screenshots/upharkaro-desktop.png',
    logo: '/Client Logos/Coloured/upharkarologo.png',
    logoSize: '98px',
    theme: {
      accent: '#6366f1', // Indigo
      badgeBg: 'rgba(99, 102, 241, 0.1)',
      borderAccent: 'border-indigo-500/30'
    }
  }
];

// Repeat brands to create a continuous marquee
const allBrands = [...brands, ...brands, ...brands, ...brands];

function DesktopFrame({ brand, labelBottom }) {
  const label = (
    <p className="text-xs font-bold tracking-widest uppercase text-[#6366f1] transition-colors group-hover:text-white">
      {brand.name}
    </p>
  );

  return (
    <div className="group flex flex-col items-center gap-4 flex-shrink-0 cursor-pointer">
      {!labelBottom && label}

      {/* Browser window shell */}
      <div
        className="relative flex flex-col bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 transition-all duration-500"
        style={{
          width: '460px',
          height: '280px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Browser Top Bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 flex-shrink-0 select-none">
          <div className="flex gap-1.5 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 max-w-[220px] mx-auto bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-500 py-1 rounded-md text-center font-mono truncate">
            https://www.{brand.url}
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative flex-1 w-full overflow-hidden bg-neutral-950 group">
          <img
            src={brand.img}
            alt={brand.name}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />

          <div className="absolute inset-0 bg-neutral-950/80 transition duration-500 group-hover:bg-transparent" />

          <div className="absolute inset-0 flex items-center justify-center p-6 transition duration-500 opacity-100 group-hover:opacity-0">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              loading="lazy"
              style={{
                width: brand.logoSize,
                maxWidth: '180px',
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                backgroundColor: 'transparent',
                filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.35))',
              }}
            />
          </div>
        </div>
      </div>

      {labelBottom && label}
    </div>
  );
}

export default function BrandDesktopMarquee() {
  return (
    <div className="overflow-hidden w-full py-6">
      <style>{`
        @keyframes desktop-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-desktop-scroll {
          animation: desktop-scroll 45s linear infinite;
        }
      `}</style>

      <div className="flex w-max animate-desktop-scroll gap-12 px-8 items-start">
        {allBrands.map((brand, i) => (
          <div key={i} style={{ marginTop: i % 2 === 0 ? '0px' : '40px' }} className="transition-all duration-300">
            <DesktopFrame brand={brand} labelBottom={i % 2 === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
