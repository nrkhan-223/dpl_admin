import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  hint,
  children,
  className = '',
}) => {
  const displayHelper = error ? null : (helperText || hint);
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm font-bold text-slate-700 select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      </div>
      {children}
      {error ? (
        <span className="text-sm text-rose-600 font-medium">{error}</span>
      ) : displayHelper ? (
        <span className="text-xs sm:text-sm text-slate-500">{displayHelper}</span>
      ) : null}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-sky-700">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full text-sm sm:text-base text-slate-900 bg-white border rounded-xl px-4 py-2.5 transition-colors placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-700/25 focus:border-sky-700 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed min-h-[44px] ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
              : 'border-slate-200 hover:border-sky-600'
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
