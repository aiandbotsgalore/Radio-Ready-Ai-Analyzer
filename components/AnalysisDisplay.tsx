import React from 'react';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis, 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis,
  RadarChart,
  PolarGrid,
  Radar,
  Tooltip,
  Legend
} from 'recharts';
import type { AnalysisResult, Metric, HistoryItem } from '../types';

interface AnalysisDisplayProps {
  items: HistoryItem[];
}

const getRatingHexColor = (rating: number, scale: 10 | 100): string => {
  const score = scale === 100 ? rating : rating * 10;
  if (score >= 80) return '#4ADE80'; // Corresponds to Tailwind's green-400
  if (score >= 50) return '#FACC15'; // Corresponds to Tailwind's yellow-400
  return '#F87171'; // Corresponds to Tailwind's red-400
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

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color = getRatingHexColor(score, 100);
  const data = [{ name: 'score', value: score }];

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="80%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={15}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            angleAxisId={0}
            data={[{ value: 100 }]}
            fill="rgba(71, 85, 105, 0.5)"
            cornerRadius={10}
          />
          <RadialBar
            dataKey="value"
            fill={color}
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-5xl font-black" style={{ color }}>{score}</p>
        <p className="text-slate-400 text-sm mt-1">Overall Score</p>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const color = getRatingHexColor(metric.rating, 10);

  return (
    <div className="bg-slate-mid/50 rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <h4 className="font-bold text-brand-light">
            <div className="relative group inline-block">
              <span className="cursor-help border-b border-dotted border-slate-400">
                {metric.name}
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-slate-dark shadow-lg border border-slate-light/50 rounded-lg text-sm text-slate-300 font-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 pointer-events-none">
                {metric.explanation}
              </div>
            </div>
          </h4>
          <span className="font-mono text-lg font-semibold text-white">{metric.value}</span>
        </div>
        <div className="w-full h-3 mb-2">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ rating: metric.rating }]} layout="vertical" >
              <XAxis type="number" domain={[0, 10]} hide />
              <YAxis type="category" dataKey="name" hide />
              <Bar dataKey="rating" barSize={12} radius={10} background={{ fill: 'rgba(71, 85, 105, 0.5)', radius: 10 }}>
                <Cell fill={color} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-slate-400">{metric.explanation}</p>
      </div>
    </div>
  );
};

const SingleViewRadarChart: React.FC<{ metrics: Metric[] }> = ({ metrics }) => {
  const chartData = metrics.map(metric => ({
    subject: metric.name.replace('Loudness (LUFS)', 'Loudness').replace('Frequency Balance', 'Freq Balance').replace('Clarity & Presence', 'Clarity'),
    rating: metric.rating,
    fullMark: 10,
  }));

  return (
    <div className="w-full h-80 sm:h-96 bg-slate-mid/50 rounded-lg p-4 mb-6">
       <h3 className="text-xl font-bold text-white mb-4 text-center">Metrics Profile</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="rgba(71, 85, 105, 0.8)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0E9FF', fontSize: 13 }} />
          <PolarAngleAxis type="number" domain={[0, 10]} axisLine={false} tick={false} />
          <Radar name="Track Rating" dataKey="rating" stroke="#00A9FF" fill="#00A9FF" fillOpacity={0.6} />
          <Tooltip 
             contentStyle={{ 
               backgroundColor: '#0F172A', 
               borderColor: '#00A9FF',
               borderRadius: '0.5rem'
             }}
             labelStyle={{ color: '#CDF5FD' }}
             itemStyle={{ color: '#00A9FF', fontWeight: 'bold' }}
             formatter={(value) => `${value}/10`}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const SingleView: React.FC<{ item: HistoryItem }> = ({ item }) => {
  const { result, fileName } = item;
  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 bg-navy rounded-xl shadow-2xl border border-slate-light/20">
      <div className="text-center mb-6 border-b border-slate-light/20 pb-6">
        <h2 className="text-2xl font-bold text-white">Analysis for: <span className="text-brand-blue">{fileName}</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1 flex flex-col items-center justify-center bg-slate-mid/50 rounded-lg p-6">
          <ScoreGauge score={result.overallScore} />
        </div>
        <div className="md:col-span-2 flex flex-col justify-center bg-slate-mid/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Verdict</h3>
            <div className={`px-4 py-2 rounded-md text-center border ${getRecommendationClasses(result.recommendation)}`}>
              <p className="text-xl font-bold">{result.recommendation}</p>
            </div>
          <p className="text-slate-400 mt-4">{result.summary}</p>
        </div>
      </div>
      <SingleViewRadarChart metrics={result.metrics} />
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

const CombinedRadarChart: React.FC<{ itemA: HistoryItem, itemB: HistoryItem }> = ({ itemA, itemB }) => {
  const allMetricNames = [...new Set([...itemA.result.metrics.map(m => m.name), ...itemB.result.metrics.map(m => m.name)])];
  
  const chartData = allMetricNames.map(name => {
    const metricA = itemA.result.metrics.find(m => m.name === name);
    const metricB = itemB.result.metrics.find(m => m.name === name);
    return {
      subject: name.replace('Loudness (LUFS)', 'Loudness').replace('Frequency Balance', 'Freq Balance').replace('Clarity & Presence', 'Clarity'),
      ratingA: metricA?.rating || 0,
      ratingB: metricB?.rating || 0,
      fullMark: 10,
    };
  });

  return (
    <div className="w-full h-80 sm:h-96 bg-slate-mid/50 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-bold text-white mb-4 text-center">Metrics Profile Comparison</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="rgba(71, 85, 105, 0.8)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#A0E9FF', fontSize: 13 }} />
          <Radar name={itemA.fileName} dataKey="ratingA" stroke="#00A9FF" fill="#00A9FF" fillOpacity={0.5} />
          <Radar name={itemB.fileName} dataKey="ratingB" stroke="#A0E9FF" fill="#A0E9FF" fillOpacity={0.5} />
          <Tooltip 
             contentStyle={{ 
               backgroundColor: '#0F172A', 
               borderColor: '#475569',
               borderRadius: '0.5rem'
             }}
             labelStyle={{ color: '#CDF5FD' }}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DetailedMetricsTable: React.FC<{ itemA: HistoryItem, itemB: HistoryItem }> = ({ itemA, itemB }) => {
  const allMetricNames = [...new Set([...itemA.result.metrics.map(m => m.name), ...itemB.result.metrics.map(m => m.name)])];

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-white mb-4 text-center">Detailed Comparison</h3>
      <div className="overflow-x-auto bg-slate-mid/50 rounded-lg">
        <table className="w-full text-left table-auto">
          <thead className="border-b-2 border-slate-light/20">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wider text-slate-300">Metric</th>
              <th className="p-3 text-sm font-semibold tracking-wider text-brand-blue">{itemA.fileName}</th>
              <th className="p-3 text-sm font-semibold tracking-wider text-brand-green">{itemB.fileName}</th>
            </tr>
          </thead>
          <tbody>
            {allMetricNames.map(name => {
              const metricA = itemA.result.metrics.find(m => m.name === name);
              const metricB = itemB.result.metrics.find(m => m.name === name);
              const explanation = metricA?.explanation || metricB?.explanation || "No explanation available.";
              return (
                <tr key={name} className="border-b border-slate-light/20 last:border-b-0">
                  <td className="p-3 font-semibold text-brand-light">
                    <div className="relative group inline-block">
                      <span className="cursor-help border-b border-dotted border-slate-400">
                        {name}
                      </span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-slate-dark shadow-lg border border-slate-light/50 rounded-lg text-sm text-slate-300 font-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10 pointer-events-none">
                        {explanation}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{metricA ? `${metricA.value} (${metricA.rating}/10)` : 'N/A'}</td>
                  <td className="p-3">{metricB ? `${metricB.value} (${metricB.rating}/10)` : 'N/A'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComparisonView: React.FC<{ itemA: HistoryItem, itemB: HistoryItem }> = ({ itemA, itemB }) => {
  return (
    <div className="w-full max-w-4xl p-4 sm:p-6 bg-navy rounded-xl shadow-2xl border border-slate-light/20">
      <div className="text-center mb-6 border-b border-slate-light/20 pb-6">
        <h2 className="text-2xl font-bold text-white">Comparison</h2>
        <p className="text-lg text-slate-300 truncate">
          <span className="font-semibold text-brand-blue">{itemA.fileName}</span> vs <span className="font-semibold text-brand-green">{itemB.fileName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-center">
        <div className="flex flex-col bg-slate-mid/50 rounded-lg p-6">
          <ScoreGauge score={itemA.result.overallScore} />
          <div className={`mt-4 px-4 py-2 rounded-md border ${getRecommendationClasses(itemA.result.recommendation)}`}>
            <p className="font-bold">{itemA.result.recommendation}</p>
          </div>
        </div>
        <div className="flex flex-col bg-slate-mid/50 rounded-lg p-6">
          <ScoreGauge score={itemB.result.overallScore} />
          <div className={`mt-4 px-4 py-2 rounded-md border ${getRecommendationClasses(itemB.result.recommendation)}`}>
            <p className="font-bold">{itemB.result.recommendation}</p>
          </div>
        </div>
      </div>

      <CombinedRadarChart itemA={itemA} itemB={itemB} />
      <DetailedMetricsTable itemA={itemA} itemB={itemB} />
    </div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ items }) => {
  if (items.length === 0) return null;

  if (items.length === 1) {
    return <SingleView item={items[0]} />;
  }

  // Ensure a consistent order for comparison
  const sortedItems = [...items].sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime());
  return <ComparisonView itemA={sortedItems[0]} itemB={sortedItems[1]} />;
};

export default AnalysisDisplay;