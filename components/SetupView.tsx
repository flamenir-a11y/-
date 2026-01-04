
import React from 'react';

interface SetupViewProps {
  values: string[];
  selectedValues: string[];
  onToggleValue: (val: string) => void;
  onStartGame: () => void;
  onReset?: () => void;
}

const TARGET_COUNT = 16;

const SetupView: React.FC<SetupViewProps> = ({ 
  values, 
  selectedValues, 
  onToggleValue, 
  onStartGame,
  onReset
}) => {
  const remaining = TARGET_COUNT - selectedValues.length;

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-indigo-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">בואו נרכיב את הלוח</h2>
        <p className="text-slate-500 text-center mb-6">
          בחרו בדיוק {TARGET_COUNT} ערכים או תכונות שיופיעו בלוח הבינגו שלכם.
        </p>
        
        <div className="flex justify-center items-center gap-4 mb-2">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-indigo-600">{selectedValues.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">נבחרו</span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex flex-col items-center">
            <span className={`text-3xl font-black ${remaining === 0 ? 'text-green-500' : 'text-slate-300'}`}>
              {remaining > 0 ? remaining : '✅'}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">נותרו</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(selectedValues.length / TARGET_COUNT) * 100}%` }}
          />
        </div>

        {selectedValues.length > 0 && onReset && (
          <div className="flex justify-center mb-6">
          <button 
  onClick={() => {
    console.log("RESET CLICKED");
    onReset();
  }}
  className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100"
>

              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              התחל משחק חדש
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-[50vh] overflow-y-auto px-2 pb-10 custom-scrollbar">
          {values.map((val, idx) => {
            const isSelected = selectedValues.includes(val);
            return (
              <button
                key={idx}
                onClick={() => onToggleValue(val)}
                className={`
                  group relative text-right p-5 rounded-xl border-2 transition-all duration-200 
                  text-lg font-bold
                  ${isSelected 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]' 
                    : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50'}
                  ${!isSelected && selectedValues.length >= TARGET_COUNT ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between gap-3">
                   <span className="leading-snug flex-1">{val}</span>
                   {isSelected ? (
                     <svg className="w-6 h-6 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                     </svg>
                   ) : (
                     <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex-shrink-0 group-hover:border-indigo-300" />
                   )}
                </div>

                {/* Magnified Text Display on Hover (Desktop) */}
                <div className="hidden lg:block pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-2xl border border-slate-700 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-slate-800">
                  {val}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-4 left-0 right-0 px-4">
        <button
          onClick={onStartGame}
          disabled={selectedValues.length !== TARGET_COUNT}
          className={`
            w-full py-4 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform active:scale-95
            ${selectedValues.length === TARGET_COUNT 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1' 
              : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'}
          `}
        >
          {selectedValues.length === TARGET_COUNT ? 'מתחילים לשחק!' : `בחרו עוד ${remaining} ערכים`}
        </button>
      </div>
    </div>
  );
};

export default SetupView;
