import { Card, Rank, Suit } from '../types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      let value = parseInt(rank);
      if (['J', 'Q', 'K'].includes(rank)) value = 10;
      if (rank === 'A') value = 11;

      deck.push({
        id: `${rank}-${suit}-${Math.random().toString(36).substr(2, 9)}`,
        suit,
        rank,
        value,
      });
    });
  });
  return shuffle(deck);
};

export const shuffle = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateScore = (hand: Card[]): number => {
  let score = 0;
  let aces = 0;

  hand.forEach((card) => {
    if (card.isHidden) return;
    score += card.value;
    if (card.rank === 'A') aces += 1;
  });

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
};

export const isBlackjack = (hand: Card[]): boolean => {
  return hand.length === 2 && calculateScore(hand) === 21;
};
