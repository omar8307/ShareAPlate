import React, { useState } from 'react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackIcon = 'image',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-highest text-primary/70 p-3 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="material-symbols-outlined text-[28px] text-secondary mb-1">
          {fallbackIcon}
        </span>
        {fallbackTitle && (
          <span className="text-[11px] font-semibold text-on-surface-variant line-clamp-2">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
