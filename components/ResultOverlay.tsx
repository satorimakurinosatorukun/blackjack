import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Winner } from '../types';

interface ResultOverlayProps {
  winner: Winner;
  netChange: number;
  onReset: () => void;
  isDoubleDown: boolean;
  isSessionEnd: boolean;
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({ winner, netChange, onReset, isDoubleDown, isSessionEnd }) => {
  if (winner === Winner.NONE) return null;

  const isWin = winner === Winner.PLAYER || winner === Winner.BLACKJACK;
  const isDoubleDownWin = isWin && isDoubleDown;

  const getMessage = () => {
    switch (winner) {
      case Winner.BLACKJACK: return "BLACKJACK";
      case Winner.PLAYER: return isDoubleDownWin ? "BIG WIN" : "YOU WIN";
      case Winner.DEALER: return "DEALER WINS";
      case Winner.PUSH: return "PUSH";
      default: return "";
    }
  };

  const getSubMessage = () => {
    if (winner === Winner.BLACKJACK) return "PAYOUT 3:2";
    if (isDoubleDownWin) return "DOUBLE DOWN SUCCESS";
    return "";
  }

  const getColor = () => {
      switch (winner) {
        case Winner.BLACKJACK: return "text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]";
        case Winner.PLAYER: return isDoubleDownWin 
            ? "text-transparent bg-clip-text bg-gradient-to-b from-purple-300 via-purple-400 to-indigo-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]" 
            : "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]";
        case Winner.DEALER: return "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]";
        default: return "text-gray-300";
      }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 pointer-events-auto overflow-hidden"
      >
        {/* Background Sparkles for big wins */}
        {(winner === Winner.BLACKJACK || isDoubleDownWin) && (
            <motion.div 
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: 0.3 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent z-[-1]"
            />
        )}

        <motion.div
          initial={{ scale: 0.5, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center relative p-8"
        >
            {/* Main Title */}
            <h1 className={`text-6xl md:text-9xl font-black font-serif italic uppercase mb-2 leading-none tracking-tighter ${getColor()}`}>
                {getMessage()}
            </h1>

            {/* Subtitle for special events */}
            {getSubMessage() && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-casino-goldLight tracking-[0.5em] text-sm md:text-lg uppercase font-bold mb-4"
                 >
                     {getSubMessage()}
                 </motion.div>
            )}
            
            {/* Money Change */}
            {netChange !== 0 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className={`text-3xl md:text-4xl font-bold font-sans ${netChange > 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                    {netChange > 0 ? '+' : ''}{netChange}
                </motion.div>
            )}

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.8 }}
                onClick={onReset}
                className="mt-12 px-10 py-4 bg-gradient-to-r from-casino-gold to-yellow-600 text-black font-bold text-xl rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] uppercase tracking-wider border border-white/20"
            >
                {isSessionEnd ? "See Final Results" : "Next Hand"}
            </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultOverlay;