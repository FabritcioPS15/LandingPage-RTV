import React from 'react';

type SkeletonProps = {
  className?: string;
  height?: string | number;
  width?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = '1rem',
  width = '100%',
  rounded = 'md',
}) => {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${roundedClass} ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    />
  );
};

type SkeletonTextProps = Omit<SkeletonProps, 'height' | 'width'> & {
  lines?: number;
  lineHeight?: number;
  spacing?: number;
};

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  lineHeight = 1,
  spacing = 8,
  ...props
}) => {
  return (
    <div className="flex flex-col space-y-2" style={{ gap: `${spacing}px` }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 && lines > 1 ? '80%' : '100%'}
          {...props}
        />
      ))}
    </div>
  );
};
