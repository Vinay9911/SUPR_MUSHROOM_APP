import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge("animate-pulse rounded-md bg-brand-cream/50 dark:bg-brand-cream/20", className)}
      {...props}
    />
  );
}
