export enum RiskLevel {
  SAFE = 'SAFE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  analysis: string;
  recommendations: string[];
}

export interface HistoryEntry extends AnalysisResult {
  id: string;
  date: string; // ISO string
  user: string;
  inputText: string;
}
