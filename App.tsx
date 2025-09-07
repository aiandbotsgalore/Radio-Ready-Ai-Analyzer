
import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeTrack } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeTrack(uploadedFile.name);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-dark font-sans flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8">
      <Header />

      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center my-8">
        {!file && !isLoading && <FileUpload onFileUpload={handleFileUpload} />}
        
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

        {analysisResult && !isLoading && (
          <div className="w-full animate-fade-in">
            <AnalysisDisplay result={analysisResult} fileName={file?.name || 'your track'} />
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
      </main>

      <Footer />
    </div>
  );
};

export default App;
