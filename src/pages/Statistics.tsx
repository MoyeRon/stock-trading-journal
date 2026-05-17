import { FC } from 'react';

const Statistics: FC = () => {
  // --- 颜色辅助函数 (A股红涨绿跌) ---
  const getPnlBg = (val: number) => val >= 0 ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">盈利统计</h1>
        <p className="text-sm text-gray-500 mt-1">深度分析您的A股交易数据和表现指标。</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Monthly PNL Bar Chart Mock */}
        <div className="col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-6">月度盈亏 (¥)</h3>
          <div className="h-48 flex items-end justify-between space-x-2 px-2">
            {[40, 60, -20, 80, 50, 90, 30, -10, 70, 100, 85, 45].map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-300 ${getPnlBg(val)} opacity-80 group-hover:opacity-100`} 
                  style={{ height: `${Math.abs(val)}%`, minHeight: '4px' }}
                ></div>
                <span className="text-[10px] text-gray-400 mt-2">{i+1}月</span>
              </div>
            ))}
          </div>
        </div>

        {/* Win/Loss Distribution Mock */}
        <div className="col-span-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 mb-6">胜负分布</h3>
          <div className="flex-1 flex items-center justify-center">
            {/* A股红绿配色的饼图 */}
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-inner" style={{ background: 'conic-gradient(#ef4444 0% 65.2%, #22c55e 65.2% 100%)' }}>
              <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900">65.2%</span>
                <span className="text-xs text-gray-500">胜率</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-sm bg-red-500"></div><span className="text-gray-600">盈利笔数</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-sm bg-green-500"></div><span className="text-gray-600">亏损笔数</span></div>
          </div>
        </div>

        {/* Deep Stats */}
        <div className="col-span-3 grid grid-cols-4 gap-4">
          {[
            { label: '平均盈利', val: '+¥1,425.50' },
            { label: '平均亏损', val: '-¥880.20' },
            { label: '最大单笔盈利', val: '+¥6,800.00' },
            { label: '最大单笔亏损', val: '-¥4,500.00' },
          ].map((item, i) => (
             <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className={`font-semibold ${item.val.includes('+') ? 'text-red-500' : 'text-green-500'}`}>{item.val}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;