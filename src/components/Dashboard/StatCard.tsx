import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  onClick?: () => void;
  animationDelay?: string;
}

export const StatCard = ({ title, value, icon: Icon, gradient, onClick, animationDelay = '0s' }: StatCardProps) => {
  const isClickable = !!onClick;
  
  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      className={`${gradient} p-6 rounded-2xl shadow-lg text-white text-left transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      } relative overflow-hidden group`}
    >
      <div className="relative z-10">
        <Icon className="h-8 w-8 mb-3 animate-float" style={{ animationDelay }} />
        <div className="text-4xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-90">{title}</div>
        {isClickable && (
          <div className="text-xs mt-2 opacity-75">Click to view →</div>
        )}
      </div>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </button>
  );
};
