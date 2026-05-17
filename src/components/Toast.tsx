import { FC } from 'react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const Toast: FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500/90 backdrop-blur-md'
  }[toast.type];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className={`px-5 py-2.5 rounded-full shadow-lg text-sm font-medium text-white flex items-center space-x-2 ${bgColor}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;