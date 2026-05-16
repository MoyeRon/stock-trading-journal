import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Trophy, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const Performance: React.FC = () => {
  const { performanceStats, fetchPerformanceStats } = useAppStore();

  useEffect(() => {
    fetchPerformanceStats();
  }, [fetchPerformanceStats]);

  const monthlyData = performanceStats ? Object.entries(performanceStats.monthlyReturns).map(([month, return_]) => ({
    month,
    return: return_,
  })) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">业绩统计</h2>
        <p className="text-slate-400">全方位分析您的投资表现</p>
      </div>

      {performanceStats && (
        <>
          {/* 核心指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">总交易次数</p>
              <p className="text-2xl font-bold text-white">{performanceStats.totalTrades}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-400/20 to-success-600/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-success-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">胜率</p>
              <p className="text-2xl font-bold text-success-400">{performanceStats.winRate.toFixed(1)}%</p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  performanceStats.totalProfitLoss >= 0 
                    ? 'bg-gradient-to-br from-success-400/20 to-success-600/20' 
                    : 'bg-gradient-to-br from-danger-400/20 to-danger-600/20'
                }`}>
                  <DollarSign className={`w-6 h-6 ${
                    performanceStats.totalProfitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                  }`} />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">总盈亏</p>
              <p className={`text-2xl font-bold ${
                performanceStats.totalProfitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
              }`}>
                {performanceStats.totalProfitLoss >= 0 ? '+' : ''}¥{performanceStats.totalProfitLoss.toFixed(2)}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  performanceStats.totalReturn >= 0 
                    ? 'bg-gradient-to-br from-success-400/20 to-success-600/20' 
                    : 'bg-gradient-to-br from-danger-400/20 to-danger-600/20'
                }`}>
                  <Activity className={`w-6 h-6 ${
                    performanceStats.totalReturn >= 0 ? 'text-success-400' : 'text-danger-400'
                  }`} />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">总收益率</p>
              <p className={`text-2xl font-bold ${
                performanceStats.totalReturn >= 0 ? 'text-success-400' : 'text-danger-400'
              }`}>
                {performanceStats.totalReturn >= 0 ? '+' : ''}{performanceStats.totalReturn.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <h3 className="text-lg font-semibold text-white mb-6">月度收益率</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '收益率']}
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar 
                    dataKey="return" 
                    radius={[8, 8, 0, 0]}
                    fill="#22c55e"
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.return >= 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold text-white mb-6">年度收益率</h3>
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>添加更多交易数据后显示</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Performance;
