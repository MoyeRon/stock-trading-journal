import { FC, useState } from 'react';
import { Calendar, Star, Tag, Plus } from 'lucide-react';

interface TradeReviewProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const mockTrades = [
  { id: 'T-1001', date: '2024-05-10', name: '招商银行', code: '600036', type: '买入', entry: 32.50, exit: 34.20, shares: 2000, pnl: 3400.00, pnlPercent: 5.23 },
  { id: 'T-1002', date: '2024-05-12', name: '隆基绿能', code: '601012', type: '卖出', entry: 21.00, exit: 19.50, shares: 3000, pnl: -4500.00, pnlPercent: -7.14 },
  { id: 'T-1003', date: '2024-05-14', name: '五粮液', code: '000858', type: '买入', entry: 145.20, exit: 152.80, shares: 500, pnl: 3800.00, pnlPercent: 5.23 },
  { id: 'T-1004', date: '2024-05-15', name: '比亚迪', code: '002594', type: '卖出', entry: 220.00, exit: 218.00, shares: 1000, pnl: -2000.00, pnlPercent: -0.91 },
  { id: 'T-1005', date: '2024-05-16', name: '长安汽车', code: '000625', type: '买入', entry: 14.50, exit: 16.20, shares: 4000, pnl: 6800.00, pnlPercent: 11.72 },
];

// --- 颜色辅助函数 (A股红涨绿跌) ---
const getPnlColor = (val: number) => val >= 0 ? 'text-red-500' : 'text-green-500';

const TradeReview: FC<TradeReviewProps> = ({ showToast }) => {
  const [selectedTrade, setSelectedTrade] = useState(mockTrades[0]);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">交易复盘</h1>
        <p className="text-sm text-gray-500 mt-1">记录心理活动，总结A股市场的经验教训。</p>
      </div>

      <div className="flex-1 flex space-x-6 min-h-0">
        {/* Left List */}
        <div className="w-1/3 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-medium text-gray-700">近期需要复盘</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {mockTrades.map(trade => (
              <div 
                key={trade.id} 
                onClick={() => setSelectedTrade(trade)}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedTrade.id === trade.id 
                    ? 'bg-blue-50/50 border-blue-200' 
                    : 'bg-white border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900">{trade.name}</span>
                  <span className={`text-sm font-semibold ${getPnlColor(trade.pnl)}`}>
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{trade.date}</span>
                  <span>{trade.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Editor */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-gray-900">{selectedTrade.name} <span className="text-sm font-normal text-gray-400 ml-1">{selectedTrade.code}</span></h2>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${selectedTrade.type === '买入' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                  {selectedTrade.type}
                </span>
                <span className="text-sm text-gray-500 flex items-center"><Calendar size={14} className="mr-1"/> {selectedTrade.date}</span>
              </div>
            </div>
            <div className="flex space-x-1 text-amber-400">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} className="text-gray-200" />
            </div>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">复盘笔记</label>
              <textarea 
                className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                defaultValue={`大盘探底回升，该股作为板块龙头率先企稳。在重要支撑位附近缩量整理后，跟随板块放量突破，果断买入。`}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>做对了什么？</label>
                <textarea className="w-full h-24 p-3 bg-red-50/30 border border-red-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none" defaultValue="遵守了右侧建仓的纪律，没有盲目抄底。"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>可以改进的地方？</label>
                <textarea className="w-full h-24 p-3 bg-green-50/30 border border-green-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none" defaultValue="大盘情绪尚未完全修复，仓位给的略微偏重，下次应分批建仓。"></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">核心标签</label>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
                  <Tag size={12} className="mr-1" /> 右侧突破
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
                  <Tag size={12} className="mr-1" /> 板块龙头
                </span>
                <button 
                  onClick={() => showToast('请在输入框键入新标签', 'info')}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <Plus size={12} className="mr-1" /> 添加标签
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
             <button 
               onClick={() => showToast('复盘笔记已更新！', 'success')}
               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow active:scale-95"
             >
               保存复盘
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeReview;