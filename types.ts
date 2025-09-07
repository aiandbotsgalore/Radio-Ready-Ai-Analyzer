
export interface Metric {
  name: string;
  value: string;
  rating: number; // A number from 0-10 for visualization
  explanation: string;
}

export interface AnalysisResult {
  overallScore: number;
  recommendation: 'Recommended for Radio' | 'Needs Work' | 'Not Recommended';
  summary: string;
  metrics: Metric[];
}
