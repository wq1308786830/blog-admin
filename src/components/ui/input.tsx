import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

// ============================================
// Types
// ============================================

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Size of the input box */
  size?: 'large' | 'middle' | 'small'
  /** Add prefix node or element */
  prefix?: React.ReactNode
  /** Add suffix node or element */
  suffix?: React.ReactNode
  /** Whether allow to remove input content with clear icon */
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  /** Whether to show character count */
  showCount?:
    | boolean
    | ((info: {
        value: string
        count: number
        maxLength?: number
      }) => React.ReactNode)
  /** Set validation status */
  status?: 'error' | 'warning'
  /** Variants of Input */
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
  /** Character count configuration */
  count?: {
    max?: number
    strategy?: (value: string) => number
    show?: boolean | ((args: { value: string; count: number; maxLength?: number }) => React.ReactNode)
    exceedFormatter?: (value: string, config: { max: number }) => string
  }
  /** Callback when click the clear button */
  onClear?: () => void
  /** The callback function that is triggered when Enter key is pressed */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Size of the textarea box */
  size?: 'large' | 'middle' | 'small'
  /** Height auto size feature */
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  /** Whether to show character count */
  showCount?:
    | boolean
    | ((info: {
        value: string
        count: number
        maxLength?: number
      }) => React.ReactNode)
  /** Set validation status */
  status?: 'error' | 'warning'
  /** Variants of TextArea */
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
}

// ============================================
// Variants
// ============================================

const inputVariants = cva(
  'flex w-full rounded-md transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        large: 'px-4 py-3 text-base',
        middle: 'px-3 py-2 text-sm',
        small: 'px-2 py-1 text-sm',
      },
      variant: {
        outlined:
          'border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        borderless: 'border-0 bg-transparent',
        filled: 'border-0 bg-muted',
        underlined:
          'rounded-none border-x-0 border-t-0 border-b-2 border-input bg-transparent px-0 focus-visible:ring-0 focus-visible:border-b-ring',
      },
      status: {
        error: 'border-destructive focus-visible:ring-destructive',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      },
      withPrefix: {
        true: '',
        false: '',
      },
      withSuffix: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'small',
        className: 'h-8',
      },
      {
        size: 'middle',
        className: 'h-10',
      },
      {
        size: 'large',
        className: 'h-12',
      },
    ],
    defaultVariants: {
      size: 'middle',
      variant: 'outlined',
    },
  }
)

// ============================================
// Internal Components
// ============================================

interface InputWrapperProps {
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  size?: 'large' | 'middle' | 'small'
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
  status?: 'error' | 'warning'
  children: React.ReactNode
  showCount?: React.ReactNode
}

const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  ({ className, prefix, suffix, size, variant, status, children, showCount }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center w-full',
          variant === 'underlined' && 'flex-col',
          className
        )}
      >
        {prefix && (
          <div
            className={cn(
              'flex items-center text-muted-foreground',
              size === 'small' && 'text-sm',
              size === 'middle' && 'text-sm',
              size === 'large' && 'text-base',
              variant !== 'underlined' && 'mr-2'
            )}
          >
            {prefix}
          </div>
        )}
        <div className={cn('relative flex-1', variant === 'underlined' && 'w-full')}>
          {children}
        </div>
        {suffix && (
          <div
            className={cn(
              'flex items-center text-muted-foreground',
              size === 'small' && 'text-sm',
              size === 'middle' && 'text-sm',
              size === 'large' && 'text-base',
              variant !== 'underlined' && 'ml-2'
            )}
          >
            {suffix}
          </div>
        )}
        {showCount && (
          <div
            className={cn(
              'absolute text-xs text-muted-foreground',
              variant === 'underlined' ? '-bottom-5 right-0' : 'right-3',
              size === 'small' && variant !== 'underlined' && 'top-1/2 -translate-y-1/2',
              size === 'middle' && variant !== 'underlined' && 'top-1/2 -translate-y-1/2',
              size === 'large' && variant !== 'underlined' && 'top-1/2 -translate-y-1/2'
            )}
          >
            {showCount}
          </div>
        )}
      </div>
    )
  }
)

InputWrapper.displayName = 'InputWrapper'

// ============================================
// Input Component
// ============================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size = 'middle',
      prefix,
      suffix,
      allowClear = false,
      showCount = false,
      status,
      variant = 'outlined',
      count,
      onClear,
      onPressEnter,
      value: controlledValue,
      defaultValue,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      controlledValue !== undefined ? controlledValue : defaultValue || ''
    )
    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : internalValue
    const inputRef = React.useRef<HTMLInputElement>(null)
    const fusedRef = ref || inputRef

    // Handle clear
    const handleClear = () => {
      if (!isControlled) {
        setInternalValue('')
      }
      onClear?.()
      // Trigger onChange event
      const event = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>
      props.onChange?.(event)
    }

    // Handle value change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value

      // Handle count.max and exceedFormatter
      if (count?.max && count.exceedFormatter) {
        const calculatedCount = count.strategy
          ? count.strategy(newValue)
          : newValue.length
        if (calculatedCount > count.max) {
          newValue = count.exceedFormatter(newValue, { max: count.max })
        }
      }

      if (!isControlled) {
        setInternalValue(newValue)
      }
      props.onChange?.(e)
    }

    // Handle key down
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onPressEnter?.(e)
      }
      props.onKeyDown?.(e)
    }

    // Calculate character count
    const calculateCount = () => {
      if (count?.strategy) {
        return count.strategy(currentValue as string)
      }
      return (currentValue as string).length
    }

    // Render showCount
    const renderShowCount = () => {
      if (!showCount && !count) return null

      const countValue = calculateCount()
      const show = count?.show !== undefined ? count.show : showCount

      if (typeof show === 'function') {
        return show({
          value: currentValue as string,
          count: countValue,
          maxLength: count?.max || maxLength,
        })
      }

      if (show) {
        return (
          <span>
            {countValue}
            {maxLength && ` / ${maxLength}`}
            {count?.max && !maxLength && ` / ${count.max}`}
          </span>
        )
      }

      return null
    }

    // Render clear icon
    const renderClearIcon = () => {
      if (!allowClear) return null
      const shouldShow = controlledValue !== undefined ? !!controlledValue : !!internalValue

      if (!shouldShow) return null

      const clearIcon =
        typeof allowClear === 'object' && allowClear.clearIcon ? (
          allowClear.clearIcon
        ) : (
          <X className="h-4 w-4" />
        )

      return (
        <div
          className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleClear}
          onMouseDown={(e) => e.preventDefault()}
        >
          {clearIcon}
        </div>
      )
    }

    const combinedSuffix = (
      <>
        {renderClearIcon()}
        {suffix}
      </>
    )

    return (
      <InputWrapper
        prefix={prefix}
        suffix={combinedSuffix}
        size={size}
        variant={variant}
        status={status}
        showCount={renderShowCount()}
      >
        <input
          ref={fusedRef}
          type={type}
          value={currentValue}
          maxLength={maxLength}
          className={cn(
            inputVariants({
              size,
              variant,
              status: status || undefined,
              withPrefix: !!prefix,
              withSuffix: !!combinedSuffix,
            }),
            prefix && 'pl-8',
            combinedSuffix && 'pr-8',
            className
          )}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'

// ============================================
// TextArea Component
// ============================================

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      size = 'middle',
      autoSize = false,
      showCount = false,
      status,
      variant = 'outlined',
      value: controlledValue,
      defaultValue,
      maxLength,
      style,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      controlledValue !== undefined ? controlledValue : defaultValue || ''
    )
    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : internalValue
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const fusedRef = ref || textareaRef

    // Auto-resize functionality
    React.useEffect(() => {
      if (!autoSize || !fusedRef || typeof fusedRef === 'function' || !fusedRef.current) {
        return
      }

      const textarea = fusedRef.current
      const autoSizeConfig = typeof autoSize === 'object' ? autoSize : {}

      const calculateHeight = () => {
        textarea.style.height = 'auto'

        let newHeight = textarea.scrollHeight
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)

        if (autoSizeConfig.minRows) {
          const minHeight = lineHeight * autoSizeConfig.minRows
          newHeight = Math.max(newHeight, minHeight)
        }

        if (autoSizeConfig.maxRows) {
          const maxHeight = lineHeight * autoSizeConfig.maxRows
          newHeight = Math.min(newHeight, maxHeight)
        }

        textarea.style.height = `${newHeight}px`
      }

      calculateHeight()

      // Observe value changes
      const observer = new MutationObserver(calculateHeight)
      observer.observe(textarea, { childList: true, subtree: true, characterData: true })

      return () => observer.disconnect()
    }, [autoSize, currentValue, fusedRef])

    // Handle value change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      props.onChange?.(e)
    }

    // Render showCount
    const renderShowCount = () => {
      if (!showCount) return null

      const count = (currentValue as string).length

      if (typeof showCount === 'function') {
        return showCount({
          value: currentValue as string,
          count,
          maxLength,
        })
      }

      return (
        <span>
          {count}
          {maxLength && ` / ${maxLength}`}
        </span>
      )
    }

    return (
      <div className="relative">
        <textarea
          ref={fusedRef}
          value={currentValue}
          maxLength={maxLength}
          className={cn(
            inputVariants({
              size,
              variant,
              status: status || undefined,
            }),
            'min-h-[80px] resize-y',
            className
          )}
          onChange={handleChange}
          style={style}
          {...props}
        />
        {renderShowCount() && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1">
            {renderShowCount()}
          </div>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

// ============================================
// Search Input Component
// ============================================

interface SearchProps extends InputProps {
  /** false displays the default button color, true uses the primary color, or you can provide a custom button */
  enterButton?: React.ReactNode
  /** Search box with loading */
  loading?: boolean
  /** The callback function triggered when you click on the search-icon, the clear-icon or press the Enter key */
  onSearch?: (value: string, event?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent, source?: 'input' | 'clear') => void
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ enterButton = false, loading = false, onSearch, onPressEnter, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const fusedRef = ref || inputRef

    const handleSearch = (
      e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent,
      source: 'input' | 'clear' = 'input'
    ) => {
      const value = inputRef.current?.value || ''
      onSearch?.(value, e, source)
    }

    const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onPressEnter?.(e)
      handleSearch(e, 'input')
    }

    const renderEnterButton = () => {
      if (enterButton === false) return null

      const buttonContent = enterButton === true ? 'Search' : enterButton

      return (
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className={cn(
            'ml-2 px-4 py-2 rounded-md transition-colors',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            buttonContent
          )}
        </button>
      )
    }

    return (
      <div className="flex w-full">
        <Input
          ref={fusedRef}
          onPressEnter={handlePressEnter}
          suffix={
            !enterButton && (
              <div
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => handleSearch(undefined, 'input')}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                )}
              </div>
            )
          }
          {...props}
        />
        {renderEnterButton()}
      </div>
    )
  }
)

Search.displayName = 'Search'

// ============================================
// Password Input Component
// ============================================

interface PasswordProps extends InputProps {
  /** Custom toggle button */
  iconRender?: (visible: boolean) => React.ReactNode
  /** Whether show toggle button or control password visible */
  visibilityToggle?:
    | boolean
    | {
        visible?: boolean
        onVisibleChange?: (visible: boolean) => void
      }
}

const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
  ({ iconRender, visibilityToggle = true, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const isControlled = typeof visibilityToggle === 'object' && visibilityToggle.visible !== undefined
    const currentVisible = isControlled ? visibilityToggle.visible! : visible

    const toggleVisibility = () => {
      const newVisible = !currentVisible
      if (!isControlled) {
        setVisible(newVisible)
      }
      if (typeof visibilityToggle === 'object' && visibilityToggle.onVisibleChange) {
        visibilityToggle.onVisibleChange(newVisible)
      }
    }

    const renderIcon = () => {
      if (iconRender) {
        return iconRender(currentVisible)
      }

      return currentVisible ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      )
    }

    const toggleButton = visibilityToggle ? (
      <div
        className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        onClick={toggleVisibility}
      >
        {renderIcon()}
      </div>
    ) : null

    return <Input ref={ref} type={currentVisible ? 'text' : 'password'} suffix={toggleButton} {...props} />
  }
)

Password.displayName = 'Password'

// ============================================
// OTP Input Component
// ============================================

interface OTPProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'> {
  /** The number of input elements */
  length?: number
  /** Default value */
  defaultValue?: string
  /** The input content value */
  value?: string
  /** Whether the input is disabled */
  disabled?: boolean
  /** Format display, blank fields will be filled with */
  formatter?: (value: string) => string
  /** Render the separator after the input box of the specified index */
  separator?: React.ReactNode | ((index: number) => React.ReactNode)
  /** Custom display, the original value will not be modified */
  mask?: boolean | string
  /** Set validation status */
  status?: 'error' | 'warning'
  /** Variants of Input */
  variant?: 'outlined' | 'borderless' | 'filled' | 'underlined'
  /** Size of the input box */
  size?: 'large' | 'middle' | 'small'
  /** Trigger when all the fields are filled */
  onChange?: (value: string) => void
  /** Trigger when the input value changes */
  onInput?: (value: string[]) => void
}

const OTP = React.forwardRef<HTMLDivElement, OTPProps>(
  (
    {
      length = 6,
      defaultValue,
      value,
      disabled = false,
      formatter,
      separator,
      mask = false,
      status,
      variant = 'outlined',
      size = 'middle',
      onChange,
      onInput,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    // Split value into array
    const values = currentValue.split('').concat(Array(length).fill(''))

    // Handle input change
    const handleChange = (index: number, inputValue: string) => {
      let newValues = [...values.slice(0, length)]

      // Handle paste
      if (inputValue.length > 1) {
        newValues = inputValue.split('').slice(0, length)
      } else {
        newValues[index] = inputValue
      }

      // Trigger onInput
      onInput?.(newValues)

      const newValue = newValues.join('')

      if (!isControlled) {
        setInternalValue(newValue)
      }

      // Trigger onChange when all fields are filled
      if (newValues.filter((v) => v).length === length) {
        onChange?.(newValue)
      }

      // Auto focus next input
      if (inputValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    // Handle key down
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    // Render separator
    const renderSeparator = (index: number) => {
      if (!separator) return null

      const separatorContent = typeof separator === 'function' ? separator(index) : separator

      if (separatorContent) {
        return <div className="flex items-center justify-center px-1">{separatorContent}</div>
      }

      return null
    }

    // Get display value
    const getDisplayValue = (val: string) => {
      if (!val) return ''
      if (mask) {
        return typeof mask === 'string' ? mask : '•'
      }
      return formatter ? formatter(val) : val
    }

    const sizeClasses = {
      small: 'w-8 h-8 text-sm',
      middle: 'w-10 h-10 text-base',
      large: 'w-12 h-12 text-lg',
    }

    return (
      <div ref={ref} className={cn('inline-flex items-center', className)} {...props}>
        {Array.from({ length }).map((_, index) => (
          <React.Fragment key={index}>
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={getDisplayValue(values[index] || '')}
              disabled={disabled}
              className={cn(
                inputVariants({
                  size,
                  variant,
                  status: focusedIndex === index ? status : undefined,
                }),
                sizeClasses[size],
                'text-center focus:z-10',
                focusedIndex === index && 'ring-2 ring-ring ring-offset-2'
              )}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
            />
            {renderSeparator(index)}
          </React.Fragment>
        ))}
      </div>
    )
  }
)

OTP.displayName = 'OTP'

// ============================================
// Exports
// ============================================

export { Input, TextArea, Search, Password, OTP }
export type { SearchProps, PasswordProps, OTPProps }
