import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { TrendingUp, TrendingDown, PieChart, DollarSign, Activity } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Portfolio: React.FC = () => {
  const { portfolio, trades, fetchPortfolio, refreshStockPrices } = useAppStore();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();

    // 每10秒自动刷新
    const interval = setInterval(() => {
      refreshStockPrices();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchPortfolio, refreshStockPrices]);

  const portfolioSummary = useMemo(() => {
    const totalMarketValue = portfolio.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalCost = portfolio.reduce((sum, pos) => sum + pos.costValue, 0);
    const totalProfit = totalMarketValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    
    return {
      totalMarketValue,
      totalCost,
      totalProfit,
      totalProfitPercent
    };
  }, [portfolio]);

  const pieChartData = portfolio.map(pos => ({
    name: pos.stockName,
    value: pos.marketValue
  }));

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">当前持仓</h2>
        <p className="text-slate-400">实时追踪您的投资组合表现</p>
      </div>

      {/* 汇总统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">总市值</p>
          <p className="text-2xl font-bold text-white">
            ¥{portfolioSummary.totalMarketValue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400/20 to-slate-600/20 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-slate-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">总成本</p>
          <p className="text-2xl font-bold text-white">
            ¥{portfolioSummary.totalCost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              portfolioSummary.totalProfit >= 0 
                ? 'bg-gradient-to-br from-success-400/20 to-success-600/20' 
                : 'bg-gradient-to-br from-danger-400/20 to-danger-600/20'
            }`}>
              {portfolioSummary.totalProfit >= 0 ? (
                <TrendingUp className="w-6 h-6 text-success-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-danger-400" />
              )}
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">浮动盈亏</p>
          <p className={`text-2xl font-bold ${
            portfolioSummary.totalProfit >= 0 ? 'text-success-400' : 'text-danger-400'
          }`}>
            {portfolioSummary.totalProfit >= 0 ? '+' : ''}¥{portfolioSummary.totalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              portfolioSummary.totalProfitPercent >= 0 
                ? 'bg-gradient-to-br from-success-400/20 to-success-600/20' 
                : 'bg-gradient-to-br from-danger-400/20 to-danger-600/20'
            }`}>
              <Activity className="w-6 h-6 text-slate-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">收益率</p>
          <p className={`text-2xl font-bold ${
            portfolioSummary.totalProfitPercent >= 0 ? 'text-success-400' : 'text-danger-400'
          }`}>
            {portfolioSummary.totalProfitPercent >= 0 ? '+' : ''}{portfolioSummary.totalProfitPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 持仓占比饼图 */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-lg font-semibold text-white mb-6">持仓占比</h3>
          {portfolio.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`¥${value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`, '市值']}
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              暂无持仓
            </div>
          )}
        </div>

        {/* 持仓列表 */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-white mb-6">持仓明细</h3>
          {portfolio.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
              {portfolio.map((position, index) => (
                <div 
                  key={position.id} 
                  onClick={() => setSelectedStock(position.stockCode)}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                      position.profitLoss >= 0 
                        ? 'bg-gradient-to-br from-success-500/20 to-success-600/20 text-success-400' 
                        : 'bg-gradient-to-br from-danger-500/20 to-danger-600/20 text-danger-400'
                    }`}>
                      {position.stockName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{position.stockName}</p>
                        <p className="text-xs text-slate-500">{position.stockCode}</p>
                      </div>
                      <p className="text-sm text-slate-400">
                        持仓 {position.quantity} 股 · 成本 ¥{position.avgCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <p className="font-semibold text-white">¥{position.currentPrice.toFixed(2)}</p>
                      {position.changePercent !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          position.changePercent >= 0 
                            ? 'bg-success-500/20 text-success-400' 
                            : 'bg-danger-500/20 text-danger-400'
                        }`}>
                          {position.changePercent >= 0 ? '+' : ''}{position.changePercent.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`text-sm font-medium ${
                        position.profitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                      }`}>
                        {position.profitLoss >= 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                      </span>
                      <span className={`text-sm ${
                        position.profitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                      }`}>
                        {position.profitLoss >= 0 ? '+' : ''}¥{position.profitLoss.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      市值 ¥{position.marketValue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              暂无持仓，请先添加交易记录
            </div>
          )}
        </div>
      </div>

      {/* 股票交易记录模态框 */}
      {selectedStock && (
        <StockTransactionModal 
          stockCode={selectedStock}
          trades={trades}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
};

// 股票交易记录模态框组件
const StockTransactionModal = ({ stockCode, trades, onClose }: { stockCode: string, trades: any[], onClose: () => void }) => {
  // 筛选该股票的交易记录，按日期排序
  const stockTrades = trades
    .filter(trade => trade.stockCode === stockCode)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 计算平均成本和当前持仓数量
  let currentQuantity = 0;
  let totalCost = 0;
  
  stockTrades.forEach(trade => {
    if (trade.direction === 'buy') {
      const newTotalQuantity = currentQuantity + trade.quantity;
      const newTotalCost = totalCost + trade.quantity * trade.price;
      currentQuantity = newTotalQuantity;
      totalCost = newTotalCost;
    } else {
      currentQuantity -= trade.quantity;
    }
  });

  const avgCost = currentQuantity > 0 ? totalCost / currentQuantity : 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl max-w-2xl w-full animate-fade-in max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h3 className="text-xl font-semibold text-white">{stockTrades[0]?.stockName || stockCode}</h3>
            <p className="text-sm text-slate-400">{stockCode}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 汇总信息 */}
        <div className="p-4 border-b border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-400 mb-1">当前持仓</p>
              <p className="text-lg font-bold text-white">{currentQuantity} 股</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">平均成本</p>
              <p className="text-lg font-bold text-white">¥{avgCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">交易次数</p>
              <p className="text-lg font-bold text-white">{stockTrades.length}</p>
            </div>
          </div>
        </div>
        
        {/* 交易记录列表 */}
        <div className="p-6 overflow-y-auto flex-1">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">交易历史</h4>
          <div className="space-y-3">
            {stockTrades.map((trade) => (
              <div 
                key={trade.id} 
                className="p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trade.direction === 'buy' 
                        ? 'bg-success-500/20 text-success-400' 
                        : 'bg-danger-500/20 text-danger-400'
                    }`}>
                      {trade.direction === 'buy' ? '买入' : '卖出'}
                    </span>
                    {trade.notes && (
                      <span className="text-xs text-slate-400">{trade.notes}</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{trade.date}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">数量</p>
                    <p className="font-medium text-white">{trade.quantity} 股</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">价格</p>
                    <p className="font-medium text-white">¥{trade.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">金额</p>
                    <p className="font-medium text-white">¥{(trade.quantity * trade.price).toFixed(2)}</p>
                  </div>
                </div>
                
                {trade.profitLoss !== undefined && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">盈亏</span>
                      <span className={`font-semibold ${
                        trade.profitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                      }`}>
                        {trade.profitLoss >= 0 ? '+' : ''}¥{trade.profitLoss.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                
                {trade.isMistake && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-danger-400">交易失误</span>
                      {trade.mistakeType && (
                        <span className="text-xs text-slate-400">({trade.mistakeType})</span>
                      )}
                    </div>
                    {trade.mistakeDescription && (
                      <p className="text-xs text-slate-500">{trade.mistakeDescription}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
