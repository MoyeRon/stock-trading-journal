export interface Trade {
  id: string;
  stockCode: string;
  stockName: string;
  direction: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string;
  profitLoss?: number;
  notes?: string;
  isMistake?: boolean;
  mistakeType?: string;
  mistakeDescription?: string;
  hasReview?: boolean;
}

export interface TradeReview {
  id: string;
  tradeId: string;
  reviewDate: string;
  marketReview: string;
  operationReview: string;
  lessonsLearned: string;
  improvementPlan: string;
  tags: string[];
}

export interface WatchlistStock {
  id: string;
  stockCode: string;
  stockName: string;
  notes?: string;
  addedDate: string;
  currentPrice?: number;
  changePercent?: number;
}

export interface PerformanceStats {
  totalTrades: number;
  winRate: number;
  totalProfitLoss: number;
  totalReturn: number;
  monthlyReturns: Record<string, number>;
  yearlyReturns: Record<string, number>;
}

export interface MistakeAnalysis {
  totalMistakes: number;
  mistakesByType: Record<string, number>;
  mistakeImpact: Record<string, number>;
}
