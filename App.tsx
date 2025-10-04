
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult, HistoryItem } from './types';
import { analyzeTrack } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import Footer from './components/Footer';
import HistoryPanel from './components/HistoryPanel';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selection, setSelection] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      localStorage.removeItem('analysisHistory');
    }
  }, []);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setError(null);
    setSelection([]);

    try {
      const result = await analyzeTrack(uploadedFile.name);
      const now = new Date();
      const newItem: HistoryItem = {
        id: now.toISOString(),
        fileName: uploadedFile.name,
        timestamp: now.toLocaleString(),
        result,
      };

      setHistory(prevHistory => {
        const newHistory = [newItem, ...prevHistory];
        localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
        return newHistory;
      });
      setSelection([newItem]);

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();

        // API Key issues
        if (msg.includes('api key not valid') || (msg.includes('400') && msg.includes('api key'))) {
          setError('Analysis Failed: The provided API key is invalid. Please check your key and try again.');
        } else if (msg.includes('permission denied') || msg.includes('403')) {
          setError('Analysis Failed: The API key is missing required permissions for this action.');
        } else if (msg.includes('api key')) { // Generic API key fallback
          setError('Analysis Failed: An issue occurred with your API key. Please ensure it is correct and has not expired.');
        }
        
        // Network issues
        else if (msg.includes('failed to fetch')) {
          setError('Analysis Failed: Could not connect to the analysis service. Please check your network connection.');
        } else if (msg.includes('503') || msg.includes('unavailable')) {
          setError('Analysis Failed: The analysis service is temporarily unavailable. Please try again later.');
        }

        // Generic API / Other issues
        else {
           setError('An unexpected error occurred during analysis. Please try again.');
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setSelection([]);
    setError(null);
    setIsLoading(false);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setError(null);
    setSelection(prev => {
        const isSelected = prev.some(i => i.id === item.id);
        if (isSelected) {
            return prev.filter(i => i.id !== item.id);
        }
        if (prev.length < 2) {
            return [...prev, item];
        }
        // If 2 are already selected and a new one is clicked, do nothing.
        return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    setSelection([]);
    localStorage.removeItem('analysisHistory');
  };

  return (
    <div className="min-h-screen bg-slate-dark font-sans flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8">
      <Header />

      <main className="w-full max-w-4xl flex-grow flex flex-col items-center my-8 space-y-12">
        <div className="w-full min-h-[450px] flex flex-col items-center justify-center">
          {selection.length === 0 && !isLoading && !error && <FileUpload onFileUpload={handleFileUpload} />}
          
          {isLoading && <Loader />}
          
          {error && !isLoading && (
            <div className="text-center animate-fade-in bg-red-900/50 border border-red-500 rounded-lg p-6">
              <p className="text-red-300 text-lg font-semibold">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-brand-blue hover:bg-opacity-80 text-white font-bold rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {selection.length > 0 && !isLoading && (
            <div className="w-full animate-fade-in">
              <AnalysisDisplay items={selection} />
              <div className="text-center mt-8">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-brand-blue hover:bg-opacity-80 text-white font-bold rounded-lg transition-colors shadow-lg"
                >
                  Analyze Another Track
                </button>
              </div>
            </div>
          )}
        </div>

        <HistoryPanel
          history={history}
          onSelect={handleSelectHistoryItem}
          onClear={handleClearHistory}
          selection={selection}
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;
