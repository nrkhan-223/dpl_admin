import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBorder?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl font-semibold',
};

// Generates consistent elegant pastel/slate background color based on name
const getInitialsBg = (name: string) => {
  const colors = [
    'bg-slate-700 text-white',
    'bg-emerald-700 text-white',
    'bg-blue-700 text-white',
    'bg-indigo-700 text-white',
    'bg-violet-700 text-white',
    'bg-amber-700 text-white',
    'bg-teal-700 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  showBorder = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const borderClass = showBorder ? 'ring-2 ring-white shadow-sm' : '';
  const normalizedSrc =
    src && typeof src === 'string' && src.startsWith('/src/assets/images/')
      ? src.replace('/src/assets/images/', '/images/')
      : src;

  const hasValidImage = normalizedSrc && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden select-none font-medium ${sizeClasses[size]} ${borderClass} ${className}`}
      title={name}
    >
      {hasValidImage ? (
        <img
          src={normalizedSrc}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center ${getInitialsBg(
            name
          )}`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};
