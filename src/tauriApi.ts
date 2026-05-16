import { Trade, TradeReview, WatchlistStock, PerformanceStats, MistakeAnalysis } from './types';
import { TencentStockApi, StockQuote } from './stockApi';

// 股票数据缓存
let stockPriceCache: Record<string, { price: number; changePercent: number; timestamp: number }> = {};
const CACHE_DURATION = 30000; // 30秒缓存

// 模拟数据存储
let mockTrades: Trade[] = [
  {
    id: '1',
    stockCode: '600519',
    stockName: '贵州茅台',
    direction: 'buy',
    quantity: 100,
    price: 1800,
    date: '2024-05-10',
    profitLoss: undefined,
    notes: '建仓',
    isMistake: false,
    hasReview: true
  },
  {
    id: '2',
    stockCode: '000001',
    stockName: '平安银行',
    direction: 'buy',
    quantity: 500,
    price: 12.5,
    date: '2024-05-12',
    profitLoss: undefined,
    notes: '建仓',
    isMistake: false,
    hasReview: false
  },
  {
    id: '3',
    stockCode: '000858',
    stockName: '五粮液',
    direction: 'buy',
    quantity: 200,
    price: 145.5,
    date: '2024-05-15',
    profitLoss: undefined,
    notes: '观察后买入',
    isMistake: false,
    hasReview: false
  },
  {
    id: '4',
    stockCode: '601318',
    stockName: '中国平安',
    direction: 'buy',
    quantity: 300,
    price: 48.8,
    date: '2024-05-08',
    profitLoss: -1200,
    notes: '止损卖出',
    isMistake: true,
    mistakeType: '追高',
    mistakeDescription: '没有等待更好的买点',
    hasReview: true
  },
  {
    id: '5',
    stockCode: '601318',
    stockName: '中国平安',
    direction: 'sell',
    quantity: 300,
    price: 44.8,
    date: '2024-05-14',
    profitLoss: -1200,
    notes: '止损卖出',
    isMistake: true,
    mistakeType: '追高',
    mistakeDescription: '没有等待更好的买点',
    hasReview: true
  },
];

let mockReviews: TradeReview[] = [
  {
    id: 'r1',
    tradeId: '1',
    reviewDate: '2024-05-11',
    marketReview: '市场整体向好，白酒板块表现强劲',
    operationReview: '买点选择合理，在回调时介入',
    lessonsLearned: '耐心等待机会是对的，不要追涨',
    improvementPlan: '继续保持耐心，等待更好的买点',
    tags: ['成功', '耐心', '白酒']
  },
  {
    id: 'r2',
    tradeId: '4',
    reviewDate: '2024-05-14',
    marketReview: '当时市场情绪高涨，金融股拉升',
    operationReview: '追高买入，没有遵守交易纪律',
    lessonsLearned: '不要在高位追涨，等待回调',
    improvementPlan: '严格执行交易计划，不要追涨',
    tags: ['失误', '追高', '金融']
  }
];

let mockWatchlist: WatchlistStock[] = [
  {
    id: 'w1',
    stockCode: '601398',
    stockName: '工商银行',
    notes: '低估值银行股，持续关注',
    addedDate: '2024-05-01',
    currentPrice: 5.85,
    changePercent: 1.2
  },
  {
    id: 'w2',
    stockCode: '002594',
    stockName: '比亚迪',
    notes: '新能源龙头，等待机会',
    addedDate: '2024-05-05',
    currentPrice: 228.5,
    changePercent: -2.3
  }
];

// 模拟当前价格（用于持仓计算）
const mockCurrentPrices: Record<string, number> = {
  '600519': 1920.0,
  '000001': 13.2,
  '000858': 158.8,
  '601318': 45.2,
  '601398': 5.85,
  '002594': 228.5
};

// 获取股票实时价格（带缓存）
async function getStockPrices(stockCodes: string[]): Promise<Record<string, { price: number; changePercent: number }>> {
  const now = Date.now();
  const result: Record<string, { price: number; changePercent: number }> = {};
  const codesToFetch: string[] = [];

  // 检查缓存
  stockCodes.forEach(code => {
    const cached = stockPriceCache[code];
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      result[code] = { price: cached.price, changePercent: cached.changePercent };
    } else {
      codesToFetch.push(code);
    }
  });

  // 获取新数据
  if (codesToFetch.length > 0) {
    try {
      const quotes = await TencentStockApi.getStockQuotes(codesToFetch);
      quotes.forEach(quote => {
        stockPriceCache[quote.code] = {
          price: quote.price,
          changePercent: quote.changePercent,
          timestamp: now
        };
        result[quote.code] = {
          price: quote.price,
          changePercent: quote.changePercent
        };
      });
    } catch (error) {
      console.error('获取股票价格失败:', error);
      // 使用备用数据
      codesToFetch.forEach(code => {
        const fallback = mockCurrentPrices[code] || 10.0;
        result[code] = { price: fallback, changePercent: 0 };
      });
    }
  }

  return result;
}

// 计算持仓
async function calculatePortfolio() {
  const positions: Record<string, { stockName: string; quantity: number; avgCost: number; }> = {};
  
  mockTrades.forEach(trade => {
    const key = trade.stockCode;
    if (!positions[key]) {
      positions[key] = {
        stockName: trade.stockName,
        quantity: 0,
        avgCost: 0
      };
    }
    
    const pos = positions[key];
    if (trade.direction === 'buy') {
      const totalCost = pos.quantity * pos.avgCost + trade.quantity * trade.price;
      pos.quantity += trade.quantity;
      pos.avgCost = totalCost / pos.quantity;
    } else {
      pos.quantity -= trade.quantity;
    }
  });
  
  // 获取持仓股票代码
  const holdingCodes = Object.entries(positions)
    .filter(([_, pos]) => pos.quantity > 0)
    .map(([code]) => code);

  // 获取实时价格
  const prices = await getStockPrices(holdingCodes);
  
  // 构建持仓数据
  const portfolio = Object.entries(positions)
    .filter(([_, pos]) => pos.quantity > 0)
    .map(([stockCode, pos]) => {
      const priceData = prices[stockCode] || { price: mockCurrentPrices[stockCode] || pos.avgCost, changePercent: 0 };
      const currentPrice = priceData.price;
      const marketValue = pos.quantity * currentPrice;
      const costValue = pos.quantity * pos.avgCost;
      const profitLoss = marketValue - costValue;
      const profitLossPercent = (profitLoss / costValue) * 100;
      
      return {
        id: stockCode,
        stockCode,
        stockName: pos.stockName,
        quantity: pos.quantity,
        avgCost: pos.avgCost,
        currentPrice,
        changePercent: priceData.changePercent,
        marketValue,
        costValue,
        profitLoss,
        profitLossPercent
      };
    });
  
  return portfolio;
}

// 模拟API
export const tauriApi = {
  // 交易记录相关
  async createTrade(trade: Omit<Trade, 'id'>): Promise<Trade> {
    const newTrade = { ...trade, id: Date.now().toString() };
    mockTrades.push(newTrade);
    return newTrade;
  },

  async getTrades(): Promise<Trade[]> {
    return [...mockTrades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async updateTrade(id: string, trade: Partial<Trade>): Promise<Trade> {
    const index = mockTrades.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTrades[index] = { ...mockTrades[index], ...trade };
      return mockTrades[index];
    }
    throw new Error('Trade not found');
  },

  async deleteTrade(id: string): Promise<void> {
    mockTrades = mockTrades.filter(t => t.id !== id);
    mockReviews = mockReviews.filter(r => r.tradeId !== id);
  },
  
  // 持仓相关
  async getPortfolio() {
    return await calculatePortfolio();
  },

  // 刷新股票数据
  async refreshStockPrices() {
    const holdingCodes = [...new Set(mockTrades.map(t => t.stockCode))];
    const watchlistCodes = mockWatchlist.map(s => s.stockCode);
    const allCodes = [...new Set([...holdingCodes, ...watchlistCodes])];
    
    stockPriceCache = {}; // 清空缓存
    await getStockPrices(allCodes);
  },

  // 交易复盘相关
  async createTradeReview(review: Omit<TradeReview, 'id'>): Promise<TradeReview> {
    const newReview = { ...review, id: Date.now().toString() };
    mockReviews.push(newReview);
    const trade = mockTrades.find(t => t.id === review.tradeId);
    if (trade) {
      trade.hasReview = true;
    }
    return newReview;
  },

  async getTradeReview(tradeId: string): Promise<TradeReview | null> {
    return mockReviews.find(r => r.tradeId === tradeId) || null;
  },

  async getTradesWithReviews(): Promise<Array<Trade & { review?: TradeReview }>> {
    return mockTrades.map(trade => ({
      ...trade,
      review: mockReviews.find(r => r.tradeId === trade.id)
    }));
  },

  async updateTradeReview(id: string, review: Partial<TradeReview>): Promise<TradeReview> {
    const index = mockReviews.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReviews[index] = { ...mockReviews[index], ...review };
      return mockReviews[index];
    }
    throw new Error('Review not found');
  },

  // 观察股票相关
  async addWatchlistStock(stock: Omit<WatchlistStock, 'id'>): Promise<WatchlistStock> {
    const newStock = { ...stock, id: Date.now().toString() };
    mockWatchlist.push(newStock);
    return newStock;
  },

  async getWatchlist(): Promise<WatchlistStock[]> {
    const codes = mockWatchlist.map(s => s.stockCode);
    const prices = await getStockPrices(codes);
    
    return mockWatchlist.map(stock => {
      const priceData = prices[stock.stockCode];
      return {
        ...stock,
        currentPrice: priceData?.price || stock.currentPrice,
        changePercent: priceData?.changePercent || stock.changePercent
      };
    });
  },

  async removeWatchlistStock(id: string): Promise<void> {
    mockWatchlist = mockWatchlist.filter(s => s.id !== id);
  },

  // 统计分析相关
  async getPerformanceStats(startDate?: string, endDate?: string): Promise<PerformanceStats> {
    const completedTrades = mockTrades.filter(t => t.profitLoss !== undefined);
    const winningTrades = completedTrades.filter(t => (t.profitLoss || 0) > 0);
    const totalProfit = completedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    
    return {
      totalTrades: completedTrades.length,
      winRate: completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0,
      totalProfitLoss: totalProfit,
      totalReturn: totalProfit,
      monthlyReturns: { '2024-05': 5.2, '2024-04': 3.8, '2024-03': -1.2 },
      yearlyReturns: { '2024': 8.5 }
    };
  },

  async getMistakeAnalysis(): Promise<MistakeAnalysis> {
    const mistakeTrades = mockTrades.filter(t => t.isMistake);
    const mistakesByType: Record<string, number> = {};
    const mistakeImpact: Record<string, number> = {};

    mistakeTrades.forEach(t => {
      const type = t.mistakeType || '其他';
      mistakesByType[type] = (mistakesByType[type] || 0) + 1;
      mistakeImpact[type] = (mistakeImpact[type] || 0) + Math.abs(t.profitLoss || 0);
    });

    return {
      totalMistakes: mistakeTrades.length,
      mistakesByType,
      mistakeImpact
    };
  }
};
