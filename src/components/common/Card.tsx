import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  href?: string;
  as?: 'div' | 'article' | 'section' | 'aside';
  interactive?: boolean;
}

const CardVariants = {
  default: 'rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-250',
  elevated: 'rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-250',
  bordered: 'rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-colors',
};

const PaddingVariants = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-5 sm:p-7',
};

/**
 * Reusable Card Component
 * Provides consistent card styling with variants and padding options
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      className,
      as: Component = 'div',
      interactive = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      CardVariants[variant],
      PaddingVariants[padding],
      interactive && 'cursor-pointer',
      className
    );

    return <Component ref={ref} className={baseStyles} {...props} />;
  }
);

Card.displayName = 'Card';

export { Card };
export type { CardProps };
