import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];

const MistakeAnalysis: React.FC = () => {
  const { mistakeAnalysis, fetchMistakeAnalysis, trades } = useAppStore();

  useEffect(() => {
    fetchMistakeAnalysis();
  }, [fetchMistakeAnalysis]);

  const mistakeTrades = trades.filter(t => t.isMistake);

  const chartData = mistakeAnalysis ? Object.entries(mistakeAnalysis.mistakesByType).map(([type, count]) => ({
    name: type,
    value: count
  })) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">交易失误分析</h2>
        <p className="text-slate-400">深入分析失误原因，持续优化投资策略</p>
      </div>

      {mistakeAnalysis && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-danger-400/20 to-danger-600/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-danger-400" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">失误总次数</p>
              <p className="text-2xl font-bold text-danger-400">{mistakeAnalysis.totalMistakes}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold text-white mb-6">失误类型分布</h3>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((_, index) => (
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
                  暂无数据
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <h3 className="text-lg font-semibold text-white mb-6">失误影响分析</h3>
              <div className="space-y-3">
                {Object.entries(mistakeAnalysis.mistakeImpact).map(([type, impact], index) => (
                  <div key={type} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}>
                        <AlertCircle className="w-4 h-4" style={{ color: COLORS[index % COLORS.length] }} />
                      </div>
                      <span className="font-medium text-white">{type}</span>
                    </div>
                    <span className="text-danger-400 font-bold">¥{Math.abs(impact).toFixed(2)}</span>
                  </div>
                ))}
                {Object.keys(mistakeAnalysis.mistakeImpact).length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    暂无数据
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold text-white mb-6">失误交易记录</h3>
            {mistakeTrades.length > 0 ? (
              <div className="space-y-4">
                {mistakeTrades.map((trade, index) => (
                  <div key={trade.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white">{trade.stockName}</span>
                          <span className="text-xs text-slate-500">{trade.stockCode}</span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-danger-500/20 text-danger-400">
                            失误
                          </span>
                        </div>
                        {trade.mistakeType && (
                          <p className="text-sm text-slate-400 mb-1">
                            <span className="text-slate-500">类型：</span>{trade.mistakeType}
                          </p>
                        )}
                        {trade.mistakeDescription && (
                          <p className="text-sm text-slate-500">{trade.mistakeDescription}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">{trade.date}</p>
                        {trade.profitLoss !== undefined && (
                          <p className={`text-lg font-bold ${
                            trade.profitLoss >= 0 ? 'text-success-400' : 'text-danger-400'
                          }`}>
                            {trade.profitLoss >= 0 ? '+' : ''}¥{trade.profitLoss.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">暂无失误交易记录</p>
                <p className="text-sm mt-2">继续保持良好的投资习惯</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MistakeAnalysis;
