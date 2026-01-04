
export interface BingoCell {
  id: string;
  value: string;
  personName: string | null;
}

export type GameState = 'setup' | 'playing';

export interface AppState {
  gameState: GameState;
  selectedValues: string[];
  grid: BingoCell[];
}
