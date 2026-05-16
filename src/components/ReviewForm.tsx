import React, { useState, useEffect } from 'react';
import { Trade } from '../types';
import { useAppStore } from '../store';
import { X } from 'lucide-react';
import { tauriApi } from '../tauriApi';

interface ReviewFormProps {
  trade: Trade;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ trade, onClose, onSuccess }) => {
  const { addReview } = useAppStore();
  const [existingReview, setExistingReview] = useState<any>(null);
  const [formData, setFormData] = useState({
    reviewDate: new Date().toISOString().split('T')[0],
    marketReview: '',
    operationReview: '',
    lessonsLearned: '',
    improvementPlan: '',
    tags: '' as string,
  });

  useEffect(() => {
    const loadReview = async () => {
      const review = await tauriApi.getTradeReview(trade.id);
      if (review) {
        setExistingReview(review);
        setFormData({
          reviewDate: review.reviewDate,
          marketReview: review.marketReview,
          operationReview: review.operationReview,
          lessonsLearned: review.lessonsLearned,
          improvementPlan: review.improvementPlan,
          tags: review.tags.join(', '),
        });
      }
    };
    loadReview();
  }, [trade.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewData = {
      tradeId: trade.id,
      reviewDate: formData.reviewDate,
      marketReview: formData.marketReview,
      operationReview: formData.operationReview,
      lessonsLearned: formData.lessonsLearned,
      improvementPlan: formData.improvementPlan,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    await addReview(reviewData);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {existingReview ? '编辑复盘' : '交易复盘'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {trade.stockName} ({trade.stockCode})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              复盘日期
            </label>
            <input
              type="date"
              required
              value={formData.reviewDate}
              onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              市场回顾
            </label>
            <textarea
              value={formData.marketReview}
              onChange={(e) => setFormData({ ...formData, marketReview: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
              rows={3}
              placeholder="描述当时的市场环境和趋势..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              操作回顾
            </label>
            <textarea
              value={formData.operationReview}
              onChange={(e) => setFormData({ ...formData, operationReview: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
              rows={3}
              placeholder="回顾这次交易的操作过程..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              经验教训
            </label>
            <textarea
              value={formData.lessonsLearned}
              onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
              rows={3}
              placeholder="从这次交易中学到了什么..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              改进计划
            </label>
            <textarea
              value={formData.improvementPlan}
              onChange={(e) => setFormData({ ...formData, improvementPlan: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
              rows={3}
              placeholder="未来如何改进交易策略..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              标签（用逗号分隔）
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              placeholder="如：耐心、追高、白酒"
            />
          </div>

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
              {existingReview ? '更新' : '保存'}复盘
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
