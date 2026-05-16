import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart3, Eye, BookOpen, List, PieChart } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: List, label: '交易记录' },
    { path: '/portfolio', icon: PieChart, label: '当前持仓' },
    { path: '/performance', icon: TrendingUp, label: '业绩统计' },
    { path: '/analysis', icon: BarChart3, label: '交易分析' },
    { path: '/watchlist', icon: Eye, label: '股票观察' },
    { path: '/review', icon: BookOpen, label: '交易复盘' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">投资交易日记</h1>
              <p className="text-sm text-slate-400">A股专属</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap animate-slide-up ${
                  isActive 
                    ? 'btn-primary text-white shadow-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
