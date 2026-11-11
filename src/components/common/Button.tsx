import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'sky';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-900 focus-visible:ring-sky-700 shadow-sm shadow-sky-900/20 border border-sky-700',
  sky:
    'bg-sky-100/90 text-sky-900 hover:bg-sky-200 active:bg-sky-300 border border-sky-300 focus-visible:ring-sky-700',
  secondary:
    'bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-2xs focus-visible:ring-slate-400',
  outline:
    'bg-transparent text-slate-700 hover:bg-sky-50 hover:text-sky-800 hover:border-sky-600 border border-slate-300 focus-visible:ring-sky-700',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-600 shadow-sm border border-rose-600',
  ghost:
    'bg-transparent text-slate-600 hover:text-sky-800 hover:bg-sky-50 focus-visible:ring-sky-700',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-sm font-semibold gap-1.5 rounded-lg min-h-[38px]',
  md: 'px-4.5 py-2.5 text-sm sm:text-base font-semibold gap-2 rounded-xl min-h-[44px]',
  lg: 'px-5.5 py-3 text-base sm:text-lg font-semibold gap-2.5 rounded-xl min-h-[48px]',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-semibold transition-all cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
