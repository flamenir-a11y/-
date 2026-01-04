
import React from 'react';
import { BingoCell } from '../types';

interface BingoGridProps {
  cells: BingoCell[];
  onCellClick: (cell: BingoCell) => void;
}

// Predefined palette of 16 visually distinct colors (Tailwind 600 weight equivalents)
const COLOR_PALETTE = [
  '#4f46e5', // Indigo
  '#e11d48', // Rose
  '#059669', // Emerald
  '#d97706', // Amber
  '#2563eb', // Blue
  '#c026d3', // Fuchsia
  '#65a30d', // Lime
  '#0891b2', // Cyan
  '#dc2626', // Red
  '#8b5cf6', // Violet
  '#ea580c', // Orange
  '#0d9488', // Teal
  '#db2777', // Pink
  '#0284c7', // Sky
  '#ca8a04', // Yellow
  '#9333ea', // Purple
];

const BingoGrid: React.FC<BingoGridProps> = ({ cells, onCellClick }) => {
  // Create a mapping of unique names to colors from the palette
  const uniqueNames: string[] = [];
  cells.forEach(cell => {
    if (cell.personName && !uniqueNames.includes(cell.personName)) {
      uniqueNames.push(cell.personName);
    }
  });

  const nameToColorMap = new Map<string, string>();
  uniqueNames.forEach((name, index) => {
    nameToColorMap.set(name, COLOR_PALETTE[index % COLOR_PALETTE.length]);
  });

  return (
    <div 
      id="bingo-grid-capture" 
      className="grid grid-cols-4 gap-1.5 sm:gap-3 bg-slate-200 p-1.5 sm:p-3 rounded-2xl shadow-inner aspect-square"
    >
      {cells.map((cell) => {
        const isFilled = cell.personName !== null;
        const backgroundColor = isFilled ? nameToColorMap.get(cell.personName!) : 'white';
        
        return (
          <button
            key={cell.id}
            onClick={() => onCellClick(cell)}
            style={{ backgroundColor: isFilled ? backgroundColor : undefined }}
            className={`
              relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg sm:rounded-xl 
              transition-all duration-200 aspect-square overflow-hidden
              ${isFilled 
                ? 'text-white shadow-md ring-2 ring-white/30 ring-offset-1' 
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm'}
              active:scale-90
            `}
          >
            <div className={`
              w-full h-full flex flex-col justify-center text-center leading-tight
              ${isFilled ? 'gap-0.5 sm:gap-1' : ''}
            `}>
              {isFilled ? (
                <>
                  <span className="text-sm sm:text-base font-black border-b border-white/30 pb-0.5 sm:pb-1 line-clamp-2">
                    {cell.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium opacity-95 line-clamp-1 mt-0.5">
                    {cell.personName}
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-lg md:text-xl font-bold line-clamp-4 px-1">
                  {cell.value}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default BingoGrid;
