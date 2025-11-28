import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  value: number;
  onClick?: () => void;
  disabled?: boolean;
}

const Chip: React.FC<ChipProps> = ({ value, onClick, disabled }) => {
  const getColor = () => {
    if (value >= 500) return 'bg-purple-600 border-purple-300';
    if (value >= 100) return 'bg-gray-800 border-gray-400';
    if (value >= 50) return 'bg-blue-700 border-blue-400';
    if (value >= 10) return 'bg-red-600 border-red-300';
    return 'bg-white border-red-500'; // 1 or 5
  };

  const getTextColor = () => {
      if (value === 1 || value === 5) return 'text-red-600';
      return 'text-white';
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] border-dashed shadow-[0_4px_10px_rgba(0,0,0,0.5)]
        flex items-center justify-center font-bold font-serif
        ${getColor()}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
      `}
    >
      <div className={`absolute inset-0 rounded-full border-2 border-white/20`} />
      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center bg-black/10 backdrop-blur-sm`}>
        <span className={`drop-shadow-md ${getTextColor()}`}>{value}</span>
      </div>
    </motion.button>
  );
};

export default Chip;
