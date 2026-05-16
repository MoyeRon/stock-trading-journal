import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { BookOpen, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';

const TradeReviewPage: React.FC = () => {
  const { tradesWithReviews, fetchTradesWithReviews } = useAppStore();
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'reviewed' | 'unreviewed'>('all');

  useEffect(() => {
    fetchTradesWithReviews();
  }, [fetchTradesWithReviews]);

  const filteredTrades = tradesWithReviews.filter((trade: any) => {
    if (filter === 'reviewed') return trade.hasReview;
    if (filter === 'unreviewed') return !trade.hasReview;
    return true;
  });

  const sortedTrades = [...filteredTrades].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">交易复盘</h2>
        <p className="text-slate-400">回顾每一笔交易，沉淀投资智慧</p>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-2 mb-6 animate-slide-up">
        <Filter className="w-5 h-5 text-slate-400" />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'all' 
                ? 'btn-primary text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'reviewed' 
                ? 'btn-primary text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            已复盘
          </button>
          <button
            onClick={() => setFilter('unreviewed')}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === 'unreviewed' 
                ? 'btn-primary text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            未复盘
          </button>
        </div>
      </div>

      {/* 交易复盘列表 */}
      <div className="space-y-4">
        {sortedTrades.map((trade: any, index) => (
          <div key={trade.id} className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    trade.direction === 'buy' 
                      ? 'bg-gradient-to-br from-success-400/20 to-success-600/20' 
                      : 'bg-gradient-to-br from-danger-400/20 to-danger-600/20'
                  }`}>
                    {trade.direction === 'buy' ? (
                      <ArrowUp className="w-5 h-5 text-success-400" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-danger-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{trade.stockName}</h3>
                      <span className="text-sm text-slate-500">{trade.stockCode}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trade.direction === 'buy' 
                          ? 'bg-success-500/20 text-success-400' 
                          : 'bg-danger-500/20 text-danger-400'
                      }`}>
                        {trade.direction === 'buy' ? '买入' : '卖出'}
                      </span>
                      {trade.hasReview ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">
                          已复盘
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                          待复盘
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{trade.date}</span>
                      <span>{trade.quantity} 股</span>
                      <span>¥{trade.price.toFixed(2)}</span>
                      {trade.profitLoss !== undefined && (
                        <span className={`font-medium ${
                          trade.profitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                        }`}>
                          {trade.profitLoss >= 0 ? '+' : ''}¥{trade.profitLoss.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 复盘内容 */}
                {trade.review && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-primary-400" />
                      <span className="font-medium text-white">复盘内容</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {trade.review.marketReview && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-slate-500 mb-1">市场回顾</p>
                          <p className="text-sm text-slate-300">{trade.review.marketReview}</p>
                        </div>
                      )}
                      {trade.review.operationReview && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-slate-500 mb-1">操作回顾</p>
                          <p className="text-sm text-slate-300">{trade.review.operationReview}</p>
                        </div>
                      )}
                      {trade.review.lessonsLearned && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-slate-500 mb-1">经验教训</p>
                          <p className="text-sm text-slate-300">{trade.review.lessonsLearned}</p>
                        </div>
                      )}
                      {trade.review.improvementPlan && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-xs text-slate-500 mb-1">改进计划</p>
                          <p className="text-sm text-slate-300">{trade.review.improvementPlan}</p>
                        </div>
                      )}
                    </div>

                    {trade.review.tags && trade.review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {trade.review.tags.map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedTrade(trade)}
                className="ml-4 px-4 py-2 btn-primary text-white rounded-xl font-medium"
              >
                {trade.hasReview ? '编辑复盘' : '添加复盘'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedTrades.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-500 opacity-50" />
          <p className="text-lg text-slate-400 mb-2">暂无交易记录</p>
          <p className="text-sm text-slate-500">先在交易记录中添加交易</p>
        </div>
      )}

      {selectedTrade && (
        <ReviewForm
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onSuccess={() => {
            setSelectedTrade(null);
            fetchTradesWithReviews();
          }}
        />
      )}
    </div>
  );
};

export default TradeReviewPage;
