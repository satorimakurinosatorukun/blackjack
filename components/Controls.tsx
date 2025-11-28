import React from 'react';
import { motion } from 'framer-motion';

interface ControlsProps {
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  isHandEligible: boolean; // Has 2 cards
  canAffordDouble: boolean; // Has enough money
  disabled: boolean;
}

const Button: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'accent' }> = ({ onClick, disabled, children, variant = 'primary' }) => {
  const baseStyle = "px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm md:text-base transition-all shadow-lg backdrop-blur-md border relative overflow-hidden";
  
  const variants = {
    primary: "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40",
    secondary: "bg-red-600/80 border-red-500 text-white hover:bg-red-600 hover:border-red-400",
    accent: "bg-casino-gold/80 border-casino-goldLight text-black hover:bg-casino-gold hover:text-black hover:border-white disabled:bg-casino-gold/20 disabled:text-white/30",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </motion.button>
  );
};

const Controls: React.FC<ControlsProps> = ({ onHit, onStand, onDouble, isHandEligible, canAffordDouble, disabled }) => {
  return (
    <div className="flex gap-4 justify-center items-center mt-8">
      <Button onClick={onHit} disabled={disabled} variant="primary">
        Hit
      </Button>
      <Button onClick={onStand} disabled={disabled} variant="secondary">
        Stand
      </Button>
      {isHandEligible && (
        <Button onClick={onDouble} disabled={disabled || !canAffordDouble} variant="accent">
          Double
        </Button>
      )}
    </div>
  );
};

export default Controls;