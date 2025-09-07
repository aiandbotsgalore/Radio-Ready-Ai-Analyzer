
import React from 'react';
import type { AnalysisResult, Metric } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  fileName: string;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

const getRecommendationClasses = (recommendation: string): string => {
  switch (recommendation) {
    case 'Recommended for Radio':
      return 'bg-green-500/20 text-green-300 border-green-500';
    case 'Needs Work':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
    case 'Not Recommended':
      return 'bg-red-500/20 text-red-300 border-red-500';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500';
  }
};

const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const ratingPercentage = metric.rating * 10;
  
  const getRatingColor = (rating: number): string => {
    if (rating >= 8) return 'bg-green-500';
    if (rating >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-mid/50 rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <h4 className="font-bold text-brand-light">{metric.name}</h4>
          <span className="font-mono text-lg font-semibold text-white">{metric.value}</span>
        </div>
        <div className="w-full bg-slate-light/30 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full ${getRatingColor(metric.rating)}`}
            style={{ width: `${ratingPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-400">{metric.explanation}</p>
      </div>
    </div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, fileName }) => {
  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 bg-navy rounded-xl shadow-2xl border border-slate-light/20">
      <div className="text-center mb-6 border-b border-slate-light/20 pb-6">
        <h2 className="text-2xl font-bold text-white">Analysis for: <span className="text-brand-blue">{fileName}</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1 flex flex-col items-center justify-center bg-slate-mid/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Overall Score</h3>
          <p className={`text-7xl font-black ${getScoreColor(result.overallScore)}`}>{result.overallScore}</p>
          <p className="text-slate-400">out of 100</p>
        </div>
        <div className="md:col-span-2 flex flex-col justify-center bg-slate-mid/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Verdict</h3>
            <div className={`px-4 py-2 rounded-md text-center border ${getRecommendationClasses(result.recommendation)}`}>
              <p className="text-xl font-bold">{result.recommendation}</p>
            </div>
          <p className="text-slate-400 mt-4">{result.summary}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Detailed Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.metrics.map((metric) => (
            <MetricCard key={metric.name} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
