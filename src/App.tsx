import { useState } from 'react';
import { 
  LayoutDashboard, 
  List, 
  PieChart, 
  BookOpen, 
  Eye 
} from 'lucide-react';
import SidebarItem from './components/SidebarItem';
import Toast from './components/Toast';
import RecordTradeModal from './components/RecordTradeModal';
import Dashboard from './pages/Dashboard';
import TradeList from './pages/TradeList';
import Statistics from './pages/Statistics';
import TradeReview from './pages/TradeReview';
import Watchlist from './pages/Watchlist';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500); // 2.5秒后自动消失
  };

  const tabs = [
    { id: 'dashboard', label: '概览', icon: LayoutDashboard, component: Dashboard },
    { id: 'trades', label: '历史交易', icon: List, component: TradeList },
    { id: 'stats', label: '盈利统计', icon: PieChart, component: Statistics },
    { id: 'review', label: '交易复盘', icon: BookOpen, component: TradeReview },
    { id: 'watchlist', label: '观察池', icon: Eye, component: Watchlist },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Dashboard;

  return (
    <div className="flex h-screen w-full bg-[#f5f5f7] font-sans overflow-hidden text-gray-800">
      
      {/* --- 左侧边栏 --- */}
      <aside className="w-56 lg:w-64 bg-[#f2f2f3]/80 backdrop-blur-xl border-r border-gray-200/80 flex flex-col select-none relative z-10">
        
        {/* User Profile */}
        <div className="px-5 py-6 mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-sm">
              A
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">投资日记</div>
              <div className="text-xs text-gray-500">A股实盘记录</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">主菜单</div>
          {tabs.map((tab) => (
            <SidebarItem
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50">
          <button 
            onClick={() => showToast('打开系统设置...', 'info')}
            className="w-full flex items-center justify-center space-x-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 rounded-lg transition-all py-2 active:scale-95"
          >
            <span>设置 & 偏好</span>
          </button>
        </div>
      </aside>

      {/* --- 右侧主内容区 --- */}
      <main className="flex-1 relative bg-white/60 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-0">
        <div className="absolute top-0 left-0 w-full h-12 bg-transparent pointer-events-none drag-area"></div> {/* Mac 顶部拖拽区 */}
        
        <div className="flex-1 p-8 overflow-y-auto mt-4">
          <ActiveComponent onOpenModal={() => setIsTradeModalOpen(true)} showToast={showToast} />
        </div>
      </main>

      {/* --- 记录交易弹窗 --- */}
      <RecordTradeModal isOpen={isTradeModalOpen} onClose={() => setIsTradeModalOpen(false)} showToast={showToast} />

      {/* --- 全局 Toast 提示 --- */}
      <Toast toast={toast} />
    </div>
  );
}

export default App;
