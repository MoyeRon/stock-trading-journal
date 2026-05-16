import React, { useEffect, useMemo } from 'react';
import { useAppStore } from '../store';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const TradeAnalysis: React.FC = () => {
  const { trades, fetchTrades } = useAppStore();

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // 计算分析数据
  const analysis = useMemo(() => {
    const completedTrades = trades.filter(t => t.profitLoss !== undefined);
    const winningTrades = completedTrades.filter(t => t.profitLoss! > 0);
    const losingTrades = completedTrades.filter(t => t.profitLoss! <= 0);
    const mistakeTrades = trades.filter(t => t.isMistake);

    const totalProfit = completedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);
    
    // 按月份统计
    const monthlyStats: Record<string, { profit: number, count: number }> = {};
    completedTrades.forEach(trade => {
      const month = trade.date.substring(0, 7);
      if (!monthlyStats[month]) {
        monthlyStats[month] = { profit: 0, count: 0 };
      }
      monthlyStats[month].profit += trade.profitLoss || 0;
      monthlyStats[month].count += 1;
    });

    const monthlyChartData = Object.entries(monthlyStats).map(([month, stats]) => ({
      name: month,
      盈利: stats.profit > 0 ? stats.profit : 0,
      亏损: stats.profit < 0 ? Math.abs(stats.profit) : 0
    })).sort((a, b) => a.name.localeCompare(b.name));

    // 按股票统计
    const stockStats: Record<string, { profit: number, count: number }> = {};
    completedTrades.forEach(trade => {
      const key = trade.stockCode;
      if (!stockStats[key]) {
        stockStats[key] = { profit: 0, count: 0 };
      }
      stockStats[key].profit += trade.profitLoss || 0;
      stockStats[key].count += 1;
    });

    const stockChartData = Object.entries(stockStats).map(([code, stats]) => ({
      name: trades.find(t => t.stockCode === code)?.stockName || code,
      value: Math.abs(stats.profit)
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    // 失误类型统计
    const mistakeTypeStats: Record<string, number> = {};
    mistakeTrades.forEach(trade => {
      const type = trade.mistakeType || '其他';
      mistakeTypeStats[type] = (mistakeTypeStats[type] || 0) + 1;
    });

    const mistakeChartData = Object.entries(mistakeTypeStats).map(([type, count]) => ({
      name: type,
      value: count
    }));

    return {
      totalTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0,
      totalProfit,
      avgProfit: completedTrades.length > 0 ? totalProfit / completedTrades.length : 0,
      bestTrade: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profitLoss || 0)) : 0,
      worstTrade: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.profitLoss || 0)) : 0,
      monthlyChartData,
      stockChartData,
      mistakeChartData,
      mistakeTrades,
      mistakeCount: mistakeTrades.length
    };
  }, [trades]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">交易分析</h2>
        <p className="text-slate-400">全面分析您的交易表现，持续优化策略</p>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">总交易次数</p>
          <p className="text-2xl font-bold text-white">{analysis.totalTrades}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-success-400">盈利 {analysis.winningTrades}</span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-danger-400">亏损 {analysis.losingTrades}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-400/20 to-success-600/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">胜率</p>
          <p className="text-2xl font-bold text-success-400">{analysis.winRate.toFixed(1)}%</p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              analysis.totalProfit >= 0 
                ? 'bg-gradient-to-br from-success-400/20 to-success-600/20' 
                : 'bg-gradient-to-br from-danger-400/20 to-danger-600/20'
            }`}>
              {analysis.totalProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-success-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-danger-400" />
              )}
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">总盈亏</p>
          <p className={`text-2xl font-bold ${
            analysis.totalProfit >= 0 ? 'text-success-400' : 'text-danger-400'
          }`}>
            {analysis.totalProfit >= 0 ? '+' : ''}¥{analysis.totalProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400/20 to-slate-600/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">平均盈亏</p>
          <p className={`text-2xl font-bold ${
            analysis.avgProfit >= 0 ? 'text-success-400' : 'text-danger-400'
          }`}>
            {analysis.avgProfit >= 0 ? '+' : ''}¥{analysis.avgProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 最佳和最差交易 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success-400" />
            最佳交易
          </h3>
          <p className={`text-3xl font-bold text-success-400`}>
            +¥{analysis.bestTrade.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-danger-400" />
            最差交易
          </h3>
          <p className="text-3xl font-bold text-danger-400">
            ¥{analysis.worstTrade.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 月度盈亏 */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <h3 className="text-lg font-semibold text-white mb-6">月度盈亏</h3>
          {analysis.monthlyChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="盈利" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="亏损" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              暂无数据
            </div>
          )}
        </div>

        {/* 个股盈亏分布 */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-white mb-6">个股盈亏分布</h3>
          {analysis.stockChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysis.stockChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analysis.stockChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`¥${value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`, '盈亏']}
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              暂无数据
            </div>
          )}
        </div>
      </div>

      {/* 交易失误分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 失误类型分布 */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.45s' }}>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger-400" />
            失误类型分布
            <span className="ml-2 text-xs text-slate-400">({analysis.mistakeCount} 次)</span>
          </h3>
          {analysis.mistakeChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysis.mistakeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analysis.mistakeChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} 次`, '数量']}
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              暂无失误记录，保持良好交易习惯！
            </div>
          )}
        </div>

        {/* 失误交易列表 */}
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-white mb-6">失误交易记录</h3>
          {analysis.mistakeTrades.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
              {analysis.mistakeTrades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{trade.stockName}</span>
                      <span className="text-xs text-slate-500">{trade.stockCode}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-danger-500/20 text-danger-400">
                        失误
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{trade.date}</span>
                  </div>
                  
                  {trade.mistakeType && (
                    <p className="text-sm text-slate-400 mb-1">
                      <span className="text-slate-500">类型：</span>{trade.mistakeType}
                    </p>
                  )}
                  
                  {trade.mistakeDescription && (
                    <p className="text-sm text-slate-500">{trade.mistakeDescription}</p>
                  )}
                  
                  {trade.profitLoss !== undefined && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs text-slate-400">盈亏</span>
                      <span className={`font-semibold ${
                        trade.profitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                      }`}>
                        {trade.profitLoss >= 0 ? '+' : ''}¥{trade.profitLoss.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {analysis.mistakeTrades.length > 5 && (
                <p className="text-center text-xs text-slate-500 mt-2">
                  还有 {analysis.mistakeTrades.length - 5} 条记录
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">暂无失误交易记录</p>
              <p className="text-sm mt-2">继续保持良好的投资习惯</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeAnalysis;
