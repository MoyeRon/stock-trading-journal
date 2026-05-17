import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98]
      ${isActive 
        ? 'bg-blue-500/10 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
      }`}
  >
    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
    <span>{label}</span>
  </button>
);

export default SidebarItem;