import { FC } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

interface DashboardProps {
  onOpenModal: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

// --- A股 Mock Data ---
const mockPositions = [
  { id: 'P-1', name: '贵州茅台', code: '600519', shares: 200, cost: 1620.50, price: 1685.00, pnl: 12900.00, pnlPercent: 3.98 },
  { id: 'P-2', name: '宁德时代', code: '300750', shares: 1000, cost: 195.20, price: 188.50, pnl: -6700.00, pnlPercent: -3.43 },
  { id: 'P-3', name: '东方财富', code: '300059', shares: 5000, cost: 14.80, price: 15.65, pnl: 4250.00, pnlPercent: 5.74 },
];

// --- 颜色辅助函数 (A股红涨绿跌) ---
const getPnlColor = (val: number) => val >= 0 ? 'text-red-500' : 'text-green-500';

const Dashboard: FC<DashboardProps> = ({ onOpenModal, showToast }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">概览</h1>
          <p className="text-sm text-gray-500 mt-1">欢迎回来，这是您的A股账户表现摘要。</p>
        </div>
        <button onClick={onOpenModal} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 hover:shadow-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95">
          <Plus size={16} />
          <span>记录新交易</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '总净利润 (¥)', value: '+14,850.00', trend: '+12.5%', isPositive: true },
          { label: '胜率 (本月)', value: '65.2%', trend: '+2.4%', isPositive: true },
          { label: '盈亏比', value: '2.8 : 1', trend: '-0.1', isPositive: false },
          { label: '仓位使用率', value: '75.4%', trend: '偏高', isPositive: false, neutral: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className={`text-2xl font-semibold ${stat.value.includes('+') ? 'text-red-600' : 'text-gray-900'}`}>{stat.value}</span>
            </div>
            <div className={`mt-2 flex items-center text-xs font-medium ${stat.neutral ? 'text-gray-500' : stat.isPositive ? 'text-red-500' : 'text-green-500'}`}>
              {stat.neutral ? null : stat.isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {stat.trend} 比上月
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split: 持仓 & 曲线 */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* 当前持仓 (占据左侧2列) */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Briefcase size={18} className="text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">当前持仓</h3>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">持仓市值: ¥408,075.00</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">股票名称</th>
                  <th className="px-5 py-3 font-medium text-right">持股数</th>
                  <th className="px-5 py-3 font-medium text-right">成本价</th>
                  <th className="px-5 py-3 font-medium text-right">现价</th>
                  <th className="px-5 py-3 font-medium text-right">浮动盈亏</th>
                  <th className="px-5 py-3 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {mockPositions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900">{pos.name}</div>
                      <div className="text-xs text-gray-400">{pos.code}</div>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-gray-700">{pos.shares}</td>
                    <td className="px-5 py-3 text-right text-gray-600">¥{pos.cost.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-800">¥{pos.price.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className={`font-semibold ${getPnlColor(pos.pnl)}`}>
                        {pos.pnl > 0 ? '+' : ''}{pos.pnl.toLocaleString('zh-CN', {minimumFractionDigits: 2})}
                      </div>
                      <div className={`text-xs opacity-90 ${getPnlColor(pos.pnlPercent)}`}>
                        {pos.pnlPercent > 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button 
                        onClick={() => showToast(`准备操作: ${pos.name}`, 'info')}
                        className="text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white border border-transparent hover:border-blue-600 hover:shadow-sm text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 active:scale-95 opacity-0 group-hover:opacity-100"
                      >
                        平仓/减仓
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 资产曲线 (占据右侧1列) */}
        <div className="col-span-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-gray-900">资产曲线</h3>
            <select className="bg-gray-50 border border-gray-200 text-xs rounded-md px-2 py-1 text-gray-600 focus:outline-none">
              <option>近30天</option>
              <option>近3个月</option>
            </select>
          </div>
          <div className="flex-1 w-full relative min-h-[200px]">
            {/* Decorative SVG Line Chart for Assets */}
            <svg viewBox="0 0 400 200" className="w-full h-full preserve-3d">
              <defs>
                <linearGradient id="gradientAsset" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 160 Q 50 170, 100 130 T 200 140 T 300 70 T 400 40" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <path d="M0 160 Q 50 170, 100 130 T 200 140 T 300 70 T 400 40 L 400 200 L 0 200 Z" fill="url(#gradientAsset)" />
              {/* Grid lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;