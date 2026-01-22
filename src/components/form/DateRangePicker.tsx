import * as React from "react"
import { format, isValid, parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, addDays, addMonths, addYears, setHours, setMinutes, setSeconds } from "date-fns"
import { Calendar as CalendarIcon, X, ArrowRight, ChevronDown, Clock } from "lucide-react"
import { DateRange } from "react-day-picker"

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

export type RangePickerMode = "date" | "week" | "month" | "quarter" | "year"
export type RangePickerSize = "small" | "middle" | "large"
export type RangePickerStatus = "error" | "warning"
export type RangePickerVariant = "outlined" | "filled" | "borderless"
export type RangePickerPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight"

export type RangeValue = [Date | undefined, Date | undefined] | undefined

export interface RangePickerPreset {
  label: React.ReactNode
  value: RangeValue | (() => RangeValue)
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
  defaultValue?: [Date, Date]
  hideDisabledOptions?: boolean
}

export interface DateRangePickerProps {
  /** The selected range */
  value?: DateRange
  /** Default range value */
  defaultValue?: DateRange
  /** Callback when range is selected */
  onChange?: (dates: DateRange | undefined, dateStrings: [string, string]) => void
  /** Callback fired when the start or end date is changing */
  onCalendarChange?: (
    dates: DateRange | undefined, 
    dateStrings: [string, string], 
    info: { range: 'start' | 'end' }
  ) => void
  /** Callback when picker panel changes */
  onPanelChange?: (dates: DateRange | undefined, mode: [RangePickerMode, RangePickerMode]) => void
  /** Callback when input loses focus */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>, info: { range: 'start' | 'end' }) => void
  /** Callback when input gains focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>, info: { range: 'start' | 'end' }) => void
  /** Callback when popup visibility changes */
  onOpenChange?: (open: boolean) => void
  /** Callback when OK button is clicked */
  onOk?: (dates: DateRange | undefined) => void
  /** Placeholder for start and end */
  placeholder?: [string, string]
  /** Custom class name */
  className?: string
  /** Whether the picker is disabled (can be [boolean, boolean] for each input) */
  disabled?: boolean | [boolean, boolean]
  /** Format string for displaying dates */
  format?: string
  /** Whether to show clear button */
  allowClear?: boolean | { clearIcon?: React.ReactNode }
  /** Allow empty start or end */
  allowEmpty?: [boolean, boolean]
  /** Preset ranges for quick selection */
  presets?: RangePickerPreset[]
  /** Function to determine if a date should be disabled */
  disabledDate?: (current: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean
  /** Function to determine if a time should be disabled */
  disabledTime?: (date: Date | null, type: 'start' | 'end') => DisabledTime
  /** The type of picker */
  picker?: RangePickerMode
  /** Size of the picker */
  size?: RangePickerSize
  /** Status of the picker */
  status?: RangePickerStatus
  /** Variant style */
  variant?: RangePickerVariant
  /** Popover placement */
  placement?: RangePickerPlacement
  /** Whether the popup is visible (controlled) */
  open?: boolean
  /** Custom suffix icon */
  suffixIcon?: React.ReactNode
  /** Custom separator */
  separator?: React.ReactNode
  /** Whether to show time picker */
  showTime?: boolean | ShowTimeOptions
  /** Whether to show "Now" button */
  showNow?: boolean
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Whether to order dates automatically */
  order?: boolean
  /** Whether the input is read-only */
  inputReadOnly?: boolean
  /** Whether the picker is read-only */
  readOnly?: boolean
  /** ID for inputs */
  id?: { start?: string; end?: string }
  /** Name attribute */
  name?: string
  /** Whether to enable bordered style */
  bordered?: boolean
  /** Number of months to display */
  numberOfMonths?: number
  /** Render extra footer in panel */
  renderExtraFooter?: () => React.ReactNode
  /** Default panel date */
  defaultPickerValue?: [Date | undefined, Date | undefined]
  /** Panel date (controlled) */
  pickerValue?: [Date | undefined, Date | undefined]
  /** Align the popover */
  align?: "center" | "start" | "end"
  /** Whether need confirm button */
  needConfirm?: boolean
}

// ==================== Helper Functions ====================

const getDefaultFormat = (picker: RangePickerMode, showTime?: boolean | object): string => {
  switch (picker) {
    case "year":
      return "yyyy"
    case "quarter":
      return "yyyy-QQQ"
    case "month":
      return "yyyy-MM"
    case "week":
      return "yyyy-'W'ww"
    case "date":
    default:
      return showTime ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd"
  }
}

const getSizeClasses = (size: RangePickerSize): string => {
  switch (size) {
    case "small":
      return "h-7 text-xs"
    case "large":
      return "h-11 text-base"
    case "middle":
    default:
      return "h-9 text-sm"
  }
}

const getVariantClasses = (variant: RangePickerVariant, status?: RangePickerStatus): string => {
  const statusClasses = status === "error" 
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

const getPlacementAlign = (placement: RangePickerPlacement): "start" | "center" | "end" => {
  if (placement.includes("Left")) return "start"
  if (placement.includes("Right")) return "end"
  return "start"
}

const formatDateRange = (range: DateRange | undefined, dateFormat: string): [string, string] => {
  const fromStr = range?.from && isValid(range.from) ? format(range.from, dateFormat) : ""
  const toStr = range?.to && isValid(range.to) ? format(range.to, dateFormat) : ""
  return [fromStr, toStr]
}

// ==================== Sub Components ====================

interface QuarterRangePickerPanelProps {
  value?: DateRange
  onSelect: (range: DateRange) => void
  disabledDate?: (date: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean
  activeRange: 'start' | 'end'
}

const QuarterRangePickerPanel: React.FC<QuarterRangePickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  activeRange,
}) => {
  const currentYear = new Date().getFullYear()
  const [viewYear, setViewYear] = React.useState(() => {
    return value?.from?.getFullYear() || currentYear
  })
  const [viewYear2, setViewYear2] = React.useState(() => {
    return value?.to?.getFullYear() || viewYear + 1
  })

  const quarters = [
    { label: "Q1", value: 0 },
    { label: "Q2", value: 1 },
    { label: "Q3", value: 2 },
    { label: "Q4", value: 3 },
  ]

  const getQuarterDate = (year: number, quarter: number): Date => {
    return new Date(year, quarter * 3, 1)
  }

  const isInRange = (year: number, quarter: number): boolean => {
    if (!value?.from || !value?.to) return false
    const date = getQuarterDate(year, quarter)
    return date >= startOfQuarter(value.from) && date <= endOfQuarter(value.to)
  }

  const isSelected = (year: number, quarter: number, type: 'from' | 'to'): boolean => {
    const target = type === 'from' ? value?.from : value?.to
    if (!target) return false
    return target.getFullYear() === year && Math.floor(target.getMonth() / 3) === quarter
  }

  const handleSelect = (year: number, quarter: number) => {
    const date = getQuarterDate(year, quarter)
    
    if (activeRange === 'start' || !value?.from) {
      onSelect({ from: date, to: value?.to })
    } else {
      onSelect({ from: value.from, to: endOfQuarter(date) })
    }
  }

  const renderYearPanel = (year: number, setYear: (y: number) => void) => (
    <div className="p-3 w-[200px]">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setYear(year - 1)}>{"<"}</Button>
        <span className="font-medium">{year}</span>
        <Button variant="ghost" size="sm" onClick={() => setYear(year + 1)}>{">"}</Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quarters.map((q) => {
          const disabled = disabledDate?.(getQuarterDate(year, q.value), { from: value?.from, type: activeRange })
          const inRange = isInRange(year, q.value)
          const isStart = isSelected(year, q.value, 'from')
          const isEnd = isSelected(year, q.value, 'to')
          
          return (
            <Button
              key={q.value}
              variant={(isStart || isEnd) ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              className={cn(
                "h-10",
                inRange && !isStart && !isEnd && "bg-primary/10 border-primary/20"
              )}
              onClick={() => handleSelect(year, q.value)}
            >
              {q.label}
            </Button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex">
      {renderYearPanel(viewYear, setViewYear)}
      <div className="border-l" />
      {renderYearPanel(viewYear2, setViewYear2)}
    </div>
  )
}

interface YearRangePickerPanelProps {
  value?: DateRange
  onSelect: (range: DateRange) => void
  disabledDate?: (date: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean
  activeRange: 'start' | 'end'
}

const YearRangePickerPanel: React.FC<YearRangePickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  activeRange,
}) => {
  const currentYear = new Date().getFullYear()
  const [startYear, setStartYear] = React.useState(() => {
    const targetYear = value?.from?.getFullYear() || currentYear
    return Math.floor(targetYear / 10) * 10
  })
  const [startYear2, setStartYear2] = React.useState(() => startYear + 10)

  const isInRange = (year: number): boolean => {
    if (!value?.from || !value?.to) return false
    return year >= value.from.getFullYear() && year <= value.to.getFullYear()
  }

  const handleSelect = (year: number) => {
    const date = new Date(year, 0, 1)
    
    if (activeRange === 'start' || !value?.from) {
      onSelect({ from: date, to: value?.to })
    } else {
      onSelect({ from: value.from, to: endOfYear(date) })
    }
  }

  const renderDecadePanel = (start: number, setStart: (s: number) => void) => {
    const years = Array.from({ length: 12 }, (_, i) => start - 1 + i)
    
    return (
      <div className="p-3 w-[220px]">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setStart(start - 10)}>{"<<"}</Button>
          <span className="font-medium">{start} - {start + 9}</span>
          <Button variant="ghost" size="sm" onClick={() => setStart(start + 10)}>{">>"}</Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => {
            const yearDate = new Date(year, 0, 1)
            const disabled = disabledDate?.(yearDate, { from: value?.from, type: activeRange })
            const inRange = isInRange(year)
            const isStart = value?.from?.getFullYear() === year
            const isEnd = value?.to?.getFullYear() === year
            const isOutOfRange = year < start || year > start + 9

            return (
              <Button
                key={year}
                variant={(isStart || isEnd) ? "default" : "outline"}
                size="sm"
                disabled={disabled}
                className={cn(
                  "h-9",
                  isOutOfRange && "text-muted-foreground",
                  inRange && !isStart && !isEnd && "bg-primary/10 border-primary/20"
                )}
                onClick={() => handleSelect(year)}
              >
                {year}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      {renderDecadePanel(startYear, setStartYear)}
      <div className="border-l" />
      {renderDecadePanel(startYear2, setStartYear2)}
    </div>
  )
}

interface MonthRangePickerPanelProps {
  value?: DateRange
  onSelect: (range: DateRange) => void
  disabledDate?: (date: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean
  activeRange: 'start' | 'end'
}

const MonthRangePickerPanel: React.FC<MonthRangePickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  activeRange,
}) => {
  const currentYear = new Date().getFullYear()
  const [viewYear, setViewYear] = React.useState(() => value?.from?.getFullYear() || currentYear)
  const [viewYear2, setViewYear2] = React.useState(() => value?.to?.getFullYear() || viewYear + 1)

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const isInRange = (year: number, month: number): boolean => {
    if (!value?.from || !value?.to) return false
    const date = new Date(year, month, 1)
    return date >= startOfMonth(value.from) && date <= endOfMonth(value.to)
  }

  const handleSelect = (year: number, month: number) => {
    const date = new Date(year, month, 1)
    
    if (activeRange === 'start' || !value?.from) {
      onSelect({ from: date, to: value?.to })
    } else {
      onSelect({ from: value.from, to: endOfMonth(date) })
    }
  }

  const renderYearPanel = (year: number, setYear: (y: number) => void) => (
    <div className="p-3 w-[220px]">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setYear(year - 1)}>{"<"}</Button>
        <span className="font-medium">{year}</span>
        <Button variant="ghost" size="sm" onClick={() => setYear(year + 1)}>{">"}</Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => {
          const monthDate = new Date(year, index, 1)
          const disabled = disabledDate?.(monthDate, { from: value?.from, type: activeRange })
          const inRange = isInRange(year, index)
          const isStart = value?.from?.getFullYear() === year && value?.from?.getMonth() === index
          const isEnd = value?.to?.getFullYear() === year && value?.to?.getMonth() === index

          return (
            <Button
              key={month}
              variant={(isStart || isEnd) ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              className={cn(
                "h-9",
                inRange && !isStart && !isEnd && "bg-primary/10 border-primary/20"
              )}
              onClick={() => handleSelect(year, index)}
            >
              {month}
            </Button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex">
      {renderYearPanel(viewYear, setViewYear)}
      <div className="border-l" />
      {renderYearPanel(viewYear2, setViewYear2)}
    </div>
  )
}

// ==================== Main DateRangePicker Component ====================

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  onCalendarChange,
  onPanelChange,
  onBlur,
  onFocus,
  onOpenChange,
  onOk,
  placeholder = ["Start date", "End date"],
  className,
  disabled = false,
  format: dateFormat,
  allowClear = true,
  allowEmpty = [false, false],
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
  separator,
  showTime = false,
  showNow = false,
  minDate,
  maxDate,
  order = true,
  inputReadOnly = false,
  readOnly = false,
  id,
  name,
  bordered = true,
  numberOfMonths = 2,
  renderExtraFooter,
  defaultPickerValue,
  // Note: pickerValue is reserved for future controlled panel navigation
  // pickerValue,
  align = "start",
  needConfirm,
}: DateRangePickerProps) {
  // Internal state
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<DateRange | undefined>(defaultValue)
  const [tempValue, setTempValue] = React.useState<DateRange | undefined>(undefined)
  const [activeRange, setActiveRange] = React.useState<'start' | 'end'>('start')
  const [startInputValue, setStartInputValue] = React.useState("")
  const [endInputValue, setEndInputValue] = React.useState("")
  const [activeTimePanel, setActiveTimePanel] = React.useState<'start' | 'end'>('start')
  
  const startInputRef = React.useRef<HTMLInputElement>(null)
  const endInputRef = React.useRef<HTMLInputElement>(null)

  // Controlled vs uncontrolled
  const isControlledOpen = controlledOpen !== undefined
  const isOpen = isControlledOpen ? controlledOpen : internalOpen
  const selectedRange = value !== undefined ? value : internalValue
  const displayRange = tempValue || selectedRange
  const resolvedFormat = dateFormat || getDefaultFormat(picker, showTime)
  
  // Disabled state handling
  const isStartDisabled = Array.isArray(disabled) ? disabled[0] : disabled
  const isEndDisabled = Array.isArray(disabled) ? disabled[1] : disabled
  const isFullyDisabled = isStartDisabled && isEndDisabled

  // Determine if we need confirm button
  const showConfirmButton = needConfirm !== undefined ? needConfirm : !!showTime

  // ShowTime options
  const showTimeConfig = typeof showTime === 'object' ? showTime : {}

  // Combine minDate/maxDate with disabledDate
  const disabledDate = React.useCallback((date: Date, info: { from?: Date; type: 'start' | 'end' }): boolean => {
    if (propDisabledDate?.(date, info)) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }, [propDisabledDate, minDate, maxDate])

  // Update input values when range changes
  React.useEffect(() => {
    const [fromStr, toStr] = formatDateRange(selectedRange, resolvedFormat)
    setStartInputValue(fromStr)
    setEndInputValue(toStr)
  }, [selectedRange, resolvedFormat])

  // Sync temp value when opening
  React.useEffect(() => {
    if (isOpen) {
      setTempValue(selectedRange)
    } else {
      setTempValue(undefined)
    }
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    if (isFullyDisabled || readOnly) return
    if (!isControlledOpen) {
      setInternalOpen(open)
    }
    onOpenChange?.(open)
    
    if (!open) {
      setActiveRange('start')
      setTempValue(undefined)
    }
  }

  const orderDates = (range: DateRange | undefined): DateRange | undefined => {
    if (!order || !range?.from || !range?.to) return range
    if (range.from > range.to) {
      return { from: range.to, to: range.from }
    }
    return range
  }

  const commitChange = (range: DateRange | undefined) => {
    const orderedRange = orderDates(range)
    const dateStrings = formatDateRange(orderedRange, resolvedFormat)
    
    if (value === undefined) {
      setInternalValue(orderedRange)
    }
    onChange?.(orderedRange, dateStrings)
    onPanelChange?.(orderedRange, [picker, picker])
  }

  const handleDateSelect = (range: DateRange | undefined, selectedDay: Date) => {
    // When we have a complete range and user clicks again, start new selection
    if (tempValue?.from && tempValue?.to) {
      const newRange = { from: selectedDay, to: undefined }
      setTempValue(newRange)
      setActiveRange('end')
      
      const dateStrings = formatDateRange(newRange, resolvedFormat)
      onCalendarChange?.(newRange, dateStrings, { range: 'start' })
      return
    }

    setTempValue(range)
    
    const dateStrings = formatDateRange(range, resolvedFormat)
    
    if (!tempValue?.from || activeRange === 'start') {
      setActiveRange('end')
      onCalendarChange?.(range, dateStrings, { range: 'start' })
    } else {
      onCalendarChange?.(range, dateStrings, { range: 'end' })
    }

    // Auto-close when both dates are selected (for date picker)
    if (range?.from && range?.to && picker === 'date' && !showTime) {
      // Small delay to show the selection before closing
      setTimeout(() => {
        commitChange(range)
        handleOpenChange(false)
      }, 100)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value === undefined) {
      setInternalValue(undefined)
    }
    onChange?.(undefined, ["", ""])
    setStartInputValue("")
    setEndInputValue("")
  }

  const handlePresetSelect = (presetValue: RangeValue | (() => RangeValue)) => {
    const rangeArray = typeof presetValue === 'function' ? presetValue() : presetValue
    const range: DateRange | undefined = rangeArray 
      ? { from: rangeArray[0], to: rangeArray[1] }
      : undefined
    
    setTempValue(range)
    if (!showConfirmButton) {
      commitChange(range)
      handleOpenChange(false)
    }
  }

  const handleConfirm = () => {
    if (!tempValue?.from && !allowEmpty[0]) return
    if (!tempValue?.to && !allowEmpty[1]) return
    
    commitChange(tempValue)
    onOk?.(tempValue)
    handleOpenChange(false)
  }

  const handleCancel = () => {
    setTempValue(undefined)
    handleOpenChange(false)
  }

  const handleNowClick = () => {
    const now = new Date()
    if (activeRange === 'start') {
      const newRange = { from: now, to: tempValue?.to }
      setTempValue(newRange)
    } else {
      const newRange = { from: tempValue?.from, to: now }
      setTempValue(newRange)
    }
  }

  const handleStartTimeChange = (time: Date) => {
    if (!tempValue?.from) {
      // If no date selected, use today
      const newDate = setHours(
        setMinutes(
          setSeconds(new Date(), time.getSeconds()),
          time.getMinutes()
        ),
        time.getHours()
      )
      newDate.setMilliseconds(0)
      setTempValue({ from: newDate, to: tempValue?.to })
    } else {
      const newFrom = setHours(
        setMinutes(
          setSeconds(tempValue.from, time.getSeconds()),
          time.getMinutes()
        ),
        time.getHours()
      )
      setTempValue({ from: newFrom, to: tempValue?.to })
    }
  }

  const handleEndTimeChange = (time: Date) => {
    if (!tempValue?.to) {
      // If no date selected, use today
      const newDate = setHours(
        setMinutes(
          setSeconds(new Date(), time.getSeconds()),
          time.getMinutes()
        ),
        time.getHours()
      )
      newDate.setMilliseconds(0)
      setTempValue({ from: tempValue?.from, to: newDate })
    } else {
      const newTo = setHours(
        setMinutes(
          setSeconds(tempValue.to, time.getSeconds()),
          time.getMinutes()
        ),
        time.getHours()
      )
      setTempValue({ from: tempValue?.from, to: newTo })
    }
  }

  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setStartInputValue(newValue)
    
    const parsedDate = parse(newValue, resolvedFormat, new Date())
    if (isValid(parsedDate) && !disabledDate(parsedDate, { type: 'start' })) {
      const newRange = { from: parsedDate, to: tempValue?.to || selectedRange?.to }
      setTempValue(newRange)
      onCalendarChange?.(newRange, formatDateRange(newRange, resolvedFormat), { range: 'start' })
    }
  }

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEndInputValue(newValue)
    
    const parsedDate = parse(newValue, resolvedFormat, new Date())
    if (isValid(parsedDate) && !disabledDate(parsedDate, { from: tempValue?.from, type: 'end' })) {
      const newRange = { from: tempValue?.from || selectedRange?.from, to: parsedDate }
      setTempValue(newRange)
      onCalendarChange?.(newRange, formatDateRange(newRange, resolvedFormat), { range: 'end' })
    }
  }

  const handleInputBlur = (type: 'start' | 'end') => (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e, { range: type })
    // Reset input if invalid
    const [fromStr, toStr] = formatDateRange(selectedRange, resolvedFormat)
    if (type === 'start') setStartInputValue(fromStr)
    else setEndInputValue(toStr)
  }

  const handleInputFocus = (type: 'start' | 'end') => (e: React.FocusEvent<HTMLInputElement>) => {
    setActiveRange(type)
    onFocus?.(e, { range: type })
  }

  // Render clear icon
  const renderClearIcon = () => {
    if (!allowClear || (!selectedRange?.from && !selectedRange?.to) || isFullyDisabled || readOnly) {
      return null
    }
    
    const clearIcon = typeof allowClear === 'object' && allowClear.clearIcon 
      ? allowClear.clearIcon 
      : <X className="h-3 w-3" />

    return (
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center cursor-pointer transition-opacity z-10"
        onClick={handleClear}
        aria-label="Clear range"
      >
        {clearIcon}
      </div>
    )
  }

  // Render separator
  const renderSeparator = () => {
    return separator || <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mx-1" />
  }

  // Render the picker panel
  const renderPanel = () => {
    switch (picker) {
      case "year":
        return (
          <YearRangePickerPanel
            value={displayRange}
            onSelect={(range) => {
              setTempValue(range)
              if (range.from && range.to && !showConfirmButton) {
                commitChange(range)
                handleOpenChange(false)
              }
            }}
            disabledDate={disabledDate}
            activeRange={activeRange}
          />
        )
      case "quarter":
        return (
          <QuarterRangePickerPanel
            value={displayRange}
            onSelect={(range) => {
              setTempValue(range)
              if (range.from && range.to && !showConfirmButton) {
                commitChange(range)
                handleOpenChange(false)
              }
            }}
            disabledDate={disabledDate}
            activeRange={activeRange}
          />
        )
      case "month":
        return (
          <MonthRangePickerPanel
            value={displayRange}
            onSelect={(range) => {
              setTempValue(range)
              if (range.from && range.to && !showConfirmButton) {
                commitChange(range)
                handleOpenChange(false)
              }
            }}
            disabledDate={disabledDate}
            activeRange={activeRange}
          />
        )
      case "week":
      case "date":
      default:
        return (
          <div className="flex flex-col">
            <Calendar
              mode="range"
              selected={displayRange}
              onSelect={handleDateSelect}
              disabled={(date) => disabledDate(date, { from: displayRange?.from, type: activeRange })}
              defaultMonth={defaultPickerValue?.[0] || displayRange?.from}
              numberOfMonths={numberOfMonths}
              showWeekNumber={picker === "week"}
              initialFocus
            />
            {showTime && (
              <div className="border-t">
                <div className="flex items-center justify-center gap-2 py-2 border-b bg-muted/30">
                  <Button
                    variant={activeTimePanel === 'start' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTimePanel('start')}
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Start Time
                  </Button>
                  <Button
                    variant={activeTimePanel === 'end' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTimePanel('end')}
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    End Time
                  </Button>
                </div>
                <div className="flex justify-center">
                  {activeTimePanel === 'start' ? (
                    <TimePanel
                      value={displayRange?.from}
                      onChange={handleStartTimeChange}
                      showHour={showTimeConfig.showHour ?? true}
                      showMinute={showTimeConfig.showMinute ?? true}
                      showSecond={showTimeConfig.showSecond ?? true}
                      use12Hours={showTimeConfig.use12Hours}
                      hourStep={showTimeConfig.hourStep}
                      minuteStep={showTimeConfig.minuteStep}
                      secondStep={showTimeConfig.secondStep}
                      hideDisabledOptions={showTimeConfig.hideDisabledOptions}
                      disabledTime={disabledTime ? () => disabledTime(displayRange?.from || null, 'start') : undefined}
                    />
                  ) : (
                    <TimePanel
                      value={displayRange?.to}
                      onChange={handleEndTimeChange}
                      showHour={showTimeConfig.showHour ?? true}
                      showMinute={showTimeConfig.showMinute ?? true}
                      showSecond={showTimeConfig.showSecond ?? true}
                      use12Hours={showTimeConfig.use12Hours}
                      hourStep={showTimeConfig.hourStep}
                      minuteStep={showTimeConfig.minuteStep}
                      secondStep={showTimeConfig.secondStep}
                      hideDisabledOptions={showTimeConfig.hideDisabledOptions}
                      disabledTime={disabledTime ? () => disabledTime(displayRange?.to || null, 'end') : undefined}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  const sizeClasses = getSizeClasses(size)
  const variantClasses = !bordered ? "border-transparent" : getVariantClasses(variant, status)

  return (
    <div className={cn("grid gap-2", className)}>
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
            <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={startInputRef}
              id={id?.start}
              name={name ? `${name}_start` : undefined}
              type="text"
              value={startInputValue}
              onChange={handleStartInputChange}
              onBlur={handleInputBlur('start')}
              onFocus={handleInputFocus('start')}
              placeholder={placeholder[0]}
              disabled={isStartDisabled}
              readOnly={inputReadOnly || readOnly}
              className={cn(
                "flex-1 bg-transparent outline-none border-none ml-2 min-w-0 w-24",
                "placeholder:text-muted-foreground text-center",
                isStartDisabled && "cursor-not-allowed",
                activeRange === 'start' && isOpen && "text-primary"
              )}
            />
            {renderSeparator()}
            <input
              ref={endInputRef}
              id={id?.end}
              name={name ? `${name}_end` : undefined}
              type="text"
              value={endInputValue}
              onChange={handleEndInputChange}
              onBlur={handleInputBlur('end')}
              onFocus={handleInputFocus('end')}
              placeholder={placeholder[1]}
              disabled={isEndDisabled}
              readOnly={inputReadOnly || readOnly}
              className={cn(
                "flex-1 bg-transparent outline-none border-none min-w-0 w-24",
                "placeholder:text-muted-foreground text-center",
                isEndDisabled && "cursor-not-allowed",
                activeRange === 'end' && isOpen && "text-primary"
              )}
            />
            {renderClearIcon()}
            <div className="ml-1 text-muted-foreground shrink-0">
              {suffixIcon || <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align={align || getPlacementAlign(placement)}
          side={placement.startsWith("top") ? "top" : "bottom"}
        >
          <div className="flex">
            {presets && presets.length > 0 && (
              <div className="border-r py-3 px-2 w-[150px] max-h-[400px] overflow-auto">
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
              <div className="p-0">
                {renderPanel()}
              </div>
              {(showConfirmButton || showNow || renderExtraFooter) && (
                <div className="border-t p-3 flex items-center justify-between gap-2 bg-muted/10">
                  <div className="flex-1">
                    {renderExtraFooter?.()}
                  </div>
                  <div className="flex gap-2 items-center">
                    {showNow && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-primary h-auto p-0"
                        onClick={handleNowClick}
                      >
                        Now
                      </Button>
                    )}
                    {showConfirmButton && (
                      <>
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleConfirm}
                          disabled={(!tempValue?.from && !allowEmpty[0]) || (!tempValue?.to && !allowEmpty[1])}
                        >
                          OK
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ==================== Preset Helpers ====================

export const rangePresets = {
  today: (): RangeValue => [new Date(), new Date()],
  yesterday: (): RangeValue => {
    const yesterday = addDays(new Date(), -1)
    return [yesterday, yesterday]
  },
  last7Days: (): RangeValue => [addDays(new Date(), -6), new Date()],
  last14Days: (): RangeValue => [addDays(new Date(), -13), new Date()],
  last30Days: (): RangeValue => [addDays(new Date(), -29), new Date()],
  last90Days: (): RangeValue => [addDays(new Date(), -89), new Date()],
  thisWeek: (): RangeValue => [startOfWeek(new Date()), endOfWeek(new Date())],
  lastWeek: (): RangeValue => {
    const lastWeekStart = startOfWeek(addDays(new Date(), -7))
    return [lastWeekStart, endOfWeek(lastWeekStart)]
  },
  thisMonth: (): RangeValue => [startOfMonth(new Date()), endOfMonth(new Date())],
  lastMonth: (): RangeValue => {
    const lastMonthStart = startOfMonth(addMonths(new Date(), -1))
    return [lastMonthStart, endOfMonth(lastMonthStart)]
  },
  thisQuarter: (): RangeValue => [startOfQuarter(new Date()), endOfQuarter(new Date())],
  thisYear: (): RangeValue => [startOfYear(new Date()), endOfYear(new Date())],
  lastYear: (): RangeValue => {
    const lastYearStart = startOfYear(addYears(new Date(), -1))
    return [lastYearStart, endOfYear(lastYearStart)]
  },
}

// ==================== Common Presets Configuration ====================

export const defaultRangePresets: RangePickerPreset[] = [
  { label: "Today", value: rangePresets.today },
  { label: "Yesterday", value: rangePresets.yesterday },
  { label: "Last 7 Days", value: rangePresets.last7Days },
  { label: "Last 14 Days", value: rangePresets.last14Days },
  { label: "Last 30 Days", value: rangePresets.last30Days },
  { label: "Last 90 Days", value: rangePresets.last90Days },
  { label: "This Month", value: rangePresets.thisMonth },
  { label: "Last Month", value: rangePresets.lastMonth },
]
