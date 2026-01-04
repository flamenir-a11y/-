
import React, { useState } from 'react';
import { BingoCell } from '../types';
import BingoGrid from './BingoGrid';
import NameDialog from './NameDialog';

interface GameViewProps {
  grid: BingoCell[];
  onUpdateCell: (cellId: string, name: string | null) => void;
  onReset: () => void;
}

const TARGET_COUNT = 16;

const GameView: React.FC<GameViewProps> = ({ grid, onUpdateCell, onReset }) => {
  const [selectedCell, setSelectedCell] = useState<BingoCell | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const filledCount = grid.filter(cell => cell.personName !== null).length;

  const handleShare = async () => {
    const element = document.getElementById('bingo-grid-capture');
    if (!element) return;

    setIsSharing(true);
    try {
      // Dynamic import of html2canvas via esm.sh
      const html2canvasModule = await import('https://esm.sh/html2canvas@1.4.1');
      const html2canvas = html2canvasModule.default;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#f8fafc',
        scale: 2,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('bingo-grid-capture');
          if (el) {
            el.style.padding = '24px';
            // Add a temporary title for the screenshot
            const title = clonedDoc.createElement('h2');
            title.innerText = 'בינגו היכרות';
            title.style.textAlign = 'center';
            title.style.color = '#4f46e5';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '16px';
            title.style.fontSize = '24px';
            el.prepend(title);
          }
        }
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsSharing(false);
          return;
        }

        const file = new File([blob], 'bingo-board.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'בינגו היכרות',
              text: 'הנה לוח הבינגו שלי! מי מכיר את מי?',
            });
          } catch (err) {
            console.error('Share failed', err);
          }
        } else {
          // Fallback: Download the file
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'bingo-board.png';
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsSharing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Capture failed', error);
      alert('חלה שגיאה ביצירת התמונה לשיתוף');
      setIsSharing(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-indigo-50 flex flex-col items-center">
        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">התקדמות</div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-indigo-600">{filledCount}</span>
          <span className="text-slate-300 text-2xl font-bold">/</span>
          <span className="text-slate-400 text-xl font-bold">{TARGET_COUNT}</span>
        </div>
        <div className="w-full max-w-xs mt-3 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-700"
            style={{ width: `${(filledCount / TARGET_COUNT) * 100}%` }}
          />
        </div>
      </div>

      <BingoGrid 
        cells={grid} 
        onCellClick={(cell) => setSelectedCell(cell)} 
      />

      {selectedCell && (
        <NameDialog 
          cell={selectedCell}
          onClose={() => setSelectedCell(null)}
          onSave={(name) => {
            onUpdateCell(selectedCell.id, name);
            setSelectedCell(null);
          }}
        />
      )}
      
      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-800 text-sm text-center flex flex-col gap-4">
        <div>
          <p className="font-medium">מצאו חברים שמתאימים לערכים שבלוח!</p>
          <p className="text-xs opacity-70">לחצו על ריבוע כדי להזין שם או לערוך</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            disabled={isSharing}
            aria-label="שתף תמונה של הלוח"
            className="flex-1 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSharing ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
            <span>{isSharing ? 'מכין תמונה...' : 'שיתוף הלוח'}</span>
          </button>

          <button
            onClick={onReset}
            className="flex-1 px-6 py-2.5 bg-white text-indigo-600 border border-indigo-200 rounded-full font-bold text-sm hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
          >
            התחל משחק חדש
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameView;
