import * as React from "react"
import { format, isValid, parse, setHours, setMinutes, setSeconds } from "date-fns"
import { Clock, X, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

// ==================== Types ====================

export type TimePickerSize = "small" | "middle" | "large"
export type TimePickerStatus = "error" | "warning"
export type TimePickerVariant = "outlined" | "filled" | "borderless"
export type TimePickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight"

export interface DisabledTime {
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}

export interface TimePickerProps {
  /** The selected time */
  value?: Date
  /** Default time value */
  defaultValue?: Date
  /** Callback when time is selected */
  onChange?: (time: Date | undefined, timeString: string) => void
  /** Callback when input loses focus */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  /** Callback when input gains focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  /** Callback when popup visibility changes */
  onOpenChange?: (open: boolean) => void
  /** Placeholder text */
  placeholder?: string
  /** Custom class name */
  className?: string
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Format string (HH:mm:ss) */
  format?: string
  /** Whether to show clear button */
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  /** Size of the picker */
  size?: TimePickerSize
  /** Status of the picker */
  status?: TimePickerStatus
  /** Variant style */
  variant?: TimePickerVariant
  /** Popover placement */
  placement?: TimePickerPlacement
  /** Whether the popup is visible (controlled) */
  open?: boolean
  /** Custom suffix icon */
  suffixIcon?: React.ReactNode
  /** Whether to show 12-hour format */
  use12Hours?: boolean
  /** Hour step */
  hourStep?: number
  /** Minute step */
  minuteStep?: number
  /** Second step */
  secondStep?: number
  /** Whether to show hour column */
  showHour?: boolean
  /** Whether to show minute column */
  showMinute?: boolean
  /** Whether to show second column */
  showSecond?: boolean
  /** Show "Now" button */
  showNow?: boolean
  /** Disabled time */
  disabledTime?: () => DisabledTime
  /** Hide disabled options */
  hideDisabledOptions?: boolean
  /** Whether the input is read-only */
  inputReadOnly?: boolean
  /** Whether the picker is read-only */
  readOnly?: boolean
  /** ID of the input */
  id?: string
  /** Name attribute */
  name?: string
  /** Whether to enable bordered style */
  bordered?: boolean
  /** Auto focus */
  autoFocus?: boolean
  /** Render extra footer */
  renderExtraFooter?: () => React.ReactNode
  /** Need confirm button */
  needConfirm?: boolean
  /** Default open value for time picker */
  defaultOpenValue?: Date
  /** Cell render for time columns */
  cellRender?: (
    current: number,
    info: {
      originNode: React.ReactNode
      today: Date
      subType: "hour" | "minute" | "second" | "meridiem"
    }
  ) => React.ReactNode
}

// ==================== Helper Functions ====================

const getSizeClasses = (size: TimePickerSize): string => {
  switch (size) {
    case "small":
      return "h-7 text-xs px-2"
    case "large":
      return "h-11 text-base px-4"
    case "middle":
    default:
      return "h-9 text-sm px-3"
  }
}

const getVariantClasses = (variant: TimePickerVariant, status?: TimePickerStatus): string => {
  const statusClasses =
    status === "error"
      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
      : status === "warning"
      ? "border-yellow-500 focus-within:border-yellow-500 focus-within:ring-yellow-500/20"
      : ""

  switch (variant) {
    case "filled":
      return cn("bg-muted border-transparent hover:bg-muted/80", statusClasses)
    case "borderless":
      return cn("border-transparent shadow-none hover:bg-accent", statusClasses)
    case "outlined":
    default:
      return cn("border-input", statusClasses)
  }
}

const generateTimeOptions = (
  count: number,
  step: number = 1,
  disabledValues: number[] = [],
  hideDisabled: boolean = false
): number[] => {
  const options: number[] = []
  for (let i = 0; i < count; i += step) {
    if (hideDisabled && disabledValues.includes(i)) continue
    options.push(i)
  }
  return options
}

// ==================== Time Column Component ====================

interface TimeColumnProps {
  type: "hour" | "minute" | "second" | "meridiem"
  options: (number | string)[]
  value: number | string
  onSelect: (value: number | string) => void
  disabledValues?: (number | string)[]
  cellRender?: TimePickerProps["cellRender"]
  today: Date
}

const TimeColumn: React.FC<TimeColumnProps> = ({
  type,
  options,
  value,
  onSelect,
  disabledValues = [],
  cellRender,
  today,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const selectedRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current
      const selected = selectedRef.current
      const containerRect = container.getBoundingClientRect()
      const selectedRect = selected.getBoundingClientRect()
      
      container.scrollTop = selected.offsetTop - containerRect.height / 2 + selectedRect.height / 2
    }
  }, [value])

  return (
    <ScrollArea className="h-[224px] w-14">
      <div ref={scrollRef} className="py-2">
        {options.map((option) => {
          const isSelected = option === value
          const isDisabled = disabledValues.includes(option)
          const displayValue =
            typeof option === "number" ? String(option).padStart(2, "0") : option

          const originNode = (
            <Button
              ref={isSelected ? selectedRef : undefined}
              key={option}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              disabled={isDisabled}
              className={cn(
                "w-full h-7 px-1 font-normal text-xs justify-center",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isDisabled && onSelect(option)}
            >
              {displayValue}
            </Button>
          )

          if (cellRender && typeof option === "number") {
            return (
              <div key={option}>
                {cellRender(option, {
                  originNode,
                  today,
                  subType: type as "hour" | "minute" | "second" | "meridiem",
                })}
              </div>
            )
          }

          return originNode
        })}
      </div>
    </ScrollArea>
  )
}

// ==================== Time Panel Component ====================

export interface TimePanelProps {
  value?: Date
  onChange?: (time: Date) => void
  showHour?: boolean
  showMinute?: boolean
  showSecond?: boolean
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  disabledTime?: () => DisabledTime
  hideDisabledOptions?: boolean
  defaultOpenValue?: Date
  cellRender?: TimePickerProps["cellRender"]
}

export const TimePanel: React.FC<TimePanelProps> = ({
  value,
  onChange,
  showHour = true,
  showMinute = true,
  showSecond = true,
  use12Hours = false,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  disabledTime,
  hideDisabledOptions = false,
  defaultOpenValue,
  cellRender,
}) => {
  const today = new Date()
  const displayTime = value || defaultOpenValue || today

  const hour = displayTime.getHours()
  const minute = displayTime.getMinutes()
  const second = displayTime.getSeconds()
  const meridiem = hour >= 12 ? "PM" : "AM"

  const disabled = disabledTime?.() || {}
  const disabledHours = disabled.disabledHours?.() || []
  const disabledMinutes = disabled.disabledMinutes?.(hour) || []
  const disabledSeconds = disabled.disabledSeconds?.(hour, minute) || []

  const handleHourChange = (h: number | string) => {
    if (typeof h !== "number") return
    let newHour = h
    if (use12Hours && meridiem === "PM" && h < 12) {
      newHour = h + 12
    } else if (use12Hours && meridiem === "AM" && h === 12) {
      newHour = 0
    }
    const newTime = setHours(displayTime, newHour)
    onChange?.(newTime)
  }

  const handleMinuteChange = (m: number | string) => {
    if (typeof m !== "number") return
    const newTime = setMinutes(displayTime, m)
    onChange?.(newTime)
  }

  const handleSecondChange = (s: number | string) => {
    if (typeof s !== "number") return
    const newTime = setSeconds(displayTime, s)
    onChange?.(newTime)
  }

  const handleMeridiemChange = (m: number | string) => {
    if (typeof m !== "string") return
    let newHour = hour
    if (m === "AM" && hour >= 12) {
      newHour = hour - 12
    } else if (m === "PM" && hour < 12) {
      newHour = hour + 12
    }
    const newTime = setHours(displayTime, newHour)
    onChange?.(newTime)
  }

  const hourOptions = generateTimeOptions(
    use12Hours ? 12 : 24,
    hourStep,
    disabledHours,
    hideDisabledOptions
  )
  
  // For 12-hour format, map 0 to 12
  const displayHourOptions = use12Hours 
    ? hourOptions.map(h => h === 0 ? 12 : h)
    : hourOptions

  const minuteOptions = generateTimeOptions(60, minuteStep, disabledMinutes, hideDisabledOptions)
  const secondOptions = generateTimeOptions(60, secondStep, disabledSeconds, hideDisabledOptions)

  const displayHour = use12Hours ? (hour % 12 || 12) : hour

  return (
    <div className="flex divide-x border-t">
      {showHour && (
        <TimeColumn
          type="hour"
          options={displayHourOptions}
          value={displayHour}
          onSelect={handleHourChange}
          disabledValues={use12Hours ? disabledHours.map(h => h % 12 || 12) : disabledHours}
          cellRender={cellRender}
          today={today}
        />
      )}
      {showMinute && (
        <TimeColumn
          type="minute"
          options={minuteOptions}
          value={minute}
          onSelect={handleMinuteChange}
          disabledValues={disabledMinutes}
          cellRender={cellRender}
          today={today}
        />
      )}
      {showSecond && (
        <TimeColumn
          type="second"
          options={secondOptions}
          value={second}
          onSelect={handleSecondChange}
          disabledValues={disabledSeconds}
          cellRender={cellRender}
          today={today}
        />
      )}
      {use12Hours && (
        <TimeColumn
          type="meridiem"
          options={["AM", "PM"]}
          value={meridiem}
          onSelect={handleMeridiemChange}
          today={today}
        />
      )}
    </div>
  )
}

// ==================== Main TimePicker Component ====================

export function TimePicker({
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onOpenChange,
  placeholder = "Select time",
  className,
  disabled = false,
  format: timeFormat,
  allowClear = true,
  size = "middle",
  status,
  variant = "outlined",
  // placement is reserved for future use
  // placement = "bottomLeft",
  open: controlledOpen,
  suffixIcon,
  use12Hours = false,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  showHour = true,
  showMinute = true,
  showSecond = true,
  showNow = true,
  disabledTime,
  hideDisabledOptions = false,
  inputReadOnly = false,
  readOnly = false,
  id,
  name,
  bordered = true,
  autoFocus = false,
  renderExtraFooter,
  needConfirm = false,
  defaultOpenValue,
  cellRender,
}: TimePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue)
  const [tempValue, setTempValue] = React.useState<Date | undefined>(undefined)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isControlledOpen = controlledOpen !== undefined
  const isOpen = isControlledOpen ? controlledOpen : internalOpen
  const selectedTime = value !== undefined ? value : internalValue
  const displayTime = tempValue || selectedTime

  // Determine format based on shown columns
  const resolvedFormat = timeFormat || (
    use12Hours
      ? `${showHour ? "hh" : ""}${showMinute ? ":mm" : ""}${showSecond ? ":ss" : ""} A`
      : `${showHour ? "HH" : ""}${showMinute ? ":mm" : ""}${showSecond ? ":ss" : ""}`
  ).replace(/^:/, "")

  React.useEffect(() => {
    if (selectedTime && isValid(selectedTime)) {
      setInputValue(format(selectedTime, resolvedFormat))
    } else {
      setInputValue("")
    }
  }, [selectedTime, resolvedFormat])

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  React.useEffect(() => {
    if (isOpen) {
      setTempValue(selectedTime)
    } else {
      setTempValue(undefined)
    }
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    if (disabled || readOnly) return
    if (!isControlledOpen) {
      setInternalOpen(open)
    }
    onOpenChange?.(open)
  }

  const commitValue = (time: Date | undefined) => {
    const timeString = time && isValid(time) ? format(time, resolvedFormat) : ""
    if (value === undefined) {
      setInternalValue(time)
    }
    onChange?.(time, timeString)
  }

  const handleTimeChange = (time: Date) => {
    setTempValue(time)
    if (!needConfirm) {
      commitValue(time)
    }
  }

  const handleConfirm = () => {
    commitValue(tempValue)
    handleOpenChange(false)
  }

  const handleNowClick = () => {
    const now = new Date()
    setTempValue(now)
    if (!needConfirm) {
      commitValue(now)
      handleOpenChange(false)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value === undefined) {
      setInternalValue(undefined)
    }
    onChange?.(undefined, "")
    setInputValue("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    const parsedTime = parse(newValue, resolvedFormat, new Date())
    if (isValid(parsedTime)) {
      setTempValue(parsedTime)
      if (!needConfirm) {
        commitValue(parsedTime)
      }
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
    if (selectedTime && isValid(selectedTime)) {
      setInputValue(format(selectedTime, resolvedFormat))
    }
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e)
  }

  const renderClearIcon = () => {
    if (!allowClear || !selectedTime || disabled || readOnly) return null
    const clearIcon =
      typeof allowClear === "object" && allowClear.clearIcon
        ? allowClear.clearIcon
        : <X className="h-3 w-3" />

    return (
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center cursor-pointer transition-opacity z-10"
        onClick={handleClear}
        aria-label="Clear time"
      >
        {clearIcon}
      </div>
    )
  }

  const sizeClasses = getSizeClasses(size)
  const variantClasses = !bordered ? "border-transparent" : getVariantClasses(variant, status)

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "inline-flex items-center border rounded-md relative group cursor-pointer transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            sizeClasses,
            variantClasses,
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={inputReadOnly || readOnly}
            className={cn(
              "flex-1 bg-transparent outline-none border-none ml-2 min-w-0",
              "placeholder:text-muted-foreground",
              disabled && "cursor-not-allowed"
            )}
          />
          {renderClearIcon()}
          <div className="ml-1 text-muted-foreground shrink-0">
            {suffixIcon || <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="text-sm font-medium text-center mb-2">
            {displayTime ? format(displayTime, resolvedFormat) : placeholder}
          </div>
        </div>
        <TimePanel
          value={displayTime}
          onChange={handleTimeChange}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          use12Hours={use12Hours}
          hourStep={hourStep}
          minuteStep={minuteStep}
          secondStep={secondStep}
          disabledTime={disabledTime}
          hideDisabledOptions={hideDisabledOptions}
          defaultOpenValue={defaultOpenValue}
          cellRender={cellRender}
        />
        {(showNow || needConfirm || renderExtraFooter) && (
          <div className="border-t p-2 flex items-center justify-between gap-2">
            <div className="flex-1">{renderExtraFooter?.()}</div>
            <div className="flex gap-2">
              {showNow && (
                <Button variant="link" size="sm" className="text-primary" onClick={handleNowClick}>
                  Now
                </Button>
              )}
              {needConfirm && (
                <Button size="sm" onClick={handleConfirm}>
                  OK
                </Button>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ==================== Time Range Picker ====================

export interface TimeRangePickerProps {
  /** The selected range */
  value?: [Date | undefined, Date | undefined]
  /** Default range */
  defaultValue?: [Date | undefined, Date | undefined]
  /** Callback when range changes */
  onChange?: (times: [Date | undefined, Date | undefined], timeStrings: [string, string]) => void
  /** Placeholder for start and end */
  placeholder?: [string, string]
  /** Custom class name */
  className?: string
  /** Whether disabled */
  disabled?: boolean | [boolean, boolean]
  /** Format string */
  format?: string
  /** Whether to show clear button */
  allowClear?: boolean
  /** Size */
  size?: TimePickerSize
  /** Status */
  status?: TimePickerStatus
  /** Variant */
  variant?: TimePickerVariant
  /** Whether the popup is visible */
  open?: boolean
  /** Custom suffix icon */
  suffixIcon?: React.ReactNode
  /** Custom separator */
  separator?: React.ReactNode
  /** 12-hour format */
  use12Hours?: boolean
  /** Hour step */
  hourStep?: number
  /** Minute step */
  minuteStep?: number
  /** Second step */
  secondStep?: number
  /** Show hour */
  showHour?: boolean
  /** Show minute */
  showMinute?: boolean
  /** Show second */
  showSecond?: boolean
  /** Bordered */
  bordered?: boolean
  /** Order times */
  order?: boolean
  /** Allow empty */
  allowEmpty?: [boolean, boolean]
  /** Render extra footer */
  renderExtraFooter?: () => React.ReactNode
  /** Need confirm */
  needConfirm?: boolean
}

export function TimeRangePicker({
  value,
  defaultValue,
  onChange,
  placeholder = ["Start time", "End time"],
  className,
  disabled = false,
  format: timeFormat = "HH:mm:ss",
  allowClear = true,
  size = "middle",
  status,
  variant = "outlined",
  open: controlledOpen,
  suffixIcon,
  separator,
  use12Hours = false,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  showHour = true,
  showMinute = true,
  showSecond = true,
  bordered = true,
  order = true,
  // allowEmpty is reserved for future use
  // allowEmpty = [false, false],
  renderExtraFooter,
  needConfirm = false,
}: TimeRangePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<[Date | undefined, Date | undefined] | undefined>(defaultValue)
  const [activeInput, setActiveInput] = React.useState<'start' | 'end'>('start')

  const isControlledOpen = controlledOpen !== undefined
  const isOpen = isControlledOpen ? controlledOpen : internalOpen
  const selectedRange = value !== undefined ? value : internalValue

  const isStartDisabled = Array.isArray(disabled) ? disabled[0] : disabled
  const isEndDisabled = Array.isArray(disabled) ? disabled[1] : disabled
  const isFullyDisabled = isStartDisabled && isEndDisabled

  const resolvedFormat = timeFormat || (
    use12Hours
      ? `${showHour ? "hh" : ""}${showMinute ? ":mm" : ""}${showSecond ? ":ss" : ""} A`
      : `${showHour ? "HH" : ""}${showMinute ? ":mm" : ""}${showSecond ? ":ss" : ""}`
  ).replace(/^:/, "")

  const formatTime = (time: Date | undefined): string => {
    return time && isValid(time) ? format(time, resolvedFormat) : ""
  }

  const handleOpenChange = (open: boolean) => {
    if (isFullyDisabled) return
    if (!isControlledOpen) {
      setInternalOpen(open)
    }
  }

  const orderTimes = (times: [Date | undefined, Date | undefined]): [Date | undefined, Date | undefined] => {
    if (!order || !times[0] || !times[1]) return times
    if (times[0] > times[1]) {
      return [times[1], times[0]]
    }
    return times
  }

  const handleTimeChange = (index: 0 | 1) => (time: Date) => {
    const newRange: [Date | undefined, Date | undefined] = [...(selectedRange || [undefined, undefined])] as [Date | undefined, Date | undefined]
    newRange[index] = time

    if (value === undefined) {
      setInternalValue(newRange)
    }

    const orderedRange = orderTimes(newRange)
    onChange?.(orderedRange, [formatTime(orderedRange[0]), formatTime(orderedRange[1])])
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newRange: [Date | undefined, Date | undefined] = [undefined, undefined]
    if (value === undefined) {
      setInternalValue(newRange)
    }
    onChange?.(newRange, ["", ""])
  }

  const renderClearIcon = () => {
    if (!allowClear || (!selectedRange?.[0] && !selectedRange?.[1]) || isFullyDisabled) {
      return null
    }

    return (
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center cursor-pointer transition-opacity z-10"
        onClick={handleClear}
        aria-label="Clear range"
      >
        <X className="h-3 w-3" />
      </div>
    )
  }

  const sizeClasses = getSizeClasses(size)
  const variantClasses = !bordered ? "border-transparent" : getVariantClasses(variant, status)

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "inline-flex items-center border rounded-md relative group cursor-pointer transition-colors px-3",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            sizeClasses,
            variantClasses,
            isFullyDisabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={formatTime(selectedRange?.[0])}
            placeholder={placeholder[0]}
            disabled={isStartDisabled}
            readOnly
            onFocus={() => setActiveInput('start')}
            className={cn(
              "flex-1 bg-transparent outline-none border-none ml-2 min-w-0 w-20",
              "placeholder:text-muted-foreground text-center",
              isStartDisabled && "cursor-not-allowed",
              activeInput === 'start' && isOpen && "text-primary"
            )}
          />
          {separator || <span className="mx-1 text-muted-foreground">~</span>}
          <input
            type="text"
            value={formatTime(selectedRange?.[1])}
            placeholder={placeholder[1]}
            disabled={isEndDisabled}
            readOnly
            onFocus={() => setActiveInput('end')}
            className={cn(
              "flex-1 bg-transparent outline-none border-none min-w-0 w-20",
              "placeholder:text-muted-foreground text-center",
              isEndDisabled && "cursor-not-allowed",
              activeInput === 'end' && isOpen && "text-primary"
            )}
          />
          {renderClearIcon()}
          <div className="ml-1 text-muted-foreground shrink-0">
            {suffixIcon || <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex divide-x">
          <div className="flex-1">
            <div className="p-2 text-center text-sm font-medium border-b">
              {formatTime(selectedRange?.[0]) || placeholder[0]}
            </div>
            <TimePanel
              value={selectedRange?.[0]}
              onChange={handleTimeChange(0)}
              showHour={showHour}
              showMinute={showMinute}
              showSecond={showSecond}
              use12Hours={use12Hours}
              hourStep={hourStep}
              minuteStep={minuteStep}
              secondStep={secondStep}
            />
          </div>
          <div className="flex-1">
            <div className="p-2 text-center text-sm font-medium border-b">
              {formatTime(selectedRange?.[1]) || placeholder[1]}
            </div>
            <TimePanel
              value={selectedRange?.[1]}
              onChange={handleTimeChange(1)}
              showHour={showHour}
              showMinute={showMinute}
              showSecond={showSecond}
              use12Hours={use12Hours}
              hourStep={hourStep}
              minuteStep={minuteStep}
              secondStep={secondStep}
            />
          </div>
        </div>
        {(needConfirm || renderExtraFooter) && (
          <div className="border-t p-2 flex items-center justify-between gap-2">
            <div className="flex-1">{renderExtraFooter?.()}</div>
            {needConfirm && (
              <Button size="sm" onClick={() => handleOpenChange(false)}>
                OK
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
