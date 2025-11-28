export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string; // Unique ID for animations
  suit: Suit;
  rank: Rank;
  value: number;
  isHidden?: boolean;
}

export enum GameStatus {
  BETTING = 'BETTING',
  PLAYING = 'PLAYING',
  DEALER_TURN = 'DEALER_TURN',
  GAME_OVER = 'GAME_OVER',
  SESSION_OVER = 'SESSION_OVER', // New status for end of 5 rounds
}

export enum Winner {
  NONE = 'NONE',
  PLAYER = 'PLAYER',
  DEALER = 'DEALER',
  PUSH = 'PUSH',
  BLACKJACK = 'BLACKJACK', // Player Blackjack
}

export interface HighScore {
  id: string;
  score: number;
  date: string;
}