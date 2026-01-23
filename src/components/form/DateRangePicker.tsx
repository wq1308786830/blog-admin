import * as React from 'react';
import {
  format,
  isValid,
  parse,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  addDays,
  addMonths,
  addYears,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  X,
  ArrowRight,
  ChevronDown,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimePanel, type DisabledTime } from './TimePicker';

// ==================== Types ====================

export type RangePickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year';
export type RangePickerSize = 'small' | 'middle' | 'large';
export type RangePickerStatus = 'error' | 'warning';
export type RangePickerVariant = 'outlined' | 'filled' | 'borderless' | 'underlined';
export type RangePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export type RangeValue = [Date | undefined, Date | undefined] | undefined;

export interface RangePickerPreset {
  label: React.ReactNode;
  value: RangeValue | (() => RangeValue);
}

export interface ShowTimeOptions {
  format?: string;
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  defaultOpenValue?: Date;
  hideDisabledOptions?: boolean;
}

// Semantic DOM types for classNames and styles
export type RangePickerSemanticDOM =
  | 'input'
  | 'popup'
  | 'panel'
  | 'separator'
  | 'prefix'
  | 'suffix';

export interface CellRenderInfo {
  originNode: React.ReactNode;
  today: Date;
  range?: 'start' | 'end';
  type: RangePickerMode;
  locale?: any;
  subType?: 'hour' | 'minute' | 'second' | 'meridiem';
}

export interface DateRangePickerProps {
  /** The selected range */
  value?: DateRange;
  /** Default range value */
  defaultValue?: DateRange;
  /** Callback when range is selected */
  onChange?: (dates: DateRange | undefined, dateStrings: [string, string]) => void;
  /** Callback fired when start or end date is changing */
  onCalendarChange?: (
    dates: DateRange | undefined,
    dateStrings: [string, string],
    info: { range: 'start' | 'end' }
  ) => void;
  /** Callback when picker panel changes */
  onPanelChange?: (dates: DateRange | undefined, mode: [RangePickerMode, RangePickerMode]) => void;
  /** Callback when input loses focus */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>, info: { range: 'start' | 'end' }) => void;
  /** Callback when input gains focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>, info: { range: 'start' | 'end' }) => void;
  /** Callback when popup visibility changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when OK button is clicked */
  onOk?: (dates: DateRange | undefined) => void;
  /** Placeholder for start and end */
  placeholder?: [string, string];
  /** Custom class name */
  className?: string;
  /** Whether to picker is disabled (can be [boolean, boolean] for each input) */
  disabled?: boolean | [boolean, boolean];
  /** Format string for displaying dates */
  format?: string;
  /** Whether to show clear button */
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  /** Allow empty start or end */
  allowEmpty?: [boolean, boolean];
  /** Preset ranges for quick selection */
  presets?: RangePickerPreset[];
  /** Function to determine if a date should be disabled */
  disabledDate?: (current: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean;
  /** Function to determine if a time should be disabled */
  disabledTime?: (date: Date | null, type: 'start' | 'end') => DisabledTime;
  /** The type of picker */
  picker?: RangePickerMode;
  /** Size of the picker */
  size?: RangePickerSize;
  /** Status of the picker */
  status?: RangePickerStatus;
  /** Variant style */
  variant?: RangePickerVariant;
  /** Popover placement */
  placement?: RangePickerPlacement;
  /** Whether to popup is visible (controlled) */
  open?: boolean;
  /** Initial open state of picker */
  defaultOpen?: boolean;
  /** Custom suffix icon */
  suffixIcon?: React.ReactNode;
  /** Custom separator */
  separator?: React.ReactNode;
  /** Whether to show time picker */
  showTime?: boolean | ShowTimeOptions;
  /** Whether to show "Now" button */
  showNow?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Whether to order dates automatically */
  order?: boolean;
  /** Whether to input is read-only */
  inputReadOnly?: boolean;
  /** Whether to picker is read-only */
  readOnly?: boolean;
  /** ID for inputs */
  id?: { start?: string; end?: string };
  /** Name attribute */
  name?: string;
  /** Whether to enable bordered style */
  bordered?: boolean;
  /** Number of months to display */
  numberOfMonths?: number;
  /** Render extra footer in panel */
  renderExtraFooter?: () => React.ReactNode;
  /** Default panel date */
  defaultPickerValue?: [Date | undefined, Date | undefined];
  /** Panel date (controlled) */
  pickerValue?: [Date | undefined, Date | undefined];
  /** Align the popover */
  align?: 'center' | 'start' | 'end';
  /** Whether need confirm button */
  needConfirm?: boolean;
  /** Custom prefix icon */
  prefix?: React.ReactNode;
  /** Custom semantic DOM class names (object or function) */
  classNames?:
    | Partial<Record<RangePickerSemanticDOM, string>>
    | ((props: DateRangePickerProps) => Partial<Record<RangePickerSemanticDOM, string>>);
  /** Custom semantic DOM inline styles (object or function) */
  styles?:
    | Partial<Record<RangePickerSemanticDOM, React.CSSProperties>>
    | ((
        props: DateRangePickerProps
      ) => Partial<Record<RangePickerSemanticDOM, React.CSSProperties>>);
  /** Custom popup className (deprecated, use classNames.popup instead) */
  popupClassName?: string;
  /** Custom popup style (deprecated, use styles.popup instead) */
  popupStyle?: React.CSSProperties;
  /** Custom prev icon */
  prevIcon?: React.ReactNode;
  /** Custom next icon */
  nextIcon?: React.ReactNode;
  /** Custom super prev icon */
  superPrevIcon?: React.ReactNode;
  /** Custom super next icon */
  superNextIcon?: React.ReactNode;
  /** Custom rendering function for picker cells */
  cellRender?: (current: Date, info: CellRenderInfo) => React.ReactNode;
  /** Custom rendering function for date cells (deprecated, use cellRender instead) */
  dateRender?: (current: Date, today: Date) => React.ReactNode;
  /** Not clean input on blur even when typing is invalid */
  preserveInvalidOnBlur?: boolean;
  /** When user selects date hover option, value of input field undergoes a temporary change */
  previewValue?: boolean | 'hover';
  /** Show week info when in week picker */
  showWeek?: boolean;
}

// ==================== Helper Functions ====================

const getDefaultFormat = (picker: RangePickerMode, showTime?: boolean | object): string => {
  switch (picker) {
    case 'year':
      return 'yyyy';
    case 'quarter':
      return "yyyy-'Q'Q";
    case 'month':
      return 'yyyy-MM';
    case 'week':
      return "yyyy-'W'ww";
    case 'date':
    default:
      return showTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
  }
};

const getSizeClasses = (size: RangePickerSize): string => {
  switch (size) {
    case 'small':
      return 'h-7 text-xs';
    case 'large':
      return 'h-11 text-base';
    case 'middle':
    default:
      return 'h-9 text-sm';
  }
};

const getVariantClasses = (variant: RangePickerVariant, status?: RangePickerStatus): string => {
  const statusClasses =
    status === 'error'
      ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20'
      : status === 'warning'
      ? 'border-yellow-500 focus-within:border-yellow-500 focus-within:ring-yellow-500/20'
      : '';

  switch (variant) {
    case 'filled':
      return cn('bg-muted border-transparent hover:bg-muted/80', statusClasses);
    case 'borderless':
      return cn('border-transparent shadow-none hover:bg-accent', statusClasses);
    case 'underlined':
      return cn('border-t-0 border-x-0 border-b-2 rounded-none', statusClasses);
    case 'outlined':
    default:
      return cn('border-input', statusClasses);
  }
};

const getPlacementAlign = (placement: RangePickerPlacement): 'start' | 'center' | 'end' => {
  if (placement.includes('Left')) return 'start';
  if (placement.includes('Right')) return 'end';
  return 'start';
};

const formatDateRange = (range: DateRange | undefined, dateFormat: string): [string, string] => {
  const fromStr = range?.from && isValid(range.from) ? format(range.from, dateFormat) : '';
  const toStr = range?.to && isValid(range.to) ? format(range.to, dateFormat) : '';
  return [fromStr, toStr];
};

const getSemanticClassNames = (
  props: DateRangePickerProps,
  active: boolean
): Partial<Record<RangePickerSemanticDOM, string>> => {
  const classNamesValue =
    typeof props.classNames === 'function' ? props.classNames(props) : props.classNames || {};

  return {
    input: cn(
      'inline-flex items-center border rounded-md relative group cursor-pointer transition-colors px-3',
      getSizeClasses(props.size || 'middle'),
      props.bordered ? '' : getVariantClasses(props.variant || 'outlined', props.status),
      props.className
    ),
    popup: cn('w-auto p-0', active && classNamesValue.popup, props.popupClassName),
    panel: classNamesValue.panel,
    separator: classNamesValue.separator,
    prefix: classNamesValue.prefix,
    suffix: classNamesValue.suffix,
  };
};

const getSemanticStyles = (
  props: DateRangePickerProps
): Partial<Record<RangePickerSemanticDOM, React.CSSProperties>> => {
  const stylesValue = typeof props.styles === 'function' ? props.styles(props) : props.styles || {};

  return {
    input: stylesValue.input,
    popup: { ...stylesValue.popup, ...(props.popupStyle || {}) },
    panel: stylesValue.panel,
    separator: stylesValue.separator,
    prefix: stylesValue.prefix,
    suffix: stylesValue.suffix,
  };
};

// ==================== Sub Components ====================

interface QuarterRangePickerPanelProps {
  value?: DateRange;
  onSelect: (range: DateRange) => void;
  disabledDate?: (date: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean;
  activeRange: 'start' | 'end';
  cellRender?: (current: Date, info: CellRenderInfo) => React.ReactNode;
  dateRender?: (current: Date, today: Date) => React.ReactNode;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
}

const QuarterRangePickerPanel: React.FC<QuarterRangePickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  activeRange,
  cellRender,
  dateRender,
  prevIcon,
  nextIcon,
  superPrevIcon,
  superNextIcon,
}) => {
  const currentYear = new Date().getFullYear();
  const [viewYear, setViewYear] = React.useState(() => {
    return value?.from?.getFullYear() || currentYear;
  });
  const [viewYear2, setViewYear2] = React.useState(() => {
    return value?.to?.getFullYear() || viewYear + 1;
  });

  const quarters = [
    { label: 'Q1', value: 0 },
    { label: 'Q2', value: 1 },
    { label: 'Q3', value: 2 },
    { label: 'Q4', value: 3 },
  ];

  const getQuarterDate = (year: number, quarter: number): Date => {
    return new Date(year, quarter * 3, 1);
  };

  const isInRange = (year: number, quarter: number): boolean => {
    if (!value?.from || !value?.to) return false;
    const date = getQuarterDate(year, quarter);
    return date >= startOfQuarter(value.from) && date <= endOfQuarter(value.to);
  };

  const isSelected = (year: number, quarter: number, type: 'from' | 'to'): boolean => {
    const target = type === 'from' ? value?.from : value?.to;
    if (!target) return false;
    return target.getFullYear() === year && Math.floor(target.getMonth() / 3) === quarter;
  };

  const handleSelect = (year: number, quarter: number) => {
    const date = getQuarterDate(year, quarter);

    if (activeRange === 'start' || !value?.from) {
      onSelect({ from: date, to: value?.to });
    } else {
      onSelect({ from: value.from, to: endOfQuarter(date) });
    }
  };

  const renderCell = (year: number, quarter: number): React.ReactNode => {
    const date = getQuarterDate(year, quarter);
    const inRange = isInRange(year, quarter);
    const isStart = isSelected(year, quarter, 'from');
    const isEnd = isSelected(year, quarter, 'to');

    // Use cellRender if provided
    if (cellRender) {
      return cellRender(date, {
        originNode: (
          <span
            className={cn(
              'h-10',
              inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20'
            )}
          >
            {quarter + 1}
          </span>
        ),
        today: new Date(),
        range: isStart ? 'start' : isEnd ? 'end' : undefined,
        type: 'quarter',
      });
    }

    // Use dateRender if provided (deprecated)
    if (dateRender) {
      return dateRender(date, new Date());
    }

    return (
      <span
        className={cn('h-10', inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20')}
      >
        {quarter + 1}
      </span>
    );
  };

  const renderYearPanel = (year: number, setYear: (y: number) => void) => (
    <div className="p-3 w-[200px]">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setYear(year - 10)}>
          {superPrevIcon || <ChevronsLeft className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setYear(year - 1)}>
          {prevIcon || <ChevronLeft className="h-3 w-3" />}
        </Button>
        <span className="font-medium">{year}</span>
        <Button variant="ghost" size="sm" onClick={() => setYear(year + 1)}>
          {nextIcon || <ChevronRight className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setYear(year + 10)}>
          {superNextIcon || <ChevronsRight className="h-3 w-3" />}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quarters.map((q) => {
          const quarterDate = getQuarterDate(year, q.value);
          const isCellDisabled = disabledDate?.(quarterDate, {
            from: value?.from,
            type: activeRange,
          });
          const inRange = isInRange(year, q.value);
          const isStart = isSelected(year, q.value, 'from');
          const isEnd = isSelected(year, q.value, 'to');

          return (
            <Button
              key={q.value}
              variant={isStart || isEnd ? 'default' : 'outline'}
              size="sm"
              disabled={isCellDisabled}
              className={cn(
                'h-10',
                inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20'
              )}
              onClick={() => handleSelect(year, q.value)}
            >
              {renderCell(year, q.value)}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex">
      {renderYearPanel(viewYear, setViewYear)}
      <div className="border-l" />
      {renderYearPanel(viewYear2, setViewYear2)}
    </div>
  );
};

interface YearRangePickerPanelProps {
  value?: DateRange;
  onSelect: (range: DateRange) => void;
  disabledDate?: (date: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean;
  activeRange: 'start' | 'end';
  cellRender?: (current: Date, info: CellRenderInfo) => React.ReactNode;
  dateRender?: (current: Date, today: Date) => React.ReactNode;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
}

const YearRangePickerPanel: React.FC<YearRangePickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  activeRange,
  cellRender,
  dateRender,
  prevIcon,
  nextIcon,
  superPrevIcon,
  superNextIcon,
}) => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = React.useState(() => {
    const targetYear = value?.from?.getFullYear() || currentYear;
    return Math.floor(targetYear / 10) * 10;
  });
  const [startYear2, setStartYear2] = React.useState(() => startYear + 10);

  const isInRange = (year: number): boolean => {
    if (!value?.from || !value?.to) return false;
    return year >= value.from.getFullYear() && year <= value.to.getFullYear();
  };

  const handleSelect = (year: number) => {
    const date = new Date(year, 0, 1);

    if (activeRange === 'start' || !value?.from) {
      onSelect({ from: date, to: value?.to });
    } else {
      onSelect({ from: value.from, to: endOfYear(date) });
    }
  };

  const renderCell = (year: number): React.ReactNode => {
    const date = new Date(year, 0, 1);
    const inRange = isInRange(year);
    const isStart = value?.from?.getFullYear() === year;
    const isEnd = value?.to?.getFullYear() === year;

    // Use cellRender if provided
    if (cellRender) {
      return cellRender(date, {
        originNode: (
          <span
            className={cn(
              'h-9',
              inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20'
            )}
          >
            {year}
          </span>
        ),
        today: new Date(),
        range: isStart ? 'start' : isEnd ? 'end' : undefined,
        type: 'year',
      });
    }

    // Use dateRender if provided (deprecated)
    if (dateRender) {
      return dateRender(date, new Date());
    }

    return (
      <span
        className={cn('h-9', inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20')}
      >
        {year}
      </span>
    );
  };

  const renderDecadePanel = (start: number, setStart: (s: number) => void) => {
    const years = Array.from({ length: 12 }, (_, i) => start - 1 + i);

    return (
      <div className="p-3 w-[220px]">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setStart(start - 10)}>
            {superPrevIcon || <ChevronsLeft className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStart(start - 1)}>
            {prevIcon || <ChevronLeft className="h-3 w-3" />}
          </Button>
          <span className="font-medium">
            {start} - {start + 9}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setStart(start + 1)}>
            {nextIcon || <ChevronRight className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStart(start + 10)}>
            {superNextIcon || <ChevronsRight className="h-3 w-3" />}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => {
            const yearDate = new Date(year, 0, 1);
            const isCellDisabled = disabledDate?.(yearDate, {
              from: value?.from,
              type: activeRange,
            });
            const inRange = isInRange(year);
            const isStart = value?.from?.getFullYear() === year;
            const isEnd = value?.to?.getFullYear() === year;
            const isOutOfRange = year < start || year > start + 9;

            return (
              <Button
                key={year}
                variant={isStart || isEnd ? 'default' : 'outline'}
                size="sm"
                disabled={isCellDisabled}
                className={cn(
                  'h-9',
                  isOutOfRange && 'text-muted-foreground',
                  inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20'
                )}
                onClick={() => handleSelect(year)}
              >
                {renderCell(year)}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      {renderDecadePanel(startYear, setStartYear)}
      <div className="border-l" />
      {renderDecadePanel(startYear2, setStartYear2)}
    </div>
  );
};

interface MonthRangePickerPanelProps {
  value?: DateRange;
  onSelect: (range: DateRange) => void;
  disabledDate?: (date: Date, info: { from?: Date; type: 'start' | 'end' }) => boolean;
  activeRange: 'start' | 'end';
  cellRender?: (current: Date, info: CellRenderInfo) => React.ReactNode;
  dateRender?: (current: Date, today: Date) => React.ReactNode;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
}

const MonthRangePickerPanel: React.FC<MonthRangePickerPanelProps> = ({
  value,
  onSelect,
  disabledDate,
  activeRange,
  cellRender,
  dateRender,
  prevIcon,
  nextIcon,
  superPrevIcon,
  superNextIcon,
}) => {
  const currentYear = new Date().getFullYear();
  const [viewYear, setViewYear] = React.useState(() => value?.from?.getFullYear() || currentYear);
  const [viewYear2, setViewYear2] = React.useState(() => value?.to?.getFullYear() || viewYear + 1);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const isInRange = (year: number, month: number): boolean => {
    if (!value?.from || !value?.to) return false;
    const date = new Date(year, month, 1);
    return date >= startOfMonth(value.from) && date <= endOfMonth(value.to);
  };

  const handleSelect = (year: number, month: number) => {
    const date = new Date(year, month, 1);

    if (activeRange === 'start' || !value?.from) {
      onSelect({ from: date, to: value?.to });
    } else {
      onSelect({ from: value.from, to: endOfMonth(date) });
    }
  };

  const renderCell = (year: number, month: number): React.ReactNode => {
    const monthDate = new Date(year, month, 1);
    const inRange = isInRange(year, month);
    const isStart = value?.from?.getFullYear() === year && value?.from?.getMonth() === month;
    const isEnd = value?.to?.getFullYear() === year && value?.to?.getMonth() === month;

    // Use cellRender if provided
    if (cellRender) {
      return cellRender(monthDate, {
        originNode: (
          <span
            className={cn(
              'h-9',
              inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20'
            )}
          >
            {month + 1}
          </span>
        ),
        today: new Date(),
        range: isStart ? 'start' : isEnd ? 'end' : undefined,
        type: 'month',
      });
    }

    // Use dateRender if provided (deprecated)
    if (dateRender) {
      return dateRender(monthDate, new Date());
    }

    return (
      <span
        className={cn('h-9', inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20')}
      >
        {month + 1}
      </span>
    );
  };

  const renderYearPanel = (year: number, setYear: (y: number) => void) => (
    <div className="p-3 w-[220px]">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setYear(year - 10)}>
          {superPrevIcon || <ChevronsLeft className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setYear(year - 1)}>
          {prevIcon || <ChevronLeft className="h-3 w-3" />}
        </Button>
        <span className="font-medium">{year}</span>
        <Button variant="ghost" size="sm" onClick={() => setYear(year + 1)}>
          {nextIcon || <ChevronRight className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setYear(year + 10)}>
          {superNextIcon || <ChevronsRight className="h-3 w-3" />}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => {
          const monthDate = new Date(year, index, 1);
          const isCellDisabled = disabledDate?.(monthDate, {
            from: value?.from,
            type: activeRange,
          });
          const inRange = isInRange(year, index);
          const isStart = value?.from?.getFullYear() === year && value?.from?.getMonth() === index;
          const isEnd = value?.to?.getFullYear() === year && value?.to?.getMonth() === index;

          return (
            <Button
              key={month}
              variant={isStart || isEnd ? 'default' : 'outline'}
              size="sm"
              disabled={isCellDisabled}
              className={cn(
                'h-9',
                inRange && !isStart && !isEnd && 'bg-primary/10 border-primary/20'
              )}
              onClick={() => handleSelect(year, index)}
            >
              {renderCell(year, index)}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex">
      {renderYearPanel(viewYear, setViewYear)}
      <div className="border-l" />
      {renderYearPanel(viewYear2, setViewYear2)}
    </div>
  );
};

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
  placeholder = ['Start date', 'End date'],
  className,
  disabled = false,
  format: dateFormat,
  allowClear = true,
  allowEmpty = [false, false],
  presets,
  disabledDate: propDisabledDate,
  disabledTime,
  picker = 'date',
  size = 'middle',
  status,
  variant = 'outlined',
  placement = 'bottomLeft',
  open: controlledOpen,
  defaultOpen: propDefaultOpen,
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
  pickerValue: propPickerValue,
  align = 'start',
  needConfirm,
  prefix,
  classNames,
  styles,
  popupClassName,
  popupStyle,
  prevIcon,
  nextIcon,
  superPrevIcon,
  superNextIcon,
  cellRender,
  dateRender,
  preserveInvalidOnBlur = false,
  previewValue = false,
  showWeek = false,
}: DateRangePickerProps) {
  // Internal state
  const [internalOpen, setInternalOpen] = React.useState(propDefaultOpen || false);
  const [internalValue, setInternalValue] = React.useState<DateRange | undefined>(defaultValue);
  const [tempValue, setTempValue] = React.useState<DateRange | undefined>(undefined);
  const [activeRange, setActiveRange] = React.useState<'start' | 'end'>('start');
  const [startInputValue, setStartInputValue] = React.useState('');
  const [endInputValue, setEndInputValue] = React.useState('');
  const [activeTimePanel, setActiveTimePanel] = React.useState<'start' | 'end'>('start');
  const [hoverPreviewValue, setHoverPreviewValue] = React.useState<string | null>(null);

  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);

  // Controlled vs uncontrolled
  const isControlledOpen = controlledOpen !== undefined;
  const isOpen = isControlledOpen ? controlledOpen : internalOpen;
  const selectedRange = value !== undefined ? value : internalValue;
  const displayRange = tempValue || selectedRange;
  const resolvedFormat = dateFormat || getDefaultFormat(picker, showTime);

  // Semantic class names and styles
  const semanticClassNames = getSemanticClassNames(
    {
      className,
      classNames,
      size,
      status,
      variant,
      popupClassName,
      pickerValue: propPickerValue,
      bordered,
    },
    isOpen
  );
  const semanticStyles = getSemanticStyles({
    styles,
    popupStyle,
    className,
    classNames,
    popupClassName,
    pickerValue: propPickerValue,
    bordered,
  });

  // Disabled state handling
  const isStartDisabled = Array.isArray(disabled) ? disabled[0] : disabled;
  const isEndDisabled = Array.isArray(disabled) ? disabled[1] : disabled;
  const isFullyDisabled = isStartDisabled && isEndDisabled;

  // Determine if we need confirm button
  const showConfirmButton = needConfirm !== undefined ? needConfirm : !!showTime;

  // ShowTime options
  const showTimeConfig = typeof showTime === 'object' ? showTime : {};

  // Combine minDate/maxDate with disabledDate
  const disabledDate = React.useCallback(
    (date: Date, info: { from?: Date; type: 'start' | 'end' }): boolean => {
      if (propDisabledDate?.(date, info)) return true;
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [propDisabledDate, minDate, maxDate]
  );

  // Update input values when range changes
  React.useEffect(() => {
    const [fromStr, toStr] = formatDateRange(selectedRange, resolvedFormat);
    setStartInputValue(fromStr);
    setEndInputValue(toStr);
  }, [selectedRange, resolvedFormat]);

  // Update input values when tempValue changes (during selection)
  React.useEffect(() => {
    if (isOpen) {
      const [fromStr, toStr] = formatDateRange(tempValue || selectedRange, resolvedFormat);
      setStartInputValue(fromStr);
      setEndInputValue(toStr);
    }
  }, [tempValue, resolvedFormat, isOpen, selectedRange]);

  // Sync temp value when opening
  React.useEffect(() => {
    if (isOpen) {
      setTempValue(selectedRange);
    } else {
      setTempValue(undefined);
      setHoverPreviewValue(null);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (isFullyDisabled || readOnly) return;
    if (!isControlledOpen) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);

    if (!open) {
      setActiveRange('start');
      setTempValue(undefined);
      setHoverPreviewValue(null);
    }
  };

  const orderDates = (range: DateRange | undefined): DateRange | undefined => {
    if (!order || !range?.from || !range?.to) return range;
    if (range.from > range.to) {
      return { from: range.to, to: range.from };
    }
    return range;
  };

  const commitChange = (range: DateRange | undefined) => {
    const orderedRange = orderDates(range);
    const dateStrings = formatDateRange(orderedRange, resolvedFormat);

    if (value === undefined) {
      setInternalValue(orderedRange);
    }
    onChange?.(orderedRange, dateStrings);
    onPanelChange?.(orderedRange, [picker, picker]);
  };

  const handleDateSelect = (range: DateRange | undefined, selectedDay: Date) => {
    // Normalize range for week picker - adjust to week boundaries
    let normalizedRange = range;
    if (picker === 'week' && range) {
      normalizedRange = {
        from: range.from ? startOfWeek(range.from) : undefined,
        to: range.to ? endOfWeek(range.to) : undefined,
      };
    }

    // When we have a complete range and user clicks again, start new selection
    if (tempValue?.from && tempValue?.to) {
      const newFrom = picker === 'week' ? startOfWeek(selectedDay) : selectedDay;
      const newRange = { from: newFrom, to: undefined };
      setTempValue(newRange);
      setActiveRange('end');

      const dateStrings = formatDateRange(newRange, resolvedFormat);
      onCalendarChange?.(newRange, dateStrings, { range: 'start' });
      return;
    }

    setTempValue(normalizedRange);

    const dateStrings = formatDateRange(normalizedRange, resolvedFormat);

    if (!tempValue?.from || activeRange === 'start') {
      setActiveRange('end');
      onCalendarChange?.(normalizedRange, dateStrings, { range: 'start' });
    } else {
      onCalendarChange?.(normalizedRange, dateStrings, { range: 'end' });
    }

    // Auto-close when both dates are selected
    // Don't auto-close if needConfirm or showTime is enabled
    if (normalizedRange?.from && normalizedRange?.to && !showConfirmButton) {
      // For date/week/month/quarter/year pickers that don't have showTime
      // auto-close after a complete range is selected
      const shouldAutoClose = picker !== 'date' || !showTime;

      if (shouldAutoClose) {
        // Small delay to show selection before closing
        setTimeout(() => {
          commitChange(normalizedRange);
          handleOpenChange(false);
        }, 100);
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value === undefined) {
      setInternalValue(undefined);
    }
    onChange?.(undefined, ['', '']);
    setStartInputValue('');
    setEndInputValue('');
  };

  const handlePresetSelect = (presetValue: RangeValue | (() => RangeValue)) => {
    const rangeArray = typeof presetValue === 'function' ? presetValue() : presetValue;
    const range: DateRange | undefined = rangeArray
      ? { from: rangeArray[0], to: rangeArray[1] }
      : undefined;

    setTempValue(range);
    if (!showConfirmButton) {
      commitChange(range);
      handleOpenChange(false);
    }
  };

  const handleConfirm = () => {
    if (!tempValue?.from && !allowEmpty[0]) return;
    if (!tempValue?.to && !allowEmpty[1]) return;

    commitChange(tempValue);
    onOk?.(tempValue);
    handleOpenChange(false);
  };

  const handleCancel = () => {
    setTempValue(undefined);
    handleOpenChange(false);
  };

  const handleNowClick = () => {
    const now = new Date();
    let newRange: DateRange;

    if (activeRange === 'start' || !tempValue?.from) {
      newRange = { from: now, to: tempValue?.to };
    } else {
      newRange = { from: tempValue.from, to: now };
    }

    setTempValue(newRange);

    // Update input values to reflect the new temporary selection
    const [fromStr, toStr] = formatDateRange(newRange, resolvedFormat);
    if (activeRange === 'start') {
      setStartInputValue(fromStr);
    } else {
      setEndInputValue(toStr);
    }
  };

  const handleStartTimeChange = (time: Date) => {
    if (!tempValue?.from) {
      // If no date selected, use today
      const newDate = setHours(
        setMinutes(setSeconds(new Date(), time.getSeconds()), time.getMinutes()),
        time.getHours()
      );
      newDate.setMilliseconds(0);
      setTempValue({ from: newDate, to: tempValue?.to });
    } else {
      const newFrom = setHours(
        setMinutes(setSeconds(tempValue.from, time.getSeconds()), time.getMinutes()),
        time.getHours()
      );
      setTempValue({ from: newFrom, to: tempValue?.to });
    }
  };

  const handleEndTimeChange = (time: Date) => {
    if (!tempValue?.to) {
      // If no date selected, use today
      const newDate = setHours(
        setMinutes(setSeconds(new Date(), time.getSeconds()), time.getMinutes()),
        time.getHours()
      );
      newDate.setMilliseconds(0);
      setTempValue({ from: tempValue?.from, to: newDate });
    } else {
      const newTo = setHours(
        setMinutes(setSeconds(tempValue.to, time.getSeconds()), time.getMinutes()),
        time.getHours()
      );
      setTempValue({ from: tempValue?.from, to: newTo });
    }
  };

  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setStartInputValue(newValue);

    const parsedDate = parse(newValue, resolvedFormat, new Date());
    if (isValid(parsedDate) && !disabledDate(parsedDate, { type: 'start' })) {
      const newRange = { from: parsedDate, to: tempValue?.to || selectedRange?.to };
      setTempValue(newRange);
      onCalendarChange?.(newRange, formatDateRange(newRange, resolvedFormat), { range: 'start' });

      if (previewValue) {
        setHoverPreviewValue(newValue);
      }
    } else if (!preserveInvalidOnBlur) {
      setHoverPreviewValue(null);
    }
  };

  const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEndInputValue(newValue);

    const parsedDate = parse(newValue, resolvedFormat, new Date());
    if (isValid(parsedDate) && !disabledDate(parsedDate, { from: tempValue?.from, type: 'end' })) {
      const newRange = { from: tempValue?.from || selectedRange?.from, to: parsedDate };
      setTempValue(newRange);
      onCalendarChange?.(newRange, formatDateRange(newRange, resolvedFormat), { range: 'end' });

      if (previewValue) {
        setHoverPreviewValue(newValue);
      }
    } else if (!preserveInvalidOnBlur) {
      setHoverPreviewValue(null);
    }
  };

  const handleInputBlur = (type: 'start' | 'end') => (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e, { range: type });
    // Reset input if invalid
    if (!preserveInvalidOnBlur) {
      const [fromStr, toStr] = formatDateRange(selectedRange, resolvedFormat);
      if (type === 'start') setStartInputValue(fromStr);
      else setEndInputValue(toStr);
      setHoverPreviewValue(null);
    }
  };

  const handleInputFocus = (type: 'start' | 'end') => (e: React.FocusEvent<HTMLInputElement>) => {
    setActiveRange(type);
    onFocus?.(e, { range: type });
  };

  // Render clear icon
  const renderClearIcon = () => {
    if (
      !allowClear ||
      (!selectedRange?.from && !selectedRange?.to) ||
      isFullyDisabled ||
      readOnly
    ) {
      return null;
    }

    const clearIcon =
      typeof allowClear === 'object' && allowClear.clearIcon ? (
        allowClear.clearIcon
      ) : (
        <X className="h-3 w-3" />
      );

    return (
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center cursor-pointer transition-opacity z-10"
        onClick={handleClear}
        aria-label="Clear range"
      >
        {clearIcon}
      </div>
    );
  };

  // Render separator
  const renderSeparator = () => {
    return separator || <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mx-1" />;
  };

  // Render picker panel
  const renderPanel = () => {
    switch (picker) {
      case 'year':
        return (
          <YearRangePickerPanel
            value={displayRange}
            onSelect={(range) => {
              setTempValue(range);
              if (range.from && range.to && !showConfirmButton) {
                commitChange(range);
                handleOpenChange(false);
              }
            }}
            disabledDate={disabledDate}
            activeRange={activeRange}
            cellRender={cellRender}
            dateRender={dateRender}
            prevIcon={prevIcon}
            nextIcon={nextIcon}
            superPrevIcon={superPrevIcon}
            superNextIcon={superNextIcon}
          />
        );
      case 'quarter':
        return (
          <QuarterRangePickerPanel
            value={displayRange}
            onSelect={(range) => {
              setTempValue(range);
              if (range.from && range.to && !showConfirmButton) {
                commitChange(range);
                handleOpenChange(false);
              }
            }}
            disabledDate={disabledDate}
            activeRange={activeRange}
            cellRender={cellRender}
            dateRender={dateRender}
            prevIcon={prevIcon}
            nextIcon={nextIcon}
            superPrevIcon={superPrevIcon}
            superNextIcon={superNextIcon}
          />
        );
      case 'month':
        return (
          <MonthRangePickerPanel
            value={displayRange}
            onSelect={(range) => {
              setTempValue(range);
              if (range.from && range.to && !showConfirmButton) {
                commitChange(range);
                handleOpenChange(false);
              }
            }}
            disabledDate={disabledDate}
            activeRange={activeRange}
            cellRender={cellRender}
            dateRender={dateRender}
            prevIcon={prevIcon}
            nextIcon={nextIcon}
            superPrevIcon={superPrevIcon}
            superNextIcon={superNextIcon}
          />
        );
      case 'week':
      case 'date':
      default:
        return (
          <div className="flex flex-col">
            <Calendar
              mode="range"
              selected={displayRange}
              onSelect={handleDateSelect}
              disabled={(date) =>
                disabledDate(date, { from: displayRange?.from, type: activeRange })
              }
              defaultMonth={defaultPickerValue?.[0] || displayRange?.from}
              numberOfMonths={numberOfMonths}
              showWeekNumber={picker === 'week' || showWeek}
              initialFocus
              modifiersStyles={{
                [displayRange?.from?.toISOString() || '']: {},
                [displayRange?.to?.toISOString() || '']: {},
              }}
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
                      disabledTime={
                        disabledTime
                          ? () => disabledTime(displayRange?.from || null, 'start')
                          : undefined
                      }
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
                      disabledTime={
                        disabledTime
                          ? () => disabledTime(displayRange?.to || null, 'end')
                          : undefined
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const renderInput = () => (
    <div
      className={cn(
        semanticClassNames.input,
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        isFullyDisabled && 'opacity-50 cursor-not-allowed',
        semanticStyles.input
      )}
      style={semanticStyles.input}
    >
      {prefix && (
        <div
          className={cn('ml-1 text-muted-foreground shrink-0', semanticClassNames.prefix)}
          style={semanticStyles.prefix}
        >
          {prefix}
        </div>
      )}
      <CalendarIcon className={cn('h-4 w-4 text-muted-foreground shrink-0', !prefix && 'ml-1')} />
      <input
        ref={startInputRef}
        id={id?.start}
        name={name ? `${name}_start` : undefined}
        type="text"
        value={previewValue && hoverPreviewValue !== null ? hoverPreviewValue : startInputValue}
        onChange={handleStartInputChange}
        onBlur={handleInputBlur('start')}
        onFocus={handleInputFocus('start')}
        placeholder={placeholder[0]}
        disabled={isStartDisabled}
        readOnly={inputReadOnly || readOnly}
        className={cn(
          'flex-1 bg-transparent outline-none border-none ml-2 min-w-0 w-24',
          'placeholder:text-muted-foreground text-center',
          isStartDisabled && 'cursor-not-allowed',
          activeRange === 'start' && isOpen && 'text-primary'
        )}
      />
      <div
        className={cn('text-muted-foreground shrink-0 mx-1', semanticClassNames.separator)}
        style={semanticStyles.separator}
      >
        {renderSeparator()}
      </div>
      <input
        ref={endInputRef}
        id={id?.end}
        name={name ? `${name}_end` : undefined}
        type="text"
        value={previewValue && hoverPreviewValue !== null ? hoverPreviewValue : endInputValue}
        onChange={handleEndInputChange}
        onBlur={handleInputBlur('end')}
        onFocus={handleInputFocus('end')}
        placeholder={placeholder[1]}
        disabled={isEndDisabled}
        readOnly={inputReadOnly || readOnly}
        className={cn(
          'flex-1 bg-transparent outline-none border-none min-w-0 w-24',
          'placeholder:text-muted-foreground text-center',
          isEndDisabled && 'cursor-not-allowed',
          activeRange === 'end' && isOpen && 'text-primary'
        )}
      />
      {renderClearIcon()}
      <div
        className={cn('ml-1 text-muted-foreground shrink-0', semanticClassNames.suffix)}
        style={semanticStyles.suffix}
      >
        {suffixIcon || <ChevronDown className="h-4 w-4" />}
      </div>
    </div>
  );

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{renderInput()}</PopoverTrigger>
        <PopoverContent
          className={semanticClassNames.popup}
          align={align || getPlacementAlign(placement)}
          side={placement.startsWith('top') ? 'top' : 'bottom'}
          style={semanticStyles.popup}
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
              <div className="p-0" style={semanticStyles.panel}>
                {renderPanel()}
              </div>
              {(showConfirmButton || showNow || renderExtraFooter) && (
                <div className="border-t p-3 flex items-center justify-between gap-2 bg-muted/10">
                  <div className="flex-1">{renderExtraFooter?.()}</div>
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
                          disabled={
                            (!tempValue?.from && !allowEmpty[0]) ||
                            (!tempValue?.to && !allowEmpty[1])
                          }
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
  );
}

// ==================== Preset Helpers ====================

export const rangePresets = {
  today: (): RangeValue => [new Date(), new Date()],
  yesterday: (): RangeValue => {
    const yesterday = addDays(new Date(), -1);
    return [yesterday, yesterday];
  },
  last7Days: (): RangeValue => [addDays(new Date(), -6), new Date()],
  last14Days: (): RangeValue => [addDays(new Date(), -13), new Date()],
  last30Days: (): RangeValue => [addDays(new Date(), -29), new Date()],
  last90Days: (): RangeValue => [addDays(new Date(), -89), new Date()],
  thisWeek: (): RangeValue => [startOfWeek(new Date()), endOfWeek(new Date())],
  lastWeek: (): RangeValue => {
    const lastWeekStart = startOfWeek(addDays(new Date(), -7));
    return [lastWeekStart, endOfWeek(lastWeekStart)];
  },
  thisMonth: (): RangeValue => [startOfMonth(new Date()), endOfMonth(new Date())],
  lastMonth: (): RangeValue => {
    const lastMonthStart = startOfMonth(addMonths(new Date(), -1));
    return [lastMonthStart, endOfMonth(lastMonthStart)];
  },
  thisQuarter: (): RangeValue => [startOfQuarter(new Date()), endOfQuarter(new Date())],
  thisYear: (): RangeValue => [startOfYear(new Date()), endOfYear(new Date())],
  lastYear: (): RangeValue => {
    const lastYearStart = startOfYear(addYears(new Date(), -1));
    return [lastYearStart, endOfYear(lastYearStart)];
  },
};

// ==================== Common Presets Configuration ====================

export const defaultRangePresets: RangePickerPreset[] = [
  { label: 'Today', value: rangePresets.today },
  { label: 'Yesterday', value: rangePresets.yesterday },
  { label: 'Last 7 Days', value: rangePresets.last7Days },
  { label: 'Last 14 Days', value: rangePresets.last14Days },
  { label: 'Last 30 Days', value: rangePresets.last30Days },
  { label: 'Last 90 Days', value: rangePresets.last90Days },
  { label: 'This Month', value: rangePresets.thisMonth },
  { label: 'Last Month', value: rangePresets.lastMonth },
];
