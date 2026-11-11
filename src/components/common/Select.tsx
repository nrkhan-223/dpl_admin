import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className = '', error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`w-full text-sm sm:text-base text-slate-900 bg-white border rounded-xl px-4 py-2.5 transition-colors focus:outline-hidden focus:ring-2 focus:ring-sky-700/25 focus:border-sky-700 disabled:bg-slate-50 disabled:cursor-not-allowed appearance-none cursor-pointer min-h-[44px] ${
            error
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-slate-200 hover:border-sky-600'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
