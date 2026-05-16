import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Plus, Edit, Trash2, BookOpen, ArrowUp, ArrowDown } from 'lucide-react';
import { Trade } from '../types';
import TradeForm from '../components/TradeForm';
import ReviewForm from '../components/ReviewForm';

const TradeList: React.FC = () => {
  const { trades, fetchTrades, deleteTrade } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [reviewingTrade, setReviewingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条交易记录吗？')) {
      deleteTrade(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">交易记录</h2>
          <p className="text-slate-400">记录您的每一笔交易，追踪投资历程</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 btn-primary text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus size={20} />
          添加交易
        </button>
      </div>

      <div className="space-y-4">
        {trades.map((trade, index) => (
          <div key={trade.id} className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    trade.direction === 'buy' 
                      ? 'bg-gradient-to-br from-success-500/20 to-success-600/20' 
                      : 'bg-gradient-to-br from-danger-500/20 to-danger-600/20'
                  }`}>
                    {trade.direction === 'buy' ? (
                      <ArrowUp className="w-5 h-5 text-success-400" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-danger-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{trade.stockName}</h3>
                      <span className="text-sm text-slate-500">{trade.stockCode}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trade.direction === 'buy' 
                          ? 'bg-success-500/20 text-success-400' 
                          : 'bg-danger-500/20 text-danger-400'
                      }`}>
                        {trade.direction === 'buy' ? '买入' : '卖出'}
                      </span>
                      {trade.isMistake && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                          失误交易
                        </span>
                      )}
                      {trade.hasReview && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">
                          已复盘
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">数量</p>
                    <p className="text-sm font-medium text-white">{trade.quantity} 股</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">价格</p>
                    <p className="text-sm font-medium text-white">¥{trade.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">日期</p>
                    <p className="text-sm font-medium text-white">{trade.date}</p>
                  </div>
                  {trade.profitLoss !== undefined && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">盈亏</p>
                      <p className={`text-sm font-medium ${
                        trade.profitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                      }`}>
                        {trade.profitLoss >= 0 ? '+' : ''}¥{trade.profitLoss.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                
                {trade.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-slate-400">{trade.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingTrade(trade)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  title="编辑"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setReviewingTrade(trade)}
                  className="p-2 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                  title="复盘"
                >
                  <BookOpen size={18} />
                </button>
                <button
                  onClick={() => handleDelete(trade.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-danger-400 hover:bg-danger-500/10 transition-all"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {trades.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
            <p className="text-lg text-slate-400 mb-2">暂无交易记录</p>
            <p className="text-sm text-slate-500 mb-6">开始记录您的第一笔交易吧</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 btn-primary text-white px-6 py-3 rounded-xl font-medium"
            >
              <Plus size={20} />
              添加交易
            </button>
          </div>
        )}
      </div>

      {showAddForm && (
        <TradeForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchTrades();
          }}
        />
      )}

      {editingTrade && (
        <TradeForm
          trade={editingTrade}
          onClose={() => setEditingTrade(null)}
          onSuccess={() => {
            setEditingTrade(null);
            fetchTrades();
          }}
        />
      )}

      {reviewingTrade && (
        <ReviewForm
          trade={reviewingTrade}
          onClose={() => setReviewingTrade(null)}
          onSuccess={() => {
            setReviewingTrade(null);
            fetchTrades();
          }}
        />
      )}
    </div>
  );
};

export default TradeList;
