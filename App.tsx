import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card as CardType, GameStatus, Winner, HighScore } from './types';
import { createDeck, calculateScore, isBlackjack } from './utils/gameLogic';
import Card from './components/Card';
import Chip from './components/Chip';
import Controls from './components/Controls';
import ResultOverlay from './components/ResultOverlay';
import RankingView from './components/RankingView';
import { Coins, Layers } from 'lucide-react';

const MAX_ROUNDS = 5;
const STARTING_BALANCE = 2500;

const App: React.FC = () => {
  // Game State
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.BETTING);
  const [winner, setWinner] = useState<Winner>(Winner.NONE);
  const [balance, setBalance] = useState<number>(STARTING_BALANCE);
  const [currentBet, setCurrentBet] = useState<number>(0);
  const [resultNetChange, setResultNetChange] = useState<number>(0);
  const [isDoubleDown, setIsDoubleDown] = useState<boolean>(false);
  
  // Session State
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  // Load High Scores on Mount
  useEffect(() => {
    const stored = localStorage.getItem('bj_royal_scores');
    if (stored) {
      try {
        setHighScores(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load scores");
      }
    }
  }, []);

  // Initialize deck when needed
  useEffect(() => {
    if (deck.length < 10) {
      setDeck(createDeck());
    }
  }, [deck.length]);

  // Audio effect placeholder
  const playSound = (type: 'deal' | 'chip' | 'win') => {
      // Future implementation
  };

  // --- Session Management ---

  const saveScore = (finalScore: number) => {
    const newScore: HighScore = {
      id: Date.now().toString(),
      score: finalScore,
      date: new Date().toLocaleDateString()
    };
    
    const updatedScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep top 5
      
    setHighScores(updatedScores);
    localStorage.setItem('bj_royal_scores', JSON.stringify(updatedScores));
  };

  const handleRestartSession = () => {
    setBalance(STARTING_BALANCE);
    setRoundsPlayed(0);
    setPlayerHand([]);
    setDealerHand([]);
    setStatus(GameStatus.BETTING);
    setWinner(Winner.NONE);
    setCurrentBet(0);
    setIsDoubleDown(false);
  };

  // --- Betting Actions ---

  const handleAddBet = (amount: number) => {
    // UPDATED: Allow betting even if balance is insufficient (debt allowed)
    setBalance(prev => prev - amount);
    setCurrentBet(prev => prev + amount);
    playSound('chip');
  };

  const handleAllIn = () => {
    if (balance > 0) {
      const amount = balance;
      setBalance(0);
      setCurrentBet(prev => prev + amount);
      playSound('chip');
    }
  };

  const handleClearBet = () => {
    setBalance(prev => prev + currentBet);
    setCurrentBet(0);
  };

  // --- Game Flow ---

  const dealInitialCards = useCallback(async () => {
    if (currentBet === 0) return;
    
    // Start Round
    setStatus(GameStatus.PLAYING);
    setWinner(Winner.NONE);
    setIsDoubleDown(false);
    setPlayerHand([]);
    setDealerHand([]);
    
    // Increment rounds counter at start of play
    setRoundsPlayed(prev => prev + 1);

    let currentDeck = [...deck];
    if (currentDeck.length < 10) currentDeck = createDeck();

    const p1 = currentDeck.pop()!;
    const d1 = currentDeck.pop()!;
    const p2 = currentDeck.pop()!;
    const d2 = { ...currentDeck.pop()!, isHidden: true };

    setDeck(currentDeck);

    setPlayerHand([p1]);
    await new Promise(r => setTimeout(r, 400));
    setDealerHand([d1]);
    await new Promise(r => setTimeout(r, 400));
    setPlayerHand([p1, p2]);
    await new Promise(r => setTimeout(r, 400));
    setDealerHand([d1, d2]);
    await new Promise(r => setTimeout(r, 500));

    // Check Instant Blackjack
    const pScore = calculateScore([p1, p2]);
    if (pScore === 21) {
        setTimeout(() => handleStand(true), 500);
    }

  }, [currentBet, deck]);

  const handleHit = async () => {
    const newCard = deck[deck.length - 1];
    setDeck(prev => prev.slice(0, -1));
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    playSound('deal');

    if (calculateScore(newHand) > 21) {
      endGame(Winner.DEALER);
    }
  };

  const handleStand = useCallback((playerBlackjack = false) => {
    setStatus(GameStatus.DEALER_TURN);
    setDealerHand(prev => prev.map(c => ({ ...c, isHidden: false })));
  }, []);

  const handleDouble = async () => {
    // UPDATED: Allow double down even if balance is insufficient
    setIsDoubleDown(true);
    setBalance(prev => prev - currentBet);
    // const originalBet = currentBet;
    setCurrentBet(prev => prev * 2);
    
    const newCard = deck[deck.length - 1];
    setDeck(prev => prev.slice(0, -1));
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    playSound('deal');
    
    const score = calculateScore(newHand);
    if (score > 21) {
      setTimeout(() => endGame(Winner.DEALER), 800);
    } else {
      // Force stand after double
      setTimeout(() => handleStand(), 1000);
    }
  };

  // Dealer AI
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const playDealerTurn = async () => {
      if (status === GameStatus.DEALER_TURN) {
        await new Promise(r => setTimeout(r, 600));

        let currentDealerHand = [...dealerHand];
        let dScore = calculateScore(currentDealerHand);
        let pScore = calculateScore(playerHand);

        if (pScore > 21) {
           endGame(Winner.DEALER);
           return;
        }

        if (dScore > 21) {
          endGame(Winner.PLAYER);
        } else if (dScore > pScore) {
          endGame(Winner.DEALER);
        } else if (dScore < pScore) {
            if (isBlackjack(playerHand) && !isBlackjack(currentDealerHand)) {
                endGame(Winner.BLACKJACK);
            } else {
                endGame(Winner.PLAYER);
            }
        } else {
             if (isBlackjack(playerHand) && !isBlackjack(currentDealerHand)) {
                 endGame(Winner.BLACKJACK);
             } else if (!isBlackjack(playerHand) && isBlackjack(currentDealerHand)) {
                 endGame(Winner.DEALER);
             } else {
                 endGame(Winner.PUSH);
             }
        }
      }
    };

    if (status === GameStatus.DEALER_TURN) {
       const dScore = calculateScore(dealerHand);
       const isHidden = dealerHand.some(c => c.isHidden);
       
       if (!isHidden) {
           if (dScore < 17) {
               timeoutId = setTimeout(() => {
                   const newCard = deck[deck.length - 1];
                   setDeck(prev => prev.slice(0, -1));
                   setDealerHand(prev => [...prev, newCard]);
                   playSound('deal');
               }, 1000);
           } else {
               playDealerTurn();
           }
       }
    }

    return () => clearTimeout(timeoutId);
  }, [status, dealerHand, deck, playerHand]);


  const endGame = (winner: Winner) => {
    setWinner(winner);
    setStatus(GameStatus.GAME_OVER);
    playSound('win');

    let winAmount = 0;
    let net = 0;

    if (winner === Winner.PLAYER) {
      winAmount = currentBet * 2;
      net = currentBet; 
    } else if (winner === Winner.BLACKJACK) {
      winAmount = currentBet + (currentBet * 1.5);
      net = currentBet * 1.5;
    } else if (winner === Winner.PUSH) {
      winAmount = currentBet;
      net = 0;
    } else {
      // Dealer wins
      net = -currentBet;
    }

    if (winAmount > 0) {
        setBalance(prev => prev + winAmount);
    }
    setResultNetChange(net);
  };

  const handleNextPhase = () => {
    if (roundsPlayed >= MAX_ROUNDS) {
      // End Session
      setStatus(GameStatus.SESSION_OVER);
      saveScore(balance);
    } else {
      // Prepare next round
      setPlayerHand([]);
      setDealerHand([]);
      setStatus(GameStatus.BETTING);
      setWinner(Winner.NONE);
      setCurrentBet(0);
      setIsDoubleDown(false);
    }
  };

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  return (
    <div className="min-h-screen bg-felt bg-cover bg-fixed font-sans text-white overflow-hidden relative selection:bg-casino-gold selection:text-black">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-40 pointer-events-none"></div>
      
      {/* Top Bar */}
      <header className="relative z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-casino-gold/20 rounded-full border border-casino-gold/50 text-casino-gold">
                <Coins size={24} />
            </div>
            <div>
                <div className="text-xs text-casino-goldLight uppercase tracking-widest opacity-80">Balance</div>
                <div className={`text-2xl font-serif font-bold ${balance < 0 ? 'text-red-400' : ''}`}>${balance.toLocaleString()}</div>
            </div>
         </div>
         
         {/* Rounds Counter */}
         <div className="flex flex-col items-center">
             <div className="text-casino-gold font-serif italic text-xl md:text-2xl opacity-50">Royale Blackjack</div>
             {status !== GameStatus.SESSION_OVER && (
                 <div className="flex items-center gap-2 mt-1 text-xs font-bold uppercase tracking-widest text-white/40 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                    <Layers size={12} />
                    <span>Round {Math.min(roundsPlayed + (status === GameStatus.BETTING ? 1 : 0), MAX_ROUNDS)} / {MAX_ROUNDS}</span>
                 </div>
             )}
         </div>

         {/* Spacer for centering logic if needed, or menu button */}
         <div className="w-24 hidden md:block"></div> 
      </header>

      {/* Main Game Area */}
      <main className="relative z-10 flex flex-col items-center justify-start h-[calc(100vh-100px)] pt-4 md:pt-10 px-4">
        
        {/* Dealer Area */}
        <div className="relative w-full max-w-4xl h-48 md:h-64 flex flex-col items-center justify-start mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-xs uppercase tracking-widest opacity-50">Dealer</span>
                {status !== GameStatus.BETTING && status !== GameStatus.SESSION_OVER && (
                    <div className="px-2 py-0.5 bg-black/40 rounded-full text-xs font-bold text-white/80 border border-white/10">
                        {dealerHand.some(c => c.isHidden) ? '?' : dealerScore}
                    </div>
                )}
            </div>
            <div className="relative h-48 w-32">
                {dealerHand.map((card, i) => (
                    <Card key={card.id} card={card} index={i} isDealer />
                ))}
            </div>
        </div>

        {/* Center Info / Logo */}
        {status === GameStatus.BETTING && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
            >
                <div className="text-white/10 text-6xl md:text-8xl font-serif font-bold whitespace-nowrap">BLACKJACK</div>
                <div className="text-casino-gold/20 text-sm uppercase tracking-[1em] mt-2">Pays 3 to 2</div>
            </motion.div>
        )}

        {/* Player Area */}
        <div className="relative w-full max-w-4xl h-48 md:h-64 flex flex-col items-center justify-end mt-auto mb-20 md:mb-10">
            <div className="relative h-48 w-32 mb-4">
                {playerHand.map((card, i) => (
                    <Card key={card.id} card={card} index={i} />
                ))}
            </div>
             <div className="flex justify-center items-center gap-2">
                <span className="text-xs uppercase tracking-widest opacity-50">You</span>
                {status !== GameStatus.BETTING && status !== GameStatus.SESSION_OVER && (
                    <div className="px-2 py-0.5 bg-casino-gold/20 rounded-full text-xs font-bold text-casino-gold border border-casino-gold/30">
                        {playerScore}
                    </div>
                )}
            </div>
        </div>

        {/* Betting UI */}
        {status === GameStatus.BETTING && (
            <div className="absolute bottom-10 md:bottom-12 w-full flex flex-col items-center gap-6">
                <div className="flex flex-col items-center mb-2">
                    <span className="text-casino-goldLight uppercase text-xs tracking-widest mb-1">Current Bet</span>
                    <span className="text-4xl font-serif font-bold text-white">${currentBet}</span>
                </div>

                <div className="flex gap-3 md:gap-6 items-center">
                    {[10, 50, 100, 500].map(val => (
                        <Chip 
                            key={val} 
                            value={val} 
                            onClick={() => handleAddBet(val)} 
                            disabled={false} // UPDATED: Always enabled
                        />
                    ))}
                    <button 
                         onClick={handleAllIn}
                         disabled={balance <= 0} // Only disabled if 0 or less
                         className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-900/80 border-2 border-red-500 text-red-200 font-bold font-serif text-sm md:text-base flex items-center justify-center hover:bg-red-800 hover:scale-105 active:scale-95 transition-all shadow-lg uppercase leading-tight disabled:opacity-50 disabled:grayscale"
                    >
                        All In
                    </button>
                </div>

                <div className="flex gap-4 mt-4">
                    <button 
                        onClick={handleClearBet}
                        disabled={currentBet === 0}
                        className="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm uppercase font-bold tracking-wider"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={dealInitialCards}
                        disabled={currentBet === 0}
                        className="px-10 py-3 rounded-full bg-casino-gold text-black font-bold text-lg uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-lg shadow-casino-gold/20 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        Deal
                    </button>
                </div>
            </div>
        )}

        {/* Gameplay Controls */}
        {(status === GameStatus.PLAYING) && (
            <div className="absolute bottom-10 w-full z-20">
                <Controls 
                    onHit={handleHit}
                    onStand={() => handleStand()}
                    onDouble={handleDouble}
                    isHandEligible={playerHand.length === 2}
                    canAffordDouble={true} // UPDATED: Always true
                    disabled={false}
                />
            </div>
        )}
      </main>

      {/* Round Result Overlay */}
      <ResultOverlay 
        winner={winner} 
        netChange={resultNetChange}
        onReset={handleNextPhase}
        isDoubleDown={isDoubleDown}
        isSessionEnd={roundsPlayed >= MAX_ROUNDS}
      />

      {/* Session Ranking View */}
      {status === GameStatus.SESSION_OVER && (
          <RankingView 
             currentScore={balance} 
             highScores={highScores}
             onRestart={handleRestartSession}
          />
      )}

    </div>
  );
};

export default App;