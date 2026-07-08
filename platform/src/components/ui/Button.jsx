import { motion } from 'framer-motion';

export default function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-8 py-4 rounded-full font-semibold transition-colors
        bg-white text-black
        hover:bg-neutral-200
        ${className}`}
    >
      {children}
    </motion.button>
  );
}
