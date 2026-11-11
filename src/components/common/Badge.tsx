import React from 'react';

export type BadgeVariant = 'sky' | 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' | 'purple' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  sky: 'bg-sky-100/90 text-sky-900 border-sky-300 font-bold',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold',
  blue: 'bg-blue-50 text-blue-800 border-blue-200/80 font-semibold',
  amber: 'bg-amber-50 text-amber-900 border-amber-200/80 font-semibold',
  rose: 'bg-rose-50 text-rose-800 border-rose-200/80 font-semibold',
  slate: 'bg-slate-100 text-slate-800 border-slate-200 font-semibold',
  purple: 'bg-purple-50 text-purple-800 border-purple-200/80 font-semibold',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200 font-semibold',
};

const dotColors: Record<BadgeVariant, string> = {
  sky: 'bg-sky-700',
  emerald: 'bg-emerald-600',
  blue: 'bg-blue-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-600',
  slate: 'bg-slate-600',
  purple: 'bg-purple-600',
  neutral: 'bg-gray-600',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sky',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs font-semibold' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${variantStyles[variant]} ${sizeClasses} whitespace-nowrap ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
