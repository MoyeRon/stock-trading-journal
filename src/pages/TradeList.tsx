import { FC } from 'react';
import { Search, BookOpen } from 'lucide-react';

interface TradeListProps {
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

const TradeList: FC<TradeListProps> = ({ showToast }) => {
  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">历史交易</h1>
          <p className="text-sm text-gray-500 mt-1">查看、筛选和管理您的A股交易记录。</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="搜索股票代码、拼音缩写..." 
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">日期</th>
                <th className="px-6 py-3 font-medium">股票</th>
                <th className="px-6 py-3 font-medium">操作</th>
                <th className="px-6 py-3 font-medium text-right">买入价</th>
                <th className="px-6 py-3 font-medium text-right">卖出价</th>
                <th className="px-6 py-3 font-medium text-right">数量(股)</th>
                <th className="px-6 py-3 font-medium text-right">净盈亏</th>
                <th className="px-6 py-3 font-medium text-center">复盘</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {mockTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-gray-600">{trade.date}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900 mr-2">{trade.name}</span>
                    <span className="text-xs text-gray-400">{trade.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${trade.type === '买入' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">¥{trade.entry.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">¥{trade.exit.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{trade.shares}</td>
                  <td className="px-6 py-4 text-right">
                    <div className={`font-semibold ${getPnlColor(trade.pnl)}`}>
                      {trade.pnl > 0 ? '+' : ''}{trade.pnl.toLocaleString('zh-CN', {minimumFractionDigits: 2})}
                    </div>
                    <div className={`text-xs ${getPnlColor(trade.pnlPercent)} opacity-80`}>
                      {trade.pnlPercent > 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => showToast(`正在打开 ${trade.name} 的复盘详情...`, 'info')}
                      className="text-gray-400 hover:text-blue-600 transition-all p-1.5 rounded-md hover:bg-blue-50 active:scale-90 opacity-0 group-hover:opacity-100" 
                      title="写复盘"
                    >
                      <BookOpen size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeList;