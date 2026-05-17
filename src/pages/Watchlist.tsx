import { FC } from 'react';
import { Plus, MoreHorizontal, BookOpen, Target, TrendingUp, TrendingDown } from 'lucide-react';

interface WatchlistProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const mockWatchlist = [
  { id: 1, name: '恒瑞医药', code: '600276', price: 45.20, change: 1.25, changePercent: 2.84, notes: '创新药催化，即将突破年线压制', alertPrice: 46.00 },
  { id: 2, name: '赛力斯', code: '601127', price: 92.45, change: -2.10, changePercent: -2.22, notes: '回踩20日均线，观察企稳信号', alertPrice: 90.00 },
  { id: 3, name: '中际旭创', code: '300308', price: 168.90, change: 8.50, changePercent: 5.30, notes: 'AI算力核心，业绩超预期，沿趋势线持有', alertPrice: 160.00 },
];

// --- 颜色辅助函数 (A股红涨绿跌) ---
const getPnlColor = (val: number) => val >= 0 ? 'text-red-500' : 'text-green-500';
const getPnlBg = (val: number) => val >= 0 ? 'bg-red-500' : 'bg-green-500';

const Watchlist: FC<WatchlistProps> = ({ showToast }) => {
  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">观察池 (自选股)</h1>
          <p className="text-sm text-gray-500 mt-1">关注潜在A股交易机会，设置异动提醒。</p>
        </div>
        <button 
          onClick={() => showToast('打开添加自选股面板...', 'info')}
          className="flex items-center space-x-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow active:scale-95"
        >
          <Plus size={16} />
          <span>添加自选</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockWatchlist.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${getPnlBg(item.change)}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-end space-x-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <span className="text-xs text-gray-400 mb-1">{item.code}</span>
                </div>
                {/* 这里是之前丢失的价格显示区块 */}
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`text-xl font-bold ${getPnlColor(item.change)}`}>¥{item.price.toFixed(2)}</span>
                  <span className={`text-sm font-medium flex items-center ${getPnlColor(item.change)} bg-opacity-10 px-1.5 py-0.5 rounded ${item.change >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                    {item.change >= 0 ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}
                    {item.change >= 0 ? '+' : ''}{item.changePercent}%
                  </span>
                </div>
              </div>
              <button 
                onClick={() => showToast(`操作菜单: ${item.name}`, 'info')}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 active:scale-95 transition-all"
              >
                <MoreHorizontal size={18}/>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4 border border-gray-100 h-16 line-clamp-2">
              <div className="flex items-start space-x-2">
                <BookOpen size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p>{item.notes}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span className="flex items-center"><Target size={14} className="mr-1"/> 提醒价: ¥{item.alertPrice.toFixed(2)}</span>
              <button 
                onClick={() => showToast(`正在编辑 ${item.name} 的观察逻辑...`, 'info')}
                className="text-blue-600 font-medium hover:text-blue-700 hover:underline active:scale-95 px-2 py-1 rounded-md hover:bg-blue-50 transition-all"
              >
                编辑逻辑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;