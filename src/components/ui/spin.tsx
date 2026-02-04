import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

export interface SpinProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of spinner */
  size?: 'small' | 'default' | 'large';
  /** Whether Spin is in loading state */
  spinning?: boolean;
  /** React Node, the content element you want to show when loading */
  children?: React.ReactNode;
  /** Custom loading indicator */
  indicator?: React.ReactNode;
  /** Description text when loading */
  tip?: string;
  /** Delay (milliseconds) for showing loading state */
  delay?: number;
  /** ClassName of wrapper when Spin has children */
  wrapperClassName?: string;
  /** Style of wrapper when Spin has children */
  wrapperStyle?: React.CSSProperties;
}

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: 'small' | 'default' | 'large';
}

// ============================================
// Variants
// ============================================

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-solid border-current border-t-transparent',
  {
    variants: {
      size: {
        small: 'h-4 w-4 border-2',
        default: 'h-5 w-5 border-2',
        large: 'h-8 w-8 border-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// ============================================
// Components
// ============================================

/**
 * Spinner - Internal component for the spinning icon
 */
const Spinner = ({ className, size, ...props }: SpinnerProps) => {
  return (
    <span
      className={cn(spinnerVariants({ size }), className)}
      role="img"
      aria-label="loading"
      {...props}
    />
  );
};

/**
 * Spin - Loading indicator component
 *
 * A spinner can be used as a standalone loading indicator or wrap content to show loading state.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Spin />
 *
 * // With tip
 * <Spin tip="Loading..." />
 *
 * // With size
 * <Spin size="large" />
 *
 * // Wrap content
 * <Spin spinning={isLoading}>
 *   <div>Your content here</div>
 * </Spin>
 *
 * // Custom indicator
 * <Spin indicator={<CustomSpinner />} />
 *
 * // With delay
 * <Spin delay={500} />
 * ```
 */
const Spin = React.forwardRef<HTMLDivElement, SpinProps>(
  (
    {
      className,
      size = 'default',
      spinning = true,
      children,
      indicator,
      tip,
      delay = 0,
      wrapperClassName,
      wrapperStyle,
      style,
      ...props
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [showLoading, setShowLoading] = React.useState(spinning && delay === 0);

    // Handle delay
    React.useEffect(() => {
      if (!spinning) {
        setShowLoading(false);
        return;
      }

      if (delay === 0) {
        setShowLoading(true);
        return;
      }

      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);

      return () => clearTimeout(timer);
    }, [spinning, delay]);

    // Render standalone spinner
    if (!children) {
      if (!showLoading) return null;

      return (
        <div
          ref={ref}
          className={cn('flex flex-col items-center gap-2', className)}
          style={style}
          {...props}
        >
          {indicator}
          {!indicator && <Spinner size={size} />}
          {tip && <p className="text-sm text-muted-foreground">{tip}</p>}
        </div>
      );
    }

    // Render wrapped content
    return (
      <div ref={ref} className={cn('relative', wrapperClassName)} style={wrapperStyle}>
        {showLoading && (
          <div
            className={cn(
              'absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50',
              className
            )}
            style={style}
            {...props}
          >
            {indicator || <Spinner size={size} />}
            {tip && <p className="text-sm text-muted-foreground">{tip}</p>}
          </div>
        )}
        <div className={cn('transition-opacity', showLoading && 'opacity-30 pointer-events-none')}>
          {children}
        </div>
      </div>
    );
  }
);

Spin.displayName = 'Spin';

export { Spin, Spinner, spinnerVariants };
