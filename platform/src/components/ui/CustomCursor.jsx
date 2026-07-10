import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function detectTouch() {
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(hover: none)').matches
  );
}

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isTouch, setIsTouch] = useState(detectTouch);

  // Catch any touch event that slips past the initial detection
  useEffect(() => {
    const handleTouch = () => setIsTouch(true);
    window.addEventListener('touchstart', handleTouch, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = () => setHidden(false);
    const leave = () => setHidden(true);
    const over = (e) => { if (e.target.closest('a, button, [data-cursor]')) setHovered(true); };
    const out  = (e) => { if (e.target.closest('a, button, [data-cursor]')) setHovered(false); };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseenter', enter);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', enter);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-[#14b8ab]"
        animate={{ x: pos.x - 20, y: pos.y - 20, width: hovered ? 54 : 40, height: hovered ? 54 : 40, opacity: hidden ? 0 : 0.8 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.6 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#14b8ab]"
        animate={{ x: pos.x - 4, y: pos.y - 4, opacity: hidden ? 0 : 1 }}
        style={{ width: 8, height: 8 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
    </>
  );
}
