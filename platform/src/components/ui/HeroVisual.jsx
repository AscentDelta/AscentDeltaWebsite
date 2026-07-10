import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function HeroVisual() {
  const myRef = useRef(null);
  const location = useLocation();
  const [opacity, setOpacity] = useState(1);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    setOpacity(1);
  }, [location.pathname]);

  useEffect(() => {
    let effect = null;
    if (window.VANTA && window.VANTA.WAVES) {
      try {
        effect = window.VANTA.WAVES({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x0d1e2a,
          backgroundColor: 0x02070b,
          shininess: 30.00,
          waveHeight: 18.00,
          waveSpeed: 0.50,
          zoom: 0.95,
          mouseCoeffX: 12,
          mouseCoeffY: 8
        });
        setWebglFailed(false);
      } catch {
        setWebglFailed(true);
      }
    } else {
      setWebglFailed(true);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vHeight = document.documentElement.clientHeight;
      const maxScroll = document.documentElement.scrollHeight - vHeight;
      let newOpacity = 1;
      if (maxScroll > 0) {
        if (maxScroll <= vHeight) {
          newOpacity = 1 - (scrollY / maxScroll) * 0.55;
        } else {
          if (scrollY <= vHeight) {
            newOpacity = 1 - (scrollY / vHeight) * 0.50;
          } else {
            const progress = (scrollY - vHeight) / (maxScroll - vHeight);
            newOpacity = 0.50 - progress * 0.10;
          }
        }
      }
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (effect) effect.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none bg-black">
      <div
        style={{ opacity }}
        className="absolute inset-0 w-full h-full transition-opacity duration-75 ease-out"
      >
        {/* Vanta target — only visible when WebGL works */}
        <div
          ref={myRef}
          className="absolute inset-0 w-full h-full transition-all duration-300"
        />

        {/* CSS fallback when WebGL is unavailable */}
        {webglFailed && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #0d1e2a 0%, #02070b 60%)',
            }}
          />
        )}

        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-10 pointer-events-none" />
      </div>
    </div>
  );
}
