'use client';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantCls: Record<Variant, string> = {
  primary:
    'bg-accent hover:bg-accent-dark text-white shadow-glow-sm hover:shadow-glow-md',
  ghost:
    'bg-transparent hover:bg-surface-raised text-text-secondary hover:text-text-primary',
  outline:
    'bg-transparent border border-border-active hover:border-accent/50 text-text-secondary hover:text-accent-light',
  danger:
    'bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger',
};

const sizeCls: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-9 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-6 text-base gap-2.5 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-colors duration-150 cursor-pointer',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variantCls[variant],
          sizeCls[size],
          className,
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
