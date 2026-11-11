import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-sky-200/90 p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {trend && (
            <span
              className={`text-xs sm:text-sm font-bold px-2 py-0.5 rounded-md ${
                trend.isPositive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-xs sm:text-sm text-slate-500 truncate">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};
