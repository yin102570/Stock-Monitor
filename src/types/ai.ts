export interface AIRecommendation {
  id: string;
  type: 'buy' | 'sell' | 'hold' | 'watch';
  title: string;
  content: string;
  confidence: number;
  targetPrice?: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface AIAnalysisRequest {
  portfolioValue: number;
  totalProfit: number;
  profitPercent: number;
  assetCount: number;
  recentPerformance: number;
}
