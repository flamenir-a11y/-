
import React, { useState } from 'react';
import { BingoCell } from '../types';

interface NameDialogProps {
  cell: BingoCell;
  onClose: () => void;
  onSave: (name: string | null) => void;
}

const NameDialog: React.FC<NameDialogProps> = ({ cell, onClose, onSave }) => {
  const [name, setName] = useState(cell.personName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name.trim() === '' ? null : name.trim());
  };

  const handleClear = () => {
    onSave(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-1">מי בחר בזה?</h3>
          <p className="text-indigo-100 text-sm px-4">"{cell.value}"</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="friendName" className="block text-sm font-bold text-slate-700 mb-2 mr-1">
              שם החבר/ה:
            </label>
            <input
              autoFocus
              id="friendName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="הקלידו שם כאן..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center text-lg font-medium"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              {cell.personName ? 'עדכון' : 'אישור'}
            </button>
            
            <div className="flex gap-2">
               {cell.personName && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100"
                >
                  ניקוי סימון
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NameDialog;
