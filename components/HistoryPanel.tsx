
import React, { useState, useMemo } from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  selection: HistoryItem[];
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear, selection }) => {
  const [sortMethod, setSortMethod] = useState('newest');
  const selectionIds = new Set(selection.map(item => item.id));
  const selectionIsFull = selection.length >= 2;

  const sortedHistory = useMemo(() => {
    const sorted = [...history];
    switch (sortMethod) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime());
      case 'name_asc':
        return sorted.sort((a, b) => a.fileName.localeCompare(b.fileName));
      case 'name_desc':
        return sorted.sort((a, b) => b.fileName.localeCompare(a.fileName));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
    }
  }, [history, sortMethod]);

  return (
    <section className="w-full max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-light">Analysis History</h2>
          <p className="text-sm text-slate-400">Select up to two tracks to compare.</p>
        </div>
        
        {history.length > 0 && (
          <div className="flex items-center gap-4">
            {history.length > 1 && (
              <div className="flex items-center space-x-2">
                  <label htmlFor="sort-history" className="text-sm text-slate-400">Sort by:</label>
                  <select
                      id="sort-history"
                      value={sortMethod}
                      onChange={(e) => setSortMethod(e.target.value)}
                      className="bg-slate-mid border border-slate-light/20 rounded-md px-3 py-1 text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm"
                  >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name_asc">Filename (A-Z)</option>
                      <option value="name_desc">Filename (Z-A)</option>
                  </select>
              </div>
            )}
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold rounded-lg transition-colors border border-red-700"
              aria-label="Clear all analysis history"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
      <div className="bg-navy rounded-xl shadow-lg border border-slate-light/20 p-4">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">Your past analyses will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedHistory.map(item => {
              const isSelected = selectionIds.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between ${
                    isSelected 
                    ? 'bg-brand-blue/30 scale-[1.02] shadow-lg' 
                    : 'bg-slate-mid/50'
                  } ${
                    selectionIsFull && !isSelected
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-slate-mid'
                  }`}
                  aria-current={isSelected}
                  disabled={selectionIsFull && !isSelected}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate pr-2">{item.fileName}</p>
                    <p className="text-xs text-slate-400">{item.timestamp}</p>
                  </div>
                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <span className="text-sm font-semibold text-slate-300 hidden sm:block">{item.result.recommendation}</span>
                    <p className={`text-3xl font-black ${getScoreColor(item.result.overallScore)}`}>
                      {item.result.overallScore}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default HistoryPanel;
