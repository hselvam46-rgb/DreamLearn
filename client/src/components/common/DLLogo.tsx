import React from 'react';
import dlLogoImg from '../../assets/dl_logo.png';

interface DLLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  taglineColor?: string;
  useImage?: boolean;
}

export const DLLogo: React.FC<DLLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-slate-900',
  taglineColor = 'text-slate-500',
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[11px]' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official DL Logo Image */}
      <div className={`${currentSize.icon} shrink-0 relative flex items-center justify-center rounded-xl overflow-hidden shadow-2xs hover:scale-105 transition-transform`}>
        <img
          src={dlLogoImg}
          alt="DreamLearn DL Logo"
          className="w-full h-full object-contain"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Brand Text & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none ${currentSize.text} ${textColor}`}>
            DreamLearn
          </span>
          <span className={`font-black tracking-wider uppercase mt-1 ${currentSize.sub} ${taglineColor}`}>
            LEARN. PRACTICE. GET PLACED.
          </span>
        </div>
      )}
    </div>
  );
};
