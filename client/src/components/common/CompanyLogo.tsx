import React from 'react';

interface CompanyLogoProps {
  name: string;
  slug?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  slug,
  className = '',
  size = 'md',
}) => {
  const normalizedKey = (slug || name || '').toLowerCase().trim();

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-11 h-11 rounded-xl text-sm',
    lg: 'w-14 h-14 rounded-2xl text-base',
  };

  const containerClass = `flex items-center justify-center shrink-0 select-none overflow-hidden ${sizeClasses[size]} ${className}`;

  // 1. Google
  if (normalizedKey.includes('google')) {
    const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
    return (
      <div className={`${containerClass} bg-white border border-slate-200/90 shadow-2xs`}>
        <svg className={iconSize} viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      </div>
    );
  }

  // 2. Microsoft
  if (normalizedKey.includes('microsoft')) {
    const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
    return (
      <div className={`${containerClass} bg-white border border-slate-200/90 shadow-2xs`}>
        <svg className={iconSize} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="9.5" height="9.5" rx="0.5" fill="#F25022" />
          <rect x="12.5" y="2" width="9.5" height="9.5" rx="0.5" fill="#7FBA00" />
          <rect x="2" y="12.5" width="9.5" height="9.5" rx="0.5" fill="#00A4EF" />
          <rect x="12.5" y="12.5" width="9.5" height="9.5" rx="0.5" fill="#FFB900" />
        </svg>
      </div>
    );
  }

  // 3. Amazon
  if (normalizedKey.includes('amazon')) {
    const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
    return (
      <div className={`${containerClass} bg-white border border-slate-200/90 shadow-2xs`}>
        <svg className={iconSize} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14.6 15.6C12.4 17.2 9.2 18 6.4 17.2c-.4-.1-.8.2-.5.6 1.6 1.8 4.3 3 7.2 3 3.9 0 7.4-2.1 8.7-5.4.2-.5-.3-.8-.7-.5-1.9 1.2-4.4 1.8-6.5.7z" fill="#FF9900" />
          <path d="M22 15c-.3-.4-1.8-.2-2.7 0-.3.1-.3.3 0 .5.7.5 1.6.9 2.4 1.3.3.1.5-.1.4-.4-.1-.5-.1-1-.1-1.4z" fill="#FF9900" />
          <path d="M13.5 6.2c-3.5 0-5.7 2.4-5.7 5.3 0 2 1.2 3.5 3 3.5 1.3 0 2.2-.7 2.7-1.5v1.2h2.4V6.6c0-1.8-1.2-2.9-3.5-2.9-1.9 0-3.6.9-4 2-.1.3.1.5.4.6l1.6.5c.2.1.5 0 .6-.2.4-.6 1-1 1.8-1 1.1 0 1.7.5 1.7 1.5v.6h-1zm.3 4.4c0 1.4-.7 2.3-1.8 2.3-1 0-1.6-.8-1.6-2 0-1.3.7-2.2 1.8-2.2 1 0 1.6.8 1.6 1.9z" fill="#232F3E" />
        </svg>
      </div>
    );
  }

  // 4. TCS
  if (normalizedKey.includes('tcs') || normalizedKey.includes('tata')) {
    return (
      <div className={`${containerClass} bg-gradient-to-br from-[#003B6F] to-[#005B9E] text-white font-black tracking-wider border border-[#003B6F]/20 shadow-2xs`}>
        <span className={size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'}>TCS</span>
      </div>
    );
  }

  // 5. Infosys
  if (normalizedKey.includes('infosys') || normalizedKey.includes('infy')) {
    return (
      <div className={`${containerClass} bg-gradient-to-br from-[#0066A1] to-[#0087CE] text-white font-black tracking-tight border border-[#0066A1]/20 shadow-2xs`}>
        <span className={size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]'}>INFY</span>
      </div>
    );
  }

  // 6. Deloitte
  if (normalizedKey.includes('deloitte')) {
    return (
      <div className={`${containerClass} bg-[#0A1118] text-white font-black border border-slate-800 shadow-2xs flex items-center justify-center`}>
        <div className="flex items-baseline">
          <span className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}>D</span>
          <span className={`${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full bg-[#86BC25] ml-0.5`} />
        </div>
      </div>
    );
  }

  // 7. Accenture
  if (normalizedKey.includes('accenture')) {
    return (
      <div className={`${containerClass} bg-gradient-to-br from-[#A100FF] to-[#7500C0] text-white font-black border border-purple-900/20 shadow-2xs`}>
        <span className={size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-base' : 'text-xs'}>&gt; acn</span>
      </div>
    );
  }

  // Fallback: Deterministic colorful monogram
  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  return (
    <div className={`${containerClass} bg-gradient-to-br from-blue-500 to-[#102344] text-white font-extrabold border border-blue-600/30 shadow-2xs`}>
      <span className={size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'}>
        {initials}
      </span>
    </div>
  );
};
