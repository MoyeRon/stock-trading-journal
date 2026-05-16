import { create } from 'zustand';
import { Trade, TradeReview, WatchlistStock, PerformanceStats, MistakeAnalysis } from './types';
import { tauriApi } from './tauriApi';

interface AppState {
  trades: Trade[];
  portfolio: any[];
  watchlist: WatchlistStock[];
  performanceStats: PerformanceStats | null;
  mistakeAnalysis: MistakeAnalysis | null;
  tradesWithReviews: Array<Trade & { review?: TradeReview }>;
  isLoading: boolean;

  fetchTrades: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  fetchWatchlist: () => Promise<void>;
  fetchPerformanceStats: () => Promise<void>;
  fetchMistakeAnalysis: () => Promise<void>;
  fetchTradesWithReviews: () => Promise<void>;

  addTrade: (trade: Omit<Trade, 'id'>) => Promise<void>;
  updateTrade: (id: string, trade: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;

  addReview: (review: Omit<TradeReview, 'id'>) => Promise<void>;
  updateReview: (id: string, review: Partial<TradeReview>) => Promise<void>;

  addWatchlistStock: (stock: Omit<WatchlistStock, 'id'>) => Promise<void>;
  removeWatchlistStock: (id: string) => Promise<void>;
  refreshStockPrices: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  trades: [],
  portfolio: [],
  watchlist: [],
  performanceStats: null,
  mistakeAnalysis: null,
  tradesWithReviews: [],
  isLoading: false,

  fetchTrades: async () => {
    set({ isLoading: true });
    const trades = await tauriApi.getTrades();
    set({ trades, isLoading: false });
  },

  fetchPortfolio: async () => {
    set({ isLoading: true });
    const portfolio = await tauriApi.getPortfolio();
    set({ portfolio, isLoading: false });
  },

  fetchWatchlist: async () => {
    set({ isLoading: true });
    const watchlist = await tauriApi.getWatchlist();
    set({ watchlist, isLoading: false });
  },

  fetchPerformanceStats: async () => {
    set({ isLoading: true });
    const stats = await tauriApi.getPerformanceStats();
    set({ performanceStats: stats, isLoading: false });
  },

  fetchMistakeAnalysis: async () => {
    set({ isLoading: true });
    const analysis = await tauriApi.getMistakeAnalysis();
    set({ mistakeAnalysis: analysis, isLoading: false });
  },

  fetchTradesWithReviews: async () => {
    set({ isLoading: true });
    const trades = await tauriApi.getTradesWithReviews();
    set({ tradesWithReviews: trades, isLoading: false });
  },

  addTrade: async (trade) => {
    await tauriApi.createTrade(trade);
    await get().fetchTrades();
    await get().fetchPortfolio();
  },

  updateTrade: async (id, trade) => {
    await tauriApi.updateTrade(id, trade);
    await get().fetchTrades();
    await get().fetchPortfolio();
  },

  deleteTrade: async (id) => {
    await tauriApi.deleteTrade(id);
    await get().fetchTrades();
    await get().fetchPortfolio();
    await get().fetchTradesWithReviews();
  },

  addReview: async (review) => {
    await tauriApi.createTradeReview(review);
    await get().fetchTradesWithReviews();
    await get().fetchTrades();
  },

  updateReview: async (id, review) => {
    await tauriApi.updateTradeReview(id, review);
    await get().fetchTradesWithReviews();
  },

  addWatchlistStock: async (stock) => {
    await tauriApi.addWatchlistStock(stock);
    await get().fetchWatchlist();
  },

  removeWatchlistStock: async (id) => {
    await tauriApi.removeWatchlistStock(id);
    await get().fetchWatchlist();
  },

  refreshStockPrices: async () => {
    await tauriApi.refreshStockPrices();
    await Promise.all([
      get().fetchPortfolio(),
      get().fetchWatchlist()
    ]);
  }
}));
