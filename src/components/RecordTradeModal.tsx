import { FC } from 'react';
import { X } from 'lucide-react';

interface RecordTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const RecordTradeModal: FC<RecordTradeModalProps> = ({ isOpen, onClose, showToast }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    showToast('交易记录已成功保存！', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* 模糊背景 */}
      <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* 弹窗主体 */}
      <div className="relative bg-white/90 backdrop-blur-xl w-[600px] rounded-2xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white/50">
          <h2 className="text-lg font-semibold text-gray-900">记录新交易</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-md hover:bg-gray-100 active:scale-95">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* 第一行 */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">标的 (代码/名称)</label>
              <input type="text" placeholder="例: 贵州茅台 600519" className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">交易日期</label>
              <input type="date" className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          {/* 第二行 */}
          <div className="grid grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">交易方向</label>
              <select className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-gray-700">
                <option value="buy">买入 (建仓/加仓)</option>
                <option value="sell">卖出 (减仓/清仓)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">成交价格 (¥)</label>
              <input type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">成交数量 (股)</label>
              <input type="number" step="100" placeholder="100的整数倍" className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
            </div>
          </div>

          {/* 第三行 */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">印花税/手续费 (¥)</label>
              <input type="number" step="0.01" placeholder="选填" className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">交易策略/标签</label>
              <input type="text" placeholder="例: 突破做多, 网格交易..." className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
            </div>
          </div>

          {/* 第四行 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">交易逻辑/备注</label>
            <textarea 
              placeholder="记录您当下的交易依据和心理状态..."
              className="w-full h-24 px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none transition-all"
            ></textarea>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200/50 transition-all active:scale-95">
            取消
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow active:scale-95 transition-all">
            保存记录
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordTradeModal;