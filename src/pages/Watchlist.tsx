import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Plus, Trash2, Eye, TrendingUp, TrendingDown } from 'lucide-react';

const Watchlist: React.FC = () => {
  const { watchlist, fetchWatchlist, addWatchlistStock, removeWatchlistStock, refreshStockPrices } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    stockCode: '',
    stockName: '',
    notes: '',
  });

  useEffect(() => {
    fetchWatchlist();

    // 每10秒自动刷新
    const interval = setInterval(() => {
      refreshStockPrices();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchWatchlist, refreshStockPrices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addWatchlistStock({
      ...formData,
      addedDate: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
    setFormData({ stockCode: '', stockName: '', notes: '' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">股票观察</h2>
          <p className="text-slate-400">密切关注您感兴趣的股票，等待最佳时机</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 btn-primary text-white px-6 py-3 rounded-xl font-medium"
        >
          <Plus size={20} />
          添加股票
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((stock, index) => (
          <div key={stock.id} className="glass-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{stock.stockName}</h3>
                  <p className="text-sm text-slate-500">{stock.stockCode}</p>
                </div>
              </div>
              <button
                onClick={() => removeWatchlistStock(stock.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-danger-400 hover:bg-danger-500/10 transition-all"
                title="删除"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  ¥{stock.currentPrice?.toFixed(2) || '--'}
                </span>
                {stock.changePercent !== undefined && (
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    stock.changePercent >= 0 ? 'text-success-400' : 'text-danger-400'
                  }`}>
                    {stock.changePercent >= 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
            
            {stock.notes && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-slate-400">{stock.notes}</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-xs text-slate-500">
                添加于：{stock.addedDate}
              </p>
            </div>
          </div>
        ))}
      </div>

      {watchlist.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
          <Eye className="w-12 h-12 mx-auto mb-4 text-slate-500 opacity-50" />
          <p className="text-lg text-slate-400 mb-2">暂无观察股票</p>
          <p className="text-sm text-slate-500 mb-6">添加您感兴趣的股票到观察列表</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 btn-primary text-white px-6 py-3 rounded-xl font-medium"
          >
            <Plus size={20} />
            添加股票
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl max-w-md w-full animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">添加观察股票</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  股票代码
                </label>
                <input
                  type="text"
                  required
                  value={formData.stockCode}
                  onChange={(e) => setFormData({ ...formData, stockCode: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="如：600519"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  股票名称
                </label>
                <input
                  type="text"
                  required
                  value={formData.stockName}
                  onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="如：贵州茅台"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  备注
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                  rows={3}
                  placeholder="添加备注..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 btn-primary text-white rounded-xl font-medium"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
