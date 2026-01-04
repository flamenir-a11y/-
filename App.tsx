
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, BingoCell, AppState } from './types';
import { BINGO_VALUES } from './constants';
import SetupView from './components/SetupView';
import GameView from './components/GameView';
import Header from './components/Header';

const STORAGE_KEY = 'bingo_app_state';
const TARGET_COUNT = 16;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      gameState: 'setup',
      selectedValues: [],
      grid: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleToggleValue = useCallback((val: string) => {
    setState(prev => {
      const isSelected = prev.selectedValues.includes(val);
      if (isSelected) {
        return {
          ...prev,
          selectedValues: prev.selectedValues.filter(v => v !== val)
        };
      } else {
        if (prev.selectedValues.length >= TARGET_COUNT) return prev;
        return {
          ...prev,
          selectedValues: [...prev.selectedValues, val]
        };
      }
    });
  }, []);

  const handleStartGame = useCallback(() => {
    if (state.selectedValues.length !== TARGET_COUNT) return;

    // Shuffle and create grid
    const shuffled = [...state.selectedValues].sort(() => Math.random() - 0.5);
    const newGrid: BingoCell[] = shuffled.map((val, idx) => ({
      id: `${idx}-${Date.now()}`,
      value: val,
      personName: null
    }));

    setState(prev => ({
      ...prev,
      gameState: 'playing',
      grid: newGrid
    }));
  }, [state.selectedValues]);

  const handleUpdateCell = useCallback((cellId: string, name: string | null) => {
    setState(prev => ({
      ...prev,
      grid: prev.grid.map(cell => 
        cell.id === cellId ? { ...cell, personName: name } : cell
      )
    }));
  }, []);

const handleReset = useCallback(() => {
  localStorage.removeItem(STORAGE_KEY);

  setState({
    gameState: 'setup',
    selectedValues: [],
    grid: [],
  });
}, []);


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 overflow-x-hidden">
      <Header 
        gameState={state.gameState} 
        onReset={handleReset} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {state.gameState === 'setup' ? (
          <SetupView 
            values={BINGO_VALUES}
            selectedValues={state.selectedValues}
            onToggleValue={handleToggleValue}
            onStartGame={handleStartGame}
            onReset={handleReset}
          />
        ) : (
          <GameView 
            grid={state.grid}
            onUpdateCell={handleUpdateCell}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t bg-white">
        נבנה עם ❤️ להיכרות וגיבוש
      </footer>
    </div>
  );
};

export default App;
