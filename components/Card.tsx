import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  card: CardType;
  index: number;
  isDealer?: boolean;
}

const Card: React.FC<CardProps> = ({ card, index, isDealer }) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  
  const SuitIcon = () => {
    switch (card.suit) {
      case 'hearts': return <Heart className="w-full h-full fill-current" />;
      case 'diamonds': return <Diamond className="w-full h-full fill-current" />;
      case 'clubs': return <Club className="w-full h-full fill-current" />;
      case 'spades': return <Spade className="w-full h-full fill-current" />;
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: -200, 
        x: isDealer ? 50 : -50, 
        rotateY: card.isHidden ? 180 : 0,
        scale: 0.5
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: index * 30, // Stack cards horizontally
        rotateY: card.isHidden ? 180 : 0,
        scale: 1,
        rotateZ: (Math.random() - 0.5) * 5 // Subtle organic rotation
      }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20, 
        delay: index * 0.2 
      }}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        zIndex: index
      }}
      className="absolute w-24 h-36 md:w-32 md:h-48 rounded-xl shadow-2xl"
    >
      {/* Front of Card */}
      <div 
        className={`absolute inset-0 w-full h-full bg-white rounded-xl flex flex-col justify-between p-2 select-none border border-gray-200 ${isRed ? 'text-red-600' : 'text-gray-900'}`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="text-left">
          <div className="font-bold text-lg md:text-xl font-serif">{card.rank}</div>
          <div className="w-4 h-4 md:w-5 md:h-5"><SuitIcon /></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-10 h-10 md:w-16 md:h-16 opacity-20"><SuitIcon /></div>
        </div>

        <div className="text-right transform rotate-180">
          <div className="font-bold text-lg md:text-xl font-serif">{card.rank}</div>
          <div className="w-4 h-4 md:w-5 md:h-5 ml-auto"><SuitIcon /></div>
        </div>
      </div>

      {/* Back of Card (The Pattern) */}
      <div 
        className="absolute inset-0 w-full h-full bg-casino-red rounded-xl border-2 border-white shadow-inner flex items-center justify-center"
        style={{ 
          backfaceVisibility: 'hidden', 
          transform: 'rotateY(180deg)',
          backgroundImage: 'radial-gradient(#a61e1e 15%, transparent 16%), radial-gradient(#a61e1e 15%, transparent 16%)',
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 5px 5px',
          backgroundColor: '#8a1818'
        }}
      >
        <div className="w-16 h-16 rounded-full border-2 border-casino-gold opacity-50 flex items-center justify-center">
            <span className="text-casino-gold font-serif text-xs font-bold tracking-widest">ROYALE</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
