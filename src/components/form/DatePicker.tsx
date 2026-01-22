import * as React from "react"
import { format, isValid, parse, setHours, setMinutes, setSeconds, isSameDay, addDays } from "date-fns"
import { Calendar as CalendarIcon, X, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePanel, type DisabledTime } from "./TimePicker"

// ==================== Types ====================

export type PickerMode = "time" | "date" | "week" | "month" | "quarter" | "year" | "decade"
export type PickerType = "date" | "week" | "month" | "quarter" | "year"
export type PickerSize = "small" | "middle" | "large"
export type PickerStatus = "error" | "warning"
export type PickerVariant = "outlined" | "filled" | "borderless"
export type PickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight"

export interface DatePickerPreset {
  label: React.ReactNode
  value: Date | (() => Date)
}

export interface DatePickerLocale {
  lang: {
    locale: string
    placeholder: string
    yearPlaceholder?: string
    quarterPlaceholder?: string
    monthPlaceholder?: string
    weekPlaceholder?: string
    rangePlaceholder?: [string, string]
    today: string
    now: string
    ok: string
    clear: string
    month?: string
    year?: string
    previousMonth?: string
    nextMonth?: string
    previousYear?: string
    nextYear?: string
    previousDecade?: string
    nextDecade?: string
    shortMonths?: string[]
    shortWeekDays?: string[]
  }
  timePickerLocale?: {
    placeholder?: string
  }
}

export interface ShowTimeOptions {
  format?: string
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  showHour?: boolean
  showMinute?: boolean
  showSecond?: boolean
  defaultOpenValue?: Date
  hideDisabledOptions?: boolean
}

export interface DatePickerProps {
  /** The selected date */
  value?: Date | Date[]
  /** Default date value */
  defaultValue?: Date | Date[]
  /** Callback when date is selected */
  onChange?: (date: Date | Date[] | undefined, dateString: string | string[]) => void
  /** Callback when picker panel changes */
  onPanelChange?: (date: Date | undefined, mode: PickerMode) => void
  /** Callback when input loses focus */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  /** Callback when input gains focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  /** Callback when popup visibility changes */
  onOpenChange?: (open: boolean) => void
  /** Callback when OK button is clicked */
  onOk?: (date: Date | undefined) => void
  /** Placeholder text */
  placeholder?: string
  /** Custom class name */
  className?: string
  /** Whether disabled */
  disabled?: boolean
  /** Display format (date-fns format) */
  format?: string | ((value: Date) => string) | (string | ((value: Date) => string))[]
  /** Whether to show clear button */
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  /** Preset dates */
  presets?: DatePickerPreset[]
  /** Function to disable dates */
  disabledDate?: (date: Date, info?: { from?: Date; type?: PickerType }) => boolean
  /** Function to disable time */
  disabledTime?: (date: Date | null) => DisabledTime
  /** Picker type */
  picker?: PickerType
  /** Size */
  size?: PickerSize
  /** Status */
  status?: PickerStatus
  /** Variant style */
  variant?: PickerVariant
  /** Placement */
  placement?: PickerPlacement
  /** Controlled open state */
  open?: boolean
  /** Custom suffix icon */
  suffixIcon?: React.ReactNode
  /** Whether to show "Now" button */
  showNow?: boolean
  /** Whether to show time picker */
  showTime?: boolean | ShowTimeOptions
  /** Whether to show week number */
  showWeek?: boolean
  /** Minimum date */
  minDate?: Date
  /** Maximum date */
  maxDate?: Date
  /** Read-only mode */
  readOnly?: boolean
  /** Input read-only */
  inputReadOnly?: boolean
  /** Input ID */
  id?: string
  /** Input name */
  name?: string
  /** Bordered style */
  bordered?: boolean
  /** Auto focus */
  autoFocus?: boolean
  /** Render extra footer */
  renderExtraFooter?: (mode: PickerMode) => React.ReactNode
  /** Default panel date */
  defaultPickerValue?: Date
  /** Controlled panel date */
  pickerValue?: Date
  /** Callback when panel date changes */
  onPickerValueChange?: (date: Date) => void
  /** Panel mode (controlled) */
  mode?: PickerMode
  /** Whether need confirm button */
  needConfirm?: boolean
  /** Enable multiple selection (not with showTime) */
  multiple?: boolean
  /** Custom cell render */
  cellRender?: (
    current: Date | number,
    info: {
      originNode: React.ReactNode
      today: Date
      range?: "start" | "end"
      type: PickerMode
      locale?: DatePickerLocale
      subType?: "hour" | "minute" | "second" | "meridiem"
    }
  ) => React.ReactNode
  /** Custom panel render */
  panelRender?: (panelNode: React.ReactNode) => React.ReactNode
  /** Custom prev icon */
  prevIcon?: React.ReactNode
  /** Custom next icon */
  nextIcon?: React.ReactNode
  /** Custom super prev icon */
  superPrevIcon?: React.ReactNode
  /** Custom super next icon */
  superNextIcon?: React.ReactNode
  /** Custom prefix */
  prefix?: React.ReactNode
  /** Locale configuration */
  locale?: DatePickerLocale
  /** Get popup container */
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement
  /** Auto order dates */
  order?: boolean
  /** Preserve invalid value on blur */
  preserveInvalidOnBlur?: boolean
}

// ==================== Default Locale ====================

const defaultLocale: DatePickerLocale = {
  lang: {
    locale: "en",
    placeholder: "Select date",
    yearPlaceholder: "Select year",
    quarterPlaceholder: "Select quarter",
    monthPlaceholder: "Select month",
    weekPlaceholder: "Select week",
    rangePlaceholder: ["Start date", "End date"],
    today: "Today",
    now: "Now",
    ok: "OK",
    clear: "Clear",
    month: "Month",
    year: "Year",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousYear: "Previous year",
    nextYear: "Next year",
    previousDecade: "Previous decade",
    nextDecade: "Next decade",
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    shortWeekDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  },
}

// ==================== Helper Functions ====================

const getDefaultFormat = (picker: PickerType, showTime?: boolean | ShowTimeOptions): string => {
  const timeFormat = typeof showTime === "object" && showTime.format ? showTime.format : "HH:mm:ss"
  switch (picker) {
    case "year":
      return "yyyy"
    case "quarter":
      return "yyyy-'Q'Q"
    case "month":
      return "yyyy-MM"
    case "week":
      return "yyyy-'W'ww"
    case "date":
    default:
      return showTime ? `yyyy-MM-dd ${timeFormat}` : "yyyy-MM-dd"
  }
}

const getSizeClasses = (size: PickerSize): string => {
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

const getVariantClasses = (variant: PickerVariant, status?: PickerStatus): string => {
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

const getPlacementAlign = (placement: PickerPlacement): "start" | "center" | "end" => {
  if (placement.includes("Left")) return "start"
  if (placement.includes("Right")) return "end"
  return "start"
}

const getQuarter = (date: Date): number => {
  return Math.floor(date.getMonth() / 3) + 1
}

const formatDateValue = (
  date: Date | undefined,
  formatStr: string | ((value: Date) => string) | (string | ((value: Date) => string))[]
): string => {
  if (!date || !isValid(date)) return ""
  
  if (typeof formatStr === "function") {
    return formatStr(date)
  }
  
  if (Array.isArray(formatStr)) {
    const firstFormat = formatStr[0]
    if (typeof firstFormat === "function") {
      return firstFormat(date)
    }
    return format(date, firstFormat)
  }
  
  return format(date, formatStr)
}

// ==================== Sub Components ====================

interface QuarterPickerPanelProps {
  value?: Date
  onSelect: (date: Date) => void
  disabledDate?: (date: Date) => boolean
  defaultPickerValue?: Date
  cellRender?: DatePickerProps["cellRender"]
  locale?: DatePickerLocale
  prevIcon?: React.ReactNode
  nextIcon?: React.ReactNode
}

const QuarterPickerPanel: React.FC<QuarterPickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  defaultPickerValue,
  cellRender,
  locale = defaultLocale,
  prevIcon,
  nextIcon,
}) => {
  const today = new Date()
  const [viewYear, setViewYear] = React.useState(() => {
    return value?.getFullYear() || defaultPickerValue?.getFullYear() || today.getFullYear()
  })

  const quarters = [
    { label: "Q1", value: 1, months: "Jan - Mar" },
    { label: "Q2", value: 2, months: "Apr - Jun" },
    { label: "Q3", value: 3, months: "Jul - Sep" },
    { label: "Q4", value: 4, months: "Oct - Dec" },
  ]

  const getQuarterDate = (quarter: number): Date => {
    return new Date(viewYear, (quarter - 1) * 3, 1)
  }

  const isSelected = (quarter: number): boolean => {
    if (!value) return false
    return value.getFullYear() === viewYear && getQuarter(value) === quarter
  }

  const isCurrentQuarter = (quarter: number): boolean => {
    return today.getFullYear() === viewYear && getQuarter(today) === quarter
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewYear(viewYear - 1)}>
          {prevIcon || <ChevronLeft className="h-4 w-4" />}
        </Button>
        <span className="font-medium">{viewYear}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewYear(viewYear + 1)}>
          {nextIcon || <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quarters.map((q) => {
          const quarterDate = getQuarterDate(q.value)
          const disabled = disabledDate?.(quarterDate)
          const selected = isSelected(q.value)
          const current = isCurrentQuarter(q.value)

          const originNode = (
            <Button
              key={q.value}
              variant={selected ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              className={cn(
                "flex flex-col h-auto py-2 w-full",
                current && !selected && "border-primary text-primary"
              )}
              onClick={() => onSelect(quarterDate)}
            >
              <span className="font-medium">{q.label}</span>
              <span className="text-xs text-muted-foreground">{q.months}</span>
            </Button>
          )

          if (cellRender) {
            return (
              <div key={q.value}>
                {cellRender(quarterDate, {
                  originNode,
                  today,
                  type: "quarter",
                  locale,
                })}
              </div>
            )
          }

          return <div key={q.value}>{originNode}</div>
        })}
      </div>
    </div>
  )
}

interface YearPickerPanelProps {
  value?: Date
  onSelect: (date: Date) => void
  disabledDate?: (date: Date) => boolean
  defaultPickerValue?: Date
  cellRender?: DatePickerProps["cellRender"]
  locale?: DatePickerLocale
  superPrevIcon?: React.ReactNode
  superNextIcon?: React.ReactNode
}

const YearPickerPanel: React.FC<YearPickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  defaultPickerValue,
  cellRender,
  locale = defaultLocale,
  superPrevIcon,
  superNextIcon,
}) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const [startYear, setStartYear] = React.useState(() => {
    const targetYear = value?.getFullYear() || defaultPickerValue?.getFullYear() || currentYear
    return Math.floor(targetYear / 10) * 10
  })

  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i)

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setStartYear(startYear - 10)}>
          {superPrevIcon || <ChevronsLeft className="h-4 w-4" />}
        </Button>
        <span className="font-medium">
          {startYear} - {startYear + 9}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setStartYear(startYear + 10)}>
          {superNextIcon || <ChevronsRight className="h-4 w-4" />}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {years.map((year) => {
          const yearDate = new Date(year, 0, 1)
          const disabled = disabledDate?.(yearDate)
          const isCurrentYear = year === currentYear
          const isSelected = value?.getFullYear() === year
          const isOutOfRange = year < startYear || year > startYear + 9

          const originNode = (
            <Button
              key={year}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              className={cn(
                "h-9 w-full",
                isOutOfRange && "text-muted-foreground",
                isCurrentYear && !isSelected && "border-primary text-primary"
              )}
              onClick={() => onSelect(yearDate)}
            >
              {year}
            </Button>
          )

          if (cellRender) {
            return (
              <div key={year}>
                {cellRender(yearDate, {
                  originNode,
                  today,
                  type: "year",
                  locale,
                })}
              </div>
            )
          }

          return <div key={year}>{originNode}</div>
        })}
      </div>
    </div>
  )
}

interface MonthPickerPanelProps {
  value?: Date
  onSelect: (date: Date) => void
  disabledDate?: (date: Date) => boolean
  defaultPickerValue?: Date
  cellRender?: DatePickerProps["cellRender"]
  locale?: DatePickerLocale
  prevIcon?: React.ReactNode
  nextIcon?: React.ReactNode
}

const MonthPickerPanel: React.FC<MonthPickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  defaultPickerValue,
  cellRender,
  locale = defaultLocale,
  prevIcon,
  nextIcon,
}) => {
  const today = new Date()
  const [viewYear, setViewYear] = React.useState(() => {
    return value?.getFullYear() || defaultPickerValue?.getFullYear() || today.getFullYear()
  })

  const months = locale.lang.shortMonths || [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewYear(viewYear - 1)}>
          {prevIcon || <ChevronLeft className="h-4 w-4" />}
        </Button>
        <span className="font-medium">{viewYear}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewYear(viewYear + 1)}>
          {nextIcon || <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => {
          const monthDate = new Date(viewYear, index, 1)
          const disabled = disabledDate?.(monthDate)
          const isSelected = value?.getFullYear() === viewYear && value?.getMonth() === index
          const isCurrentMonth = today.getFullYear() === viewYear && today.getMonth() === index

          const originNode = (
            <Button
              key={month}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              className={cn(
                "h-9 w-full",
                isCurrentMonth && !isSelected && "border-primary text-primary"
              )}
              onClick={() => onSelect(monthDate)}
            >
              {month}
            </Button>
          )

          if (cellRender) {
            return (
              <div key={month}>
                {cellRender(monthDate, {
                  originNode,
                  today,
                  type: "month",
                  locale,
                })}
              </div>
            )
          }

          return <div key={month}>{originNode}</div>
        })}
      </div>
    </div>
  )
}

// ==================== Multiple Select Tags ====================

interface MultipleTagsProps {
  values: Date[]
  format: string
  onRemove: (index: number) => void
  maxTagCount?: number
  size: PickerSize
}

const MultipleTags: React.FC<MultipleTagsProps> = ({
  values,
  format: dateFormat,
  onRemove,
  maxTagCount = 3,
  size,
}) => {
  const displayValues = values.slice(0, maxTagCount)
  const restCount = values.length - maxTagCount

  const tagSizeClasses = size === "small" ? "h-5 text-xs px-1" : size === "large" ? "h-7 text-sm px-2" : "h-6 text-xs px-1.5"

  return (
    <div className="flex flex-wrap gap-1 items-center ml-2 flex-1 min-w-0">
      {displayValues.map((date, index) => (
        <span
          key={index}
          className={cn(
            "inline-flex items-center gap-1 bg-muted rounded",
            tagSizeClasses
          )}
        >
          <span className="truncate max-w-[80px]">{formatDateValue(date, dateFormat)}</span>
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(index)
            }}
          />
        </span>
      ))}
      {restCount > 0 && (
        <span className={cn("text-muted-foreground", tagSizeClasses)}>
          +{restCount}...
        </span>
      )}
    </div>
  )
}

// ==================== Main DatePicker Component ====================

export function DatePicker({
  value,
  defaultValue,
  onChange,
  onPanelChange,
  onBlur,
  onFocus,
  onOpenChange,
  onOk,
  placeholder,
  className,
  disabled = false,
  format: dateFormat,
  allowClear = true,
  presets,
  disabledDate: propDisabledDate,
  disabledTime,
  picker = "date",
  size = "middle",
  status,
  variant = "outlined",
  placement = "bottomLeft",
  open: controlledOpen,
  suffixIcon,
  showNow = false,
  showTime = false,
  showWeek = false,
  minDate,
  maxDate,
  readOnly = false,
  inputReadOnly = false,
  id,
  name,
  bordered = true,
  autoFocus = false,
  renderExtraFooter,
  defaultPickerValue,
  mode: controlledMode,
  needConfirm,
  multiple = false,
  cellRender,
  panelRender,
  prevIcon,
  nextIcon,
  superPrevIcon,
  superNextIcon,
  prefix,
  locale = defaultLocale,
  order = true,
  preserveInvalidOnBlur = false,
}: DatePickerProps) {
  // Internal state
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<Date | Date[] | undefined>(defaultValue)
  const [tempValue, setTempValue] = React.useState<Date | undefined>(undefined)
  const [inputValue, setInputValue] = React.useState("")
  const [internalMode, setInternalMode] = React.useState<PickerMode>(picker)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Controlled vs uncontrolled
  const isControlledOpen = controlledOpen !== undefined
  const isOpen = isControlledOpen ? controlledOpen : internalOpen
  const currentMode = controlledMode !== undefined ? controlledMode : internalMode
  
  // Handle value - can be single or multiple
  const selectedValue = value !== undefined ? value : internalValue
  const selectedDate = Array.isArray(selectedValue) ? selectedValue[selectedValue.length - 1] : selectedValue
  const selectedDates = Array.isArray(selectedValue) ? selectedValue : selectedValue ? [selectedValue] : []
  
  // Display value for time picker integration
  const displayDate = tempValue || selectedDate
  
  // Resolved format
  const resolvedFormat = dateFormat || getDefaultFormat(picker, showTime)
  const formatStr = Array.isArray(resolvedFormat) ? resolvedFormat[0] : resolvedFormat
  
  // Resolved placeholder
  const resolvedPlaceholder = placeholder || (
    picker === "year" ? locale.lang.yearPlaceholder :
    picker === "quarter" ? locale.lang.quarterPlaceholder :
    picker === "month" ? locale.lang.monthPlaceholder :
    picker === "week" ? locale.lang.weekPlaceholder :
    locale.lang.placeholder
  ) || `Select ${picker}`

  // Determine if we need confirm button
  const showConfirmButton = needConfirm !== undefined ? needConfirm : !!showTime

  // Combine minDate/maxDate with disabledDate
  const disabledDate = React.useCallback(
    (date: Date): boolean => {
      if (propDisabledDate?.(date, { type: picker })) return true
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return false
    },
    [propDisabledDate, minDate, maxDate, picker]
  )

  // Update input value when date changes
  React.useEffect(() => {
    if (!multiple) {
      if (selectedDate && isValid(selectedDate)) {
        setInputValue(formatDateValue(selectedDate, formatStr))
      } else {
        setInputValue("")
      }
    }
  }, [selectedDate, formatStr, multiple])

  // Auto focus
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Sync temp value when opening
  React.useEffect(() => {
    if (isOpen) {
      setTempValue(selectedDate)
      setInternalMode(picker)
    } else {
      setTempValue(undefined)
    }
  }, [isOpen, selectedDate, picker])

  const handleOpenChange = (open: boolean) => {
    if (disabled || readOnly) return
    if (!isControlledOpen) {
      setInternalOpen(open)
    }
    onOpenChange?.(open)
  }

  const commitValue = (date: Date | Date[] | undefined) => {
    if (Array.isArray(date)) {
      const dateStrings = date.map(d => formatDateValue(d, formatStr))
      if (value === undefined) {
        setInternalValue(date)
      }
      onChange?.(date, dateStrings)
    } else {
      const dateString = date ? formatDateValue(date, formatStr) : ""
      if (value === undefined) {
        setInternalValue(date)
      }
      onChange?.(date, dateString)
    }
    onPanelChange?.(Array.isArray(date) ? date[0] : date, picker)
  }

  const handleSelect = (date: Date | undefined) => {
    if (!date) return

    if (multiple) {
      // Multiple selection mode
      const currentDates = [...selectedDates]
      const existingIndex = currentDates.findIndex(d => isSameDay(d, date))
      
      if (existingIndex >= 0) {
        currentDates.splice(existingIndex, 1)
      } else {
        currentDates.push(date)
      }
      
      // Sort if order is true
      if (order) {
        currentDates.sort((a, b) => a.getTime() - b.getTime())
      }
      
      commitValue(currentDates.length > 0 ? currentDates : undefined)
    } else if (showTime) {
      // With time picker, don't close immediately
      // Preserve the time from the current temp value
      const newDate = tempValue
        ? setHours(
            setMinutes(
              setSeconds(date, tempValue.getSeconds()),
              tempValue.getMinutes()
            ),
            tempValue.getHours()
          )
        : date
      setTempValue(newDate)
      
      if (!showConfirmButton) {
        commitValue(newDate)
        handleOpenChange(false)
      }
    } else {
      commitValue(date)
      handleOpenChange(false)
    }
  }

  const handleTimeChange = (time: Date) => {
    setTempValue(time)
    if (!showConfirmButton) {
      commitValue(time)
    }
  }

  const handleOk = () => {
    commitValue(tempValue)
    onOk?.(tempValue)
    handleOpenChange(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value === undefined) {
      setInternalValue(undefined)
    }
    onChange?.(undefined, multiple ? [] : "")
    setInputValue("")
  }

  const handleRemoveTag = (index: number) => {
    if (!multiple) return
    const newDates = [...selectedDates]
    newDates.splice(index, 1)
    commitValue(newDates.length > 0 ? newDates : undefined)
  }

  const handlePresetSelect = (presetValue: Date | (() => Date)) => {
    const date = typeof presetValue === "function" ? presetValue() : presetValue
    if (showTime) {
      setTempValue(date)
      if (!showConfirmButton) {
        commitValue(date)
        handleOpenChange(false)
      }
    } else {
      commitValue(date)
      handleOpenChange(false)
    }
  }

  const handleNowClick = () => {
    const now = new Date()
    if (showTime || showConfirmButton) {
      setTempValue(now)
    } else {
      commitValue(now)
      handleOpenChange(false)
    }
  }

  const handleTodayClick = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (showTime || showConfirmButton) {
      setTempValue(today)
    } else {
      commitValue(today)
      handleOpenChange(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) return
    const newValue = e.target.value
    setInputValue(newValue)

    // Try to parse input with all format options
    const formats = Array.isArray(resolvedFormat) ? resolvedFormat : [resolvedFormat]
    for (const fmt of formats) {
      if (typeof fmt === "string") {
        const parsedDate = parse(newValue, fmt, new Date())
        if (isValid(parsedDate) && !disabledDate(parsedDate)) {
          setTempValue(parsedDate)
          if (!showConfirmButton) {
            commitValue(parsedDate)
          }
          return
        }
      }
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e)
    // Reset input value if invalid (unless preserveInvalidOnBlur)
    if (!preserveInvalidOnBlur && selectedDate && isValid(selectedDate)) {
      setInputValue(formatDateValue(selectedDate, formatStr))
    }
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e)
  }

  // Render clear icon
  const renderClearIcon = () => {
    const hasValue = multiple ? selectedDates.length > 0 : !!selectedDate
    if (!allowClear || !hasValue || disabled || readOnly) return null

    const clearIcon =
      typeof allowClear === "object" && allowClear.clearIcon
        ? allowClear.clearIcon
        : <X className="h-3 w-3" />

    return (
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center cursor-pointer transition-opacity z-10"
        onClick={handleClear}
        aria-label="Clear"
      >
        {clearIcon}
      </div>
    )
  }

  // Render the picker panel based on mode
  const renderPanel = () => {
    switch (currentMode) {
      case "year":
        return (
          <YearPickerPanel
            value={displayDate}
            onSelect={handleSelect}
            disabledDate={disabledDate}
            defaultPickerValue={defaultPickerValue}
            cellRender={cellRender}
            locale={locale}
            superPrevIcon={superPrevIcon}
            superNextIcon={superNextIcon}
          />
        )
      case "quarter":
        return (
          <QuarterPickerPanel
            value={displayDate}
            onSelect={handleSelect}
            disabledDate={disabledDate}
            defaultPickerValue={defaultPickerValue}
            cellRender={cellRender}
            locale={locale}
            prevIcon={prevIcon}
            nextIcon={nextIcon}
          />
        )
      case "month":
        return (
          <MonthPickerPanel
            value={displayDate}
            onSelect={handleSelect}
            disabledDate={disabledDate}
            defaultPickerValue={defaultPickerValue}
            cellRender={cellRender}
            locale={locale}
            prevIcon={prevIcon}
            nextIcon={nextIcon}
          />
        )
      case "date":
      case "week":
      default:
        return (
          <div>
            {multiple ? (
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => {
                  if (!dates) {
                    commitValue(undefined)
                  } else {
                    const datesArray = Array.isArray(dates) ? dates : [dates]
                    commitValue(datesArray.length > 0 ? datesArray : undefined)
                  }
                }}
                disabled={disabledDate}
                defaultMonth={defaultPickerValue || displayDate}
                showWeekNumber={picker === "week" || showWeek}
                initialFocus
              />
            ) : (
              <Calendar
                mode="single"
                selected={displayDate}
                onSelect={handleSelect}
                disabled={disabledDate}
                defaultMonth={defaultPickerValue || displayDate}
                showWeekNumber={picker === "week" || showWeek}
                initialFocus
              />
            )}
            {showTime && !multiple && (
              <TimePanel
                value={displayDate}
                onChange={handleTimeChange}
                showHour={typeof showTime === "object" ? showTime.showHour ?? true : true}
                showMinute={typeof showTime === "object" ? showTime.showMinute ?? true : true}
                showSecond={typeof showTime === "object" ? showTime.showSecond ?? true : true}
                use12Hours={typeof showTime === "object" ? showTime.use12Hours : false}
                hourStep={typeof showTime === "object" ? showTime.hourStep : 1}
                minuteStep={typeof showTime === "object" ? showTime.minuteStep : 1}
                secondStep={typeof showTime === "object" ? showTime.secondStep : 1}
                hideDisabledOptions={typeof showTime === "object" ? showTime.hideDisabledOptions : false}
                defaultOpenValue={typeof showTime === "object" ? showTime.defaultOpenValue : undefined}
                disabledTime={disabledTime ? () => disabledTime(displayDate || null) : undefined}
              />
            )}
          </div>
        )
    }
  }

  const sizeClasses = getSizeClasses(size)
  const variantClasses = !bordered ? "border-transparent" : getVariantClasses(variant, status)

  const panelContent = (
    <div className="flex">
      {presets && presets.length > 0 && (
        <div className="border-r py-3 px-2 w-[130px]">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Presets</div>
          <div className="flex flex-col gap-1">
            {presets.map((preset, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start text-xs h-8 px-2 font-normal"
                onClick={() => handlePresetSelect(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col">
        {renderPanel()}
        {(showNow || showConfirmButton || renderExtraFooter) && (
          <div className="border-t p-2 flex items-center justify-between gap-2">
            <div className="flex-1">{renderExtraFooter?.(currentMode)}</div>
            <div className="flex gap-2 items-center">
              {showNow && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary h-auto p-0"
                  onClick={showTime ? handleNowClick : handleTodayClick}
                >
                  {showTime ? locale.lang.now : locale.lang.today}
                </Button>
              )}
              {showConfirmButton && (
                <Button size="sm" onClick={handleOk}>
                  {locale.lang.ok}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

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
          {prefix && <div className="shrink-0 mr-1">{prefix}</div>}
          <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          {multiple && selectedDates.length > 0 ? (
            <MultipleTags
              values={selectedDates}
              format={typeof formatStr === "string" ? formatStr : "yyyy-MM-dd"}
              onRemove={handleRemoveTag}
              size={size}
            />
          ) : (
            <input
              ref={inputRef}
              id={id}
              name={name}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              placeholder={resolvedPlaceholder}
              disabled={disabled}
              readOnly={inputReadOnly || readOnly || multiple}
              className={cn(
                "flex-1 bg-transparent outline-none border-none ml-2 min-w-0",
                "placeholder:text-muted-foreground",
                disabled && "cursor-not-allowed"
              )}
            />
          )}
          {renderClearIcon()}
          <div className="ml-1 text-muted-foreground shrink-0">
            {suffixIcon || <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align={getPlacementAlign(placement)}
        side={placement.startsWith("top") ? "top" : "bottom"}
      >
        {panelRender ? panelRender(panelContent) : panelContent}
      </PopoverContent>
    </Popover>
  )
}

// ==================== Shorthand Pickers ====================

export const MonthPicker: React.FC<Omit<DatePickerProps, "picker">> = (props) => {
  return <DatePicker {...props} picker="month" />
}

export const YearPicker: React.FC<Omit<DatePickerProps, "picker">> = (props) => {
  return <DatePicker {...props} picker="year" />
}

export const QuarterPicker: React.FC<Omit<DatePickerProps, "picker">> = (props) => {
  return <DatePicker {...props} picker="quarter" />
}

export const WeekPicker: React.FC<Omit<DatePickerProps, "picker">> = (props) => {
  return <DatePicker {...props} picker="week" />
}

// ==================== Preset Helpers ====================

export const datePresets = {
  today: (): Date => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  },
  yesterday: (): Date => {
    const d = addDays(new Date(), -1)
    d.setHours(0, 0, 0, 0)
    return d
  },
  tomorrow: (): Date => {
    const d = addDays(new Date(), 1)
    d.setHours(0, 0, 0, 0)
    return d
  },
  lastWeek: (): Date => addDays(new Date(), -7),
  lastMonth: (): Date => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d
  },
  lastYear: (): Date => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1)
    return d
  },
}

export const defaultDatePresets: DatePickerPreset[] = [
  { label: "Today", value: datePresets.today },
  { label: "Yesterday", value: datePresets.yesterday },
  { label: "A week ago", value: datePresets.lastWeek },
  { label: "A month ago", value: datePresets.lastMonth },
]
