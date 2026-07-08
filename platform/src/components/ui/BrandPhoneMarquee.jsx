const brands = [
  { name: 'Avon',         img: '/brand-screenshots/avon.png',     logo: '/Client Logos/Coloured/Avon-Logo.png' },
  { name: "Levi's",       img: '/brand-screenshots/levis.png',    logo: '/Client Logos/Coloured/Levis.png' },
  { name: 'The Moms Co',  img: '/brand-screenshots/momco.png',    logo: '/Client Logos/Coloured/TheMomsCo-logo.png', logoSize: '145px' },
  { name: 'Bikaji',       img: '/brand-screenshots/bikaji.png',   logo: '/Client Logos/Coloured/bikaji.png' },
  { name: 'Enamor',       img: '/brand-screenshots/enamor.png',   logo: '/Client Logos/Coloured/Enamor.png' },
  { name: 'Crax',         img: '/brand-screenshots/crax.png',     logo: '/Client Logos/Coloured/crax_logo.png' },
  { name: 'Durex',        img: '/brand-screenshots/durex.png',    logo: '/Client Logos/Coloured/Durex/Durex-Logo-5.png' },
  { name: 'Colgate',      img: '/brand-screenshots/colgate.png',  logo: '/Client Logos/Coloured/colgate.png' },
  { name: 'Nxtface',      img: '/brand-screenshots/nxtface.png',  logo: '/Client Logos/Coloured/black-logo.png', whiteBorder: true, logoSize: '145px' },
  { name: 'Color Pencil', img: '/brand-screenshots/cp.png',       logo: '/Client Logos/Coloured/CP logo.png', logoSize: '145px' },
  { name: 'Ryze',         img: '/brand-screenshots/ryze.png',     logo: '/Client Logos/Coloured/Ryze.png' },
  { name: 'Neuro',        img: '/brand-screenshots/neuro.png',    logo: '/Client Logos/Coloured/Neuro logo.png' },
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
