import React, { useState } from 'react';
import { Trade } from '../types';
import { useAppStore } from '../store';
import { X } from 'lucide-react';

interface TradeFormProps {
  trade?: Trade;
  onClose: () => void;
  onSuccess: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ trade, onClose, onSuccess }) => {
  const { addTrade, updateTrade } = useAppStore();
  const [formData, setFormData] = useState({
    stockCode: trade?.stockCode || '',
    stockName: trade?.stockName || '',
    direction: trade?.direction || 'buy',
    quantity: trade?.quantity || 0,
    price: trade?.price || 0,
    date: trade?.date || new Date().toISOString().split('T')[0],
    profitLoss: trade?.profitLoss !== undefined ? trade.profitLoss : undefined,
    notes: trade?.notes || '',
    isMistake: trade?.isMistake || false,
    mistakeType: trade?.mistakeType || '',
    mistakeDescription: trade?.mistakeDescription || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tradeData = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      profitLoss: formData.profitLoss !== undefined ? Number(formData.profitLoss) : undefined,
      hasReview: trade?.hasReview || false,
    };

    if (trade) {
      await updateTrade(trade.id, tradeData);
    } else {
      await addTrade(tradeData);
    }
    
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-thin animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {trade ? '编辑交易' : '添加交易'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                交易方向
              </label>
              <select
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: e.target.value as 'buy' | 'sell' })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              >
                <option value="buy" className="bg-slate-800">买入</option>
                <option value="sell" className="bg-slate-800">卖出</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                交易日期
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                数量（股）
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                价格（元）
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              盈亏金额（元）
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.profitLoss !== undefined ? formData.profitLoss : ''}
              onChange={(e) => setFormData({ ...formData, profitLoss: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              placeholder="可选"
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
              rows={2}
              placeholder="添加备注..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isMistake"
              checked={formData.isMistake}
              onChange={(e) => setFormData({ ...formData, isMistake: e.target.checked })}
              className="w-4 h-4 text-primary-500 bg-white/5 border-white/10 focus:ring-primary-500 rounded"
            />
            <label htmlFor="isMistake" className="text-sm font-medium text-slate-300">
              标记为交易失误
            </label>
          </div>

          {formData.isMistake && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  失误类型
                </label>
                <input
                  type="text"
                  value={formData.mistakeType}
                  onChange={(e) => setFormData({ ...formData, mistakeType: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  placeholder="如：追高、不止损等"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  失误描述
                </label>
                <textarea
                  value={formData.mistakeDescription}
                  onChange={(e) => setFormData({ ...formData, mistakeDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                  rows={2}
                  placeholder="描述这次失误..."
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 btn-primary text-white rounded-xl font-medium"
            >
              {trade ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;
