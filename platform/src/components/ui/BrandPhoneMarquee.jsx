const brands = [
  {
    name: 'The Ambience Hotel',
    img: '/brand-screenshots/theambiencehotel-desktop.png',
    logo: '/Client Logos/Coloured/ambiencelogo.png',
    logoSize: '110px',
  },
  {
    name: 'Samarpan',
    img: '/brand-screenshots/samarpan-desktop.png',
    logo: '/Client Logos/Coloured/samarpanlogo.jpg',
    logoSize: '110px',
  },
  {
    name: 'Upharkaro',
    img: '/brand-screenshots/upharkaro-desktop.png',
    logo: '/Client Logos/Coloured/upharkarologo.png',
    logoSize: '110px',
  },
];

const allBrands = [...brands, ...brands];

function PhoneFrame({ brand, labelBottom, overlayColor }) {
  const label = (
    <p className="text-sm font-semibold tracking-widest uppercase text-[#6366f1]">
      {brand.name}
    </p>
  );

  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0">
      {!labelBottom && label}

      {/* Phone outer shell */}
      <div
        style={{
          width: '190px',
          height: '400px',
          borderRadius: '38px',
          background: 'linear-gradient(160deg, #d4d4d8 0%, #a1a1aa 50%, #d4d4d8 100%)',
          padding: '3px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.2)',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Volume up */}
        <div style={{ position: 'absolute', left: '-3px', top: '72px', width: '3px', height: '26px', background: 'linear-gradient(180deg,#b0b0b8,#8e8e96)', borderRadius: '3px 0 0 3px' }} />
        {/* Volume down */}
        <div style={{ position: 'absolute', left: '-3px', top: '106px', width: '3px', height: '26px', background: 'linear-gradient(180deg,#b0b0b8,#8e8e96)', borderRadius: '3px 0 0 3px' }} />
        {/* Mute toggle */}
        <div style={{ position: 'absolute', left: '-3px', top: '50px', width: '3px', height: '16px', background: 'linear-gradient(180deg,#b0b0b8,#8e8e96)', borderRadius: '3px 0 0 3px' }} />
        {/* Power button */}
        <div style={{ position: 'absolute', right: '-3px', top: '90px', width: '3px', height: '40px', background: 'linear-gradient(180deg,#b0b0b8,#8e8e96)', borderRadius: '0 3px 3px 0' }} />

        {/* Screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '35px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Screenshot */}
          <img
            src={brand.img}
            alt={brand.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
          />

          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: overlayColor }} />

          {/* Brand logo */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              style={{
                maxWidth: brand.logoSize || '110px',
                maxHeight: brand.logoSize ? '80px' : '60px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                ...(brand.whiteBorder && {
                  border: '2px solid white',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  background: 'white',
                }),
              }}
            />
          </div>
        </div>
      </div>

      {labelBottom && label}
    </div>
  );
}

export default function BrandPhoneMarquee() {
  const overlayColor = 'rgba(0,0,0,0.80)';

  return (
    <div className="overflow-hidden w-full py-4">
      <style>{`
        @keyframes phone-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-phone-scroll {
          animation: phone-scroll 38s linear infinite;
        }
      `}</style>

      <div className="flex w-max animate-phone-scroll gap-10 px-8 items-start">
        {allBrands.map((brand, i) => (
          <div key={i} style={{ marginTop: i % 2 === 0 ? '0px' : '60px' }}>
            <PhoneFrame brand={brand} labelBottom={i % 2 === 0} overlayColor={overlayColor} />
          </div>
        ))}
      </div>
    </div>
  );
}
