import React from 'react';
import { motion } from 'framer-motion';
import { HighScore } from '../types';
import { Trophy, RefreshCcw } from 'lucide-react';

interface RankingViewProps {
  currentScore: number;
  highScores: HighScore[];
  onRestart: () => void;
}

const RankingView: React.FC<RankingViewProps> = ({ currentScore, highScores, onRestart }) => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
        <div className="w-full max-w-md bg-[#0f1a15] border border-casino-gold/30 rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-casino-dark to-[#0f281e] p-8 text-center border-b border-casino-gold/20">
                <div className="text-casino-goldLight text-sm uppercase tracking-[0.3em] mb-2">Session Complete</div>
                <div className="text-5xl font-serif font-bold text-white mb-1">${currentScore.toLocaleString()}</div>
                <div className="text-white/40 text-xs">Final Balance</div>
            </div>

            {/* Ranking List */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="text-casino-gold w-5 h-5" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">High Scores</h2>
                </div>
                
                <div className="space-y-3">
                    {highScores.map((score, index) => (
                        <div 
                            key={score.id}
                            className={`flex justify-between items-center p-3 rounded-lg border ${
                                score.score === currentScore && index === 0 ? 'bg-casino-gold/20 border-casino-gold/50' : 'bg-white/5 border-white/5'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`font-serif font-bold w-6 text-center ${index < 3 ? 'text-casino-gold' : 'text-white/30'}`}>
                                    #{index + 1}
                                </span>
                                <span className="text-white/60 text-xs">{score.date}</span>
                            </div>
                            <span className="text-casino-goldLight font-bold font-sans">${score.score.toLocaleString()}</span>
                        </div>
                    ))}
                    {highScores.length === 0 && (
                        <div className="text-white/30 text-center py-4 text-sm italic">No records yet</div>
                    )}
                </div>

                <button 
                    onClick={onRestart}
                    className="w-full mt-8 bg-casino-gold text-black font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCcw className="w-5 h-5" />
                    New Session
                </button>
            </div>
        </div>
    </motion.div>
  );
};

export default RankingView;