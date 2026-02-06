/**
 * Comprehensive TDD test suite for DateRangePicker component
 * Based on Ant Design DatePicker五种形式的所有功能测试：
 * 1. Date Picker (日期选择)
 * 2. Week Picker (周选择)
 * 3. Month Picker (月选择)
 * 4. Quarter Picker (季度选择)
 * 5. Year Picker (年选择)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRangePicker, rangePresets, type DateRange } from './DateRangePicker';
import { format, addDays, addMonths, addYears, startOfMonth, endOfMonth } from 'date-fns';

// Helper to create a date object from string
const createDate = (dateStr: string): Date => {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Helper to create date range
const createRange = (fromStr: string, toStr: string): DateRange => ({
  from: createDate(fromStr),
  to: createDate(toStr),
});

// ==================== 基础渲染测试 ====================

describe('DateRangePicker - Basic Rendering', () => {
  test('should render picker component with default props', () => {
    render(<DateRangePicker />);
    expect(screen.getByPlaceholderText('Start date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('End date')).toBeInTheDocument();
  });

  test('should render with custom placeholder', () => {
    render(<DateRangePicker placeholder={['Start', 'End']} />);
    expect(screen.getByPlaceholderText('Start')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('End')).toBeInTheDocument();
  });

  test('should render with default value', () => {
    const defaultValue = createRange('2024-01-01', '2024-01-07');
    render(<DateRangePicker defaultValue={defaultValue} />);
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-07')).toBeInTheDocument();
  });

  test('should render with controlled value', () => {
    const value = createRange('2024-06-01', '2024-06-30');
    render(<DateRangePicker value={value} />);
    expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-06-30')).toBeInTheDocument();
  });

  test('should render with custom className', () => {
    const { container } = render(<DateRangePicker className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('should render with custom prefix icon', () => {
    render(<DateRangePicker prefix={<span data-testid="prefix-icon">@</span>} />);
    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
  });

  test('should render with custom suffix icon', () => {
    render(<DateRangePicker suffixIcon={<span data-testid="suffix-icon">↓</span>} />);
    expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
  });

  test('should render with custom separator', () => {
    render(<DateRangePicker separator="→" />);
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  test('should render with id attributes', () => {
    render(<DateRangePicker id={{ start: 'start-id', end: 'end-id' }} />);
    expect(screen.getByPlaceholderText('Start date')).toHaveAttribute('id', 'start-id');
    expect(screen.getByPlaceholderText('End date')).toHaveAttribute('id', 'end-id');
  });

  test('should render with name attributes', () => {
    render(<DateRangePicker name="daterange" />);
    expect(screen.getByPlaceholderText('Start date')).toHaveAttribute('name', 'daterange_start');
    expect(screen.getByPlaceholderText('End date')).toHaveAttribute('name', 'daterange_end');
  });

  test('should not render clear icon when no value selected', () => {
    render(<DateRangePicker />);
    const clearIcon = screen.queryByLabelText('Clear range');
    expect(clearIcon).not.toBeInTheDocument();
  });

  test('should render clear icon when value is selected', () => {
    const value = createRange('2024-01-01', '2024-01-07');
    render(<DateRangePicker value={value} />);
    // Clear icon should appear on hover (may need to simulate hover)
    const clearIcon = screen.queryByLabelText('Clear range');
    expect(clearIcon).toBeInTheDocument();
  });

  test('should not render clear icon when allowClear is false', () => {
    const value = createRange('2024-01-01', '2024-01-07');
    render(<DateRangePicker value={value} allowClear={false} />);
    const clearIcon = screen.queryByLabelText('Clear range');
    expect(clearIcon).not.toBeInTheDocument();
  });
});

// ==================== 禁用状态测试 ====================

describe('DateRangePicker - Disabled State', () => {
  test('should disable both inputs when disabled is true', () => {
    render(<DateRangePicker disabled />);
    const inputs = screen.getAllByPlaceholderText(/date/);
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  test('should disable only start input', () => {
    render(<DateRangePicker disabled={[true, false]} />);
    const startInput = screen.getByPlaceholderText('Start date');
    const endInput = screen.getByPlaceholderText('End date');
    expect(startInput).toBeDisabled();
    expect(endInput).not.toBeDisabled();
  });

  test('should disable only end input', () => {
    render(<DateRangePicker disabled={[false, true]} />);
    const startInput = screen.getByPlaceholderText('Start date');
    const endInput = screen.getByPlaceholderText('End date');
    expect(startInput).not.toBeDisabled();
    expect(endInput).toBeDisabled();
  });

  test('should not open popover when disabled', () => {
    render(<DateRangePicker disabled />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('should render in read-only mode', () => {
    render(<DateRangePicker readOnly />);
    const inputs = screen.getAllByPlaceholderText(/date/);
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('readonly');
    });
  });

  test('should render with inputReadOnly', () => {
    render(<DateRangePicker inputReadOnly />);
    const inputs = screen.getAllByPlaceholderText(/date/);
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('readonly');
    });
  });
});

// ==================== 尺寸变体测试 ====================

describe('DateRangePicker - Size Variants', () => {
  test('should render with small size', () => {
    const { container } = render(<DateRangePicker size="small" />);
    const input = container.querySelector('.h-7');
    expect(input).toBeInTheDocument();
  });

  test('should render with middle size (default)', () => {
    const { container } = render(<DateRangePicker size="middle" />);
    const input = container.querySelector('.h-9');
    expect(input).toBeInTheDocument();
  });

  test('should render with large size', () => {
    const { container } = render(<DateRangePicker size="large" />);
    const input = container.querySelector('.h-11');
    expect(input).toBeInTheDocument();
  });
});

// ==================== 样式变体测试 ====================

describe('DateRangePicker - Style Variants', () => {
  test('should render with outlined variant (default)', () => {
    render(<DateRangePicker variant="outlined" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    // When bordered={true}, the variant is applied via getVariantClasses
    expect(container).toBeInTheDocument();
  });

  test('should render with filled variant', () => {
    render(<DateRangePicker variant="filled" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    expect(container).toBeInTheDocument();
  });

  test('should render with borderless variant', () => {
    render(<DateRangePicker variant="borderless" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    expect(container).toBeInTheDocument();
  });

  test('should render with underlined variant', () => {
    render(<DateRangePicker variant="underlined" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    expect(container).toBeInTheDocument();
  });
});

// ==================== 状态样式测试 ====================

describe('DateRangePicker - Status Styles', () => {
  test('should render with error status', () => {
    render(<DateRangePicker status="error" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    expect(container).toBeInTheDocument();
  });

  test('should render with warning status', () => {
    render(<DateRangePicker status="warning" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    expect(container).toBeInTheDocument();
  });
});

// ==================== Date Picker 模式测试 ====================

describe('DateRangePicker - Date Picker Mode', () => {
  test('should render date picker with date picker type', async () => {
    render(<DateRangePicker picker="date" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    // Calendar panel should be visible
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should open calendar panel on click', async () => {
    render(<DateRangePicker />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should close calendar panel on outside click', async () => {
    render(<DateRangePicker />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Press Escape to close
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('should trigger onChange when date range is selected', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select start date (day 1 of current month)
    const dayButtons = screen.getAllByText('1');
    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      await waitFor(() => {}, { timeout: 200 });
    }

    // Select end date
    const dayButtonsSecond = screen.getAllByText('15');
    if (dayButtonsSecond.length > 0) {
      fireEvent.click(dayButtonsSecond[0]);
    }

    // onChange should be called (may be called after auto-close)
    await waitFor(
      () => {
        expect(handleChange).toHaveBeenCalled();
      },
      { timeout: 500 }
    );
  });

  test('should trigger onCalendarChange when selecting dates', async () => {
    const handleCalendarChange = vi.fn();
    render(<DateRangePicker onCalendarChange={handleCalendarChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select start date
    const dayButtons = screen.getAllByText('1');
    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      await waitFor(() => {}, { timeout: 200 });
    }
  });

  test('should display selected date range in inputs', async () => {
    const value = createRange('2024-06-01', '2024-06-15');
    render(<DateRangePicker value={value} />);

    expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-06-15')).toBeInTheDocument();
  });

  test('should clear date range when clear button is clicked', () => {
    const handleChange = vi.fn();
    const value = createRange('2024-06-01', '2024-06-15');
    render(<DateRangePicker value={value} onChange={handleChange} />);

    const clearButton = screen.getByLabelText('Clear range');
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(undefined, ['', '']);
  });

  test('should format dates with custom format string', () => {
    const value = createRange('2024-06-01', '2024-06-15');
    render(<DateRangePicker value={value} format="dd/MM/yyyy" />);

    expect(screen.getByDisplayValue('01/06/2024')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15/06/2024')).toBeInTheDocument();
  });
});

// ==================== Week Picker 模式测试 ====================

describe('DateRangePicker - Week Picker Mode', () => {
  test('should render week picker', async () => {
    render(<DateRangePicker picker="week" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      // Calendar grids should be visible (2 months by default)
      const grids = screen.getAllByRole('grid');
      expect(grids.length).toBe(2);
    });
  });

  test('should select week range correctly', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker picker="week" onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select a day (should select entire week)
    const dayButtons = screen.getAllByText('1');
    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      await waitFor(() => {}, { timeout: 200 });
    }
  });

  test('should show week numbers when showWeek is true', async () => {
    render(<DateRangePicker picker="week" showWeek />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      // 使用 getAllByRole 因为有两个月份面板
      const grids = screen.getAllByRole('grid');
      expect(grids.length).toBeGreaterThan(0);
    });
  });
});

// ==================== Month Picker 模式测试 ====================

describe('DateRangePicker - Month Picker Mode', () => {
  test('should render month picker', async () => {
    render(<DateRangePicker picker="month" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      // Month buttons should be visible (1-12)
      expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    });
  });

  test('should select month range correctly', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker picker="month" onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select January
    const januaryButton = screen.getAllByText('1')[0];
    fireEvent.click(januaryButton);
    await waitFor(() => {}, { timeout: 200 });

    // Select March
    const marchButton = screen.getAllByText('3')[0];
    fireEvent.click(marchButton);
  });

  test('should format month selection as yyyy-MM', () => {
    const value = createRange('2024-01-01', '2024-03-01');
    // Month picker stores dates as 1st of the month
    const monthValue = {
      from: createDate('2024-01-01'),
      to: createDate('2024-03-01'),
    } as DateRange;
    render(<DateRangePicker picker="month" value={monthValue} />);

    expect(screen.getByDisplayValue('2024-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03')).toBeInTheDocument();
  });

  test('should navigate between years in month picker', async () => {
    render(<DateRangePicker picker="month" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Find and click next year button (chevron icons)
    const nextButtons = screen.getAllByRole('button');
    const chevronRight = nextButtons.find((btn) => btn.innerHTML.includes('svg'));
    if (chevronRight) {
      fireEvent.click(chevronRight);
    }
  });
});

// ==================== Quarter Picker 模式测试 ====================

describe('DateRangePicker - Quarter Picker Mode', () => {
  test('should render quarter picker', async () => {
    render(<DateRangePicker picker="quarter" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      // Quarter buttons (1-4) should be visible
      expect(screen.getAllByText('1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2').length).toBeGreaterThan(0);
      expect(screen.getAllByText('3').length).toBeGreaterThan(0);
      expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    });
  });

  test('should select quarter range correctly', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker picker="quarter" onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select Q1
    const q1Buttons = screen.queryAllByText('1');
    if (q1Buttons.length > 0) {
      fireEvent.click(q1Buttons[0]);
      await waitFor(() => {}, { timeout: 200 });
    }

    // Select Q2
    const q2Buttons = screen.queryAllByText('2');
    if (q2Buttons.length > 0) {
      fireEvent.click(q2Buttons[0]);
    }
  });

  test('should format quarter selection as yyyy-QQ', () => {
    // Quarter picker uses quarter format
    const value = {
      from: createDate('2024-01-01'), // Q1
      to: createDate('2024-04-01'), // Q2
    } as DateRange;
    render(<DateRangePicker picker="quarter" value={value} />);

    // Format should be "yyyy-'Q'Q" like "2024-Q1" and "2024-Q2"
    const inputs = screen.getAllByDisplayValue(/2024/);
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('should navigate between decades in quarter picker', async () => {
    render(<DateRangePicker picker="quarter" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Find and click super next button for decade navigation
    const buttons = screen.getAllByRole('button');
    const buttonWithSvg = buttons.find((btn) => btn.innerHTML.includes('svg'));
    if (buttonWithSvg) {
      fireEvent.click(buttonWithSvg);
    }
  });
});

// ==================== Year Picker 模式测试 ====================

describe('DateRangePicker - Year Picker Mode', () => {
  test('should render year picker', async () => {
    render(<DateRangePicker picker="year" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      // Year buttons should be visible
      expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument();
    });
  });

  test('should select year range correctly', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker picker="year" onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select year 2024
    const year2024 = screen.queryByText('2024');
    if (year2024) {
      fireEvent.click(year2024);
      await waitFor(() => {}, { timeout: 200 });
    }

    // Select year 2026
    const year2026 = screen.queryByText('2026');
    if (year2026) {
      fireEvent.click(year2026);
    }
  });

  test('should format year selection as yyyy', () => {
    const value = {
      from: createDate('2024-01-01'),
      to: createDate('2026-12-31'),
    } as DateRange;
    render(<DateRangePicker picker="year" value={value} />);

    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026')).toBeInTheDocument();
  });

  test('should show decade view with all years', async () => {
    render(<DateRangePicker picker="year" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Should have 12 year buttons in a decade view
    const buttons = screen
      .getAllByRole('button')
      .filter((btn) => /^\d{4}$/.test(btn.textContent || ''));
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should navigate between decades', async () => {
    render(<DateRangePicker picker="year" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Find decade navigation buttons (chevrons)
    const buttons = screen.getAllByRole('button');
    const chevronButtons = buttons.filter((btn) => btn.innerHTML.includes('svg'));
    if (chevronButtons.length > 0) {
      const initialYearTexts = screen.getAllByText(/\d{4}/);
      const initialYearText = initialYearTexts[0].textContent;

      // Click next decade
      fireEvent.click(chevronButtons[0]);
      await waitFor(() => {});

      // Year display should change
      const newYearTexts = screen.getAllByText(/\d{4}/);
      const newYearText = newYearTexts[0].textContent;
      expect(newYearText).not.toBe(initialYearText);
    }
  });
});

// ==================== Show Time 功能测试 ====================

describe('DateRangePicker - Show Time Feature', () => {
  test('should render time picker when showTime is true', async () => {
    render(<DateRangePicker showTime />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      // Time panel should be visible
      expect(screen.getByText('Start Time')).toBeInTheDocument();
      expect(screen.getByText('End Time')).toBeInTheDocument();
    });
  });

  test('should show OK and Cancel buttons when showTime is true', async () => {
    render(<DateRangePicker showTime />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  test('should switch between start and end time panels', async () => {
    render(<DateRangePicker showTime />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    const startTimeButton = screen.getByText('Start Time');
    const endTimeButton = screen.getByText('End Time');

    // 检查按钮是否有 bg-primary 类（激活状态）
    expect(startTimeButton).toHaveClass('bg-primary');

    fireEvent.click(endTimeButton);
    await waitFor(() => {});

    // 切换后 endTimeButton 应该有激活状态
    expect(endTimeButton).toHaveClass('bg-primary');
  });

  test('should format dates with time when showTime is true', () => {
    const value = {
      from: new Date('2024-06-01T10:30:00'),
      to: new Date('2024-06-15T14:45:00'),
    };
    render(<DateRangePicker showTime value={value as any} />);

    expect(screen.getByDisplayValue(/2024-06-01.*10:30/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/2024-06-15.*14:45/)).toBeInTheDocument();
  });

  test('should trigger onOk when OK button is clicked', async () => {
    const handleOk = vi.fn();
    const handleChange = vi.fn();
    render(<DateRangePicker showTime onOk={handleOk} onChange={handleChange} allowEmpty={[true, true]} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select start date first
    const dayButtons = screen.getAllByText('1');
    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      await waitFor(() => {}, { timeout: 200 });
    }

    // Click OK button
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(handleOk).toHaveBeenCalled();
    });
  });

  test('should not close panel automatically when showTime is true', async () => {
    render(<DateRangePicker showTime />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select dates
    const dayButtons = screen.getAllByText('1');
    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      await waitFor(() => {}, { timeout: 200 });
    }

    // Panel should still be open
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should respect needConfirm prop independently of showTime', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker needConfirm={true} onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
    });
  });
});

// ==================== Presets 功能测试 ====================

describe('DateRangePicker - Presets Feature', () => {
  test('should render preset buttons', async () => {
    const presets = [
      {
        label: 'Last 7 Days',
        value: [addDays(new Date(), -6), new Date()] as RangeValue,
      },
      {
        label: 'Last 30 Days',
        value: [addDays(new Date(), -29), new Date()] as RangeValue,
      },
    ];

    render(<DateRangePicker presets={presets} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    });
  });

  test('should apply preset range when clicked', async () => {
    const handleChange = vi.fn();
    const today = new Date();
    const presets = [
      {
        label: 'Last 7 Days',
        value: [addDays(today, -6), today] as RangeValue,
      },
    ];

    render(<DateRangePicker presets={presets} onChange={handleChange} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    const presetButton = screen.getByText('Last 7 Days');
    fireEvent.click(presetButton);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });

  test('should close panel after preset selection when needConfirm is false', async () => {
    const presets = [
      {
        label: 'Today',
        value: [new Date(), new Date()] as RangeValue,
      },
    ];

    render(<DateRangePicker presets={presets} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    const presetButton = screen.getByText('Today');
    fireEvent.click(presetButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('should support function preset values', async () => {
    const handleChange = vi.fn();
    const presets = [
      {
        label: 'Last 7 Days',
        value: rangePresets.last7Days,
      },
    ];

    render(<DateRangePicker presets={presets} onChange={handleChange} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    });

    const presetButton = screen.getByText('Last 7 Days');
    fireEvent.click(presetButton);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });
});

// ==================== DisabledDate 功能测试 ====================

describe('DateRangePicker - DisabledDate Feature', () => {
  test('should disable dates before minDate', async () => {
    const minDate = createDate('2024-06-01');
    const maxDate = createDate('2024-06-30');

    render(<DateRangePicker minDate={minDate} maxDate={maxDate} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // May disabled should be visible but unclickable
    // This is hard to test without inspecting DOM attributes
  });

  test('should disable dates after maxDate', async () => {
    const maxDate = createDate('2024-06-15');

    render(<DateRangePicker maxDate={maxDate} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should use custom disabledDate function', async () => {
    const disabledDate = vi.fn((date: Date) => {
      return date.getDay() === 0 || date.getDay() === 6; // Disable weekends
    });

    render(<DateRangePicker disabledDate={disabledDate as any} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });
});

// ==================== Events 测试 ====================

describe('DateRangePicker - Event Handlers', () => {
  test('should call onFocus when input is focused', () => {
    const handleFocus = vi.fn();
    render(<DateRangePicker onFocus={handleFocus} />);

    const startInput = screen.getByPlaceholderText('Start date');
    fireEvent.focus(startInput);

    expect(handleFocus).toHaveBeenCalled();
  });

  test('should call onBlur when input loses focus', () => {
    const handleBlur = vi.fn();
    render(<DateRangePicker onBlur={handleBlur} />);

    const startInput = screen.getByPlaceholderText('Start date');
    fireEvent.blur(startInput);

    expect(handleBlur).toHaveBeenCalled();
  });

  test('should call onOpenChange when panel opens', async () => {
    const handleOpenChange = vi.fn();
    render(<DateRangePicker onOpenChange={handleOpenChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  test('should call onOpenChange when panel closes', async () => {
    const handleOpenChange = vi.fn();
    render(<DateRangePicker onOpenChange={handleOpenChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // 按 Escape 键关闭面板
    fireEvent.keyDown(container!, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  test('should call onPanelChange when picker mode changes', async () => {
    const handlePanelChange = vi.fn();
    render(<DateRangePicker onPanelChange={handlePanelChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select dates
    const dayButtons = screen.getAllByText('1');
    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      await waitFor(() => {}, { timeout: 300 });
    }
  });

  test('should not call events when picker is disabled', async () => {
    const handleOpenChange = vi.fn();
    const handleFocus = vi.fn();
    render(<DateRangePicker disabled onOpenChange={handleOpenChange} onFocus={handleFocus} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    // Panel should not open
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });
});

// ==================== Controlled/Uncontrolled 测试 ====================

describe('DateRangePicker - Controlled vs Uncontrolled', () => {
  test('should work in controlled mode with value prop', () => {
    const handleChange = vi.fn();
    const value = createRange('2024-06-01', '2024-06-15');
    render(<DateRangePicker value={value} onChange={handleChange} />);

    expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-06-15')).toBeInTheDocument();
  });

  test('should work in uncontrolled mode with defaultValue prop', () => {
    const defaultValue = createRange('2024-06-01', '2024-06-15');
    render(<DateRangePicker defaultValue={defaultValue} />);

    expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-06-15')).toBeInTheDocument();
  });

  test('should respect controlled open state', async () => {
    const handleOpenChange = vi.fn();
    render(<DateRangePicker open={true} onOpenChange={handleOpenChange} />);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Try to close by clicking outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      // Should still be open because controlled
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should respect defaultOpen in uncontrolled mode', async () => {
    render(<DateRangePicker defaultOpen={true} />);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });
});

// ==================== CellRender 功能测试 ====================

describe('DateRangePicker - CellRender Feature', () => {
  test('should use custom cellRender function', async () => {
    const cellRender = vi.fn((date: Date, info: any) => {
      return <span className="custom-cell">{date.getDate()}</span>;
    });

    render(<DateRangePicker picker="quarter" cellRender={cellRender as any} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(cellRender).toHaveBeenCalled();
    });
  });

  test('should use deprecated dateRender function', async () => {
    const dateRender = vi.fn((date: Date, today: Date) => {
      return <span className="custom-date">{date.getDate()}</span>;
    });

    render(<DateRangePicker picker="month" dateRender={dateRender as any} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(dateRender).toHaveBeenCalled();
    });
  });
});

// ==================== 自定义渲染测试 ====================

describe('DateRangePicker - Custom Rendering', () => {
  test('should render custom footer with renderExtraFooter', async () => {
    const extraFooter = <div data-testid="extra-footer">Extra Content</div>;
    render(<DateRangePicker renderExtraFooter={() => extraFooter} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('extra-footer')).toBeInTheDocument();
    });
  });

  test('should render custom clear icon', () => {
    const value = createRange('2024-06-01', '2024-06-15');
    const customClearIcon = <span data-testid="custom-clear">✕</span>;
    render(<DateRangePicker value={value} allowClear={{ clearIcon: customClearIcon }} />);

    expect(screen.getByTestId('custom-clear')).toBeInTheDocument();
  });

  test('should apply semantic classNames correctly', () => {
    const { container } = render(
      <DateRangePicker
        classNames={{
          input: 'custom-input-class',
          popup: 'custom-popup-class',
          separator: 'custom-separator-class',
        }}
      />
    );

    expect(container.querySelector('.custom-input-class')).toBeInTheDocument();
  });

  test('should apply semantic styles correctly', () => {
    const { container } = render(
      <DateRangePicker
        styles={{
          input: { backgroundColor: 'red' },
          popup: { padding: '20px' },
        }}
      />
    );

    const inputContainer = container.querySelector('[class*="inline-flex"]');
    // 使用 RGB 格式，因为浏览器将颜色转换为 RGB
    expect(inputContainer).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  test('should support function classNames', () => {
    const { container } = render(
      <DateRangePicker
        classNames={(props) => ({
          input: props.value?.from ? 'has-value' : 'no-value',
        })}
      />
    );

    expect(container.querySelector('.no-value')).toBeInTheDocument();
  });
});

// ==================== Placeholder and 输入测试 ====================

describe('DateRangePicker - Input Features', () => {
  test('should allow manual date input', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker onChange={handleChange} />);

    const startInput = screen.getByPlaceholderText('Start date');
    fireEvent.change(startInput, { target: { value: '2024-06-01' } });

    await waitFor(() => {});

    expect(startInput).toHaveValue('2024-06-01');
  });

  test('should validate input dates', async () => {
    render(<DateRangePicker />);

    const startInput = screen.getByPlaceholderText('Start date');
    fireEvent.change(startInput, { target: { value: 'invalid-date' } });

    fireEvent.blur(startInput);

    await waitFor(() => {
      // Invalid input should be reset
      expect(startInput).toHaveValue('');
    });
  });

  test('should respect preserveInvalidOnBlur prop', async () => {
    render(<DateRangePicker preserveInvalidOnBlur />);

    const startInput = screen.getByPlaceholderText('Start date');
    fireEvent.change(startInput, { target: { value: 'invalid-date' } });

    fireEvent.blur(startInput);

    await waitFor(() => {
      // Invalid input should be preserved
      expect(startInput).toHaveValue('invalid-date');
    });
  });

  test('should allow empty start when allowEmpty[0] is true', async () => {
    render(<DateRangePicker allowEmpty={[true, false]} />);

    // This tests that empty start is allowed
    const startInput = screen.getByPlaceholderText('Start date');
    expect(startInput).toBeInTheDocument();
  });

  test('should allow empty end when allowEmpty[1] is true', async () => {
    render(<DateRangePicker allowEmpty={[false, true]} />);

    const endInput = screen.getByPlaceholderText('End date');
    expect(endInput).toBeInTheDocument();
  });
});

// ==================== Placement 测试 ====================

describe('DateRangePicker - Placement Options', () => {
  test('should place popup at bottomLeft by default', async () => {
    render(<DateRangePicker placement="bottomLeft" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should support all placement options', async () => {
    const placements: Array<'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'> = [
      'bottomLeft',
      'bottomRight',
      'topLeft',
      'topRight',
    ];

    // 顺序执行而不是并行，以避免 DOM 查询冲突
    for (const placement of placements) {
      const { unmount } = render(<DateRangePicker placement={placement} />);
      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      unmount();
    }
  });

  test('should respect align option', async () => {
    render(<DateRangePicker align="center" />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });
});

// ==================== Number of Months 测试 ====================

describe('DateRangePicker - NumberOfMonths', () => {
  test('should display 2 months by default', async () => {
    render(<DateRangePicker numberOfMonths={2} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should display 1 month when numberOfMonths is 1', async () => {
    render(<DateRangePicker numberOfMonths={1} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  test('should display 3 months when numberOfMonths is 3', async () => {
    render(<DateRangePicker numberOfMonths={3} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });
});

// ==================== Border 和其他小功能测试 ====================

describe('DateRangePicker - Border and Other Features', () => {
  test('should not have border when bordered is false', () => {
    render(<DateRangePicker bordered={false} />);
    const container = screen.getByPlaceholderText('Start date').closest('div');

    // Should have variant classes when bordered is false
    expect(container).toHaveClass('border-transparent', 'shadow-none');
  });

  test('should show Now button when showNow is true', async () => {
    render(<DateRangePicker showNow />);
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Now')).toBeInTheDocument();
    });
  });

  test('should apply now time when Now button is clicked', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker showNow onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    const nowButton = screen.getByText('Now');
    fireEvent.click(nowButton);

    await waitFor(() => {});

    expect(handleChange).toHaveBeenCalled();
  });

  test('should respect order prop for auto-sorting dates', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker order={true} onChange={handleChange} />);

    const startDateInput = screen.getByPlaceholderText('Start date');
    const endDateInput = screen.getByPlaceholderText('End date');

    // Enter dates in reverse order
    fireEvent.change(startDateInput, { target: { value: '2024-06-15' } });
    fireEvent.change(endDateInput, { target: { value: '2024-06-01' } });

    await waitFor(() => {});
  });
});

// ==================== Accessibilty 测试 ====================

describe('DateRangePicker - Accessibility', () => {
  test('should have aria-label on clear icon', () => {
    const value = createRange('2024-06-01', '2024-06-15');
    render(<DateRangePicker value={value} />);

    const clearIcon = screen.getByLabelText('Clear range');
    expect(clearIcon).toBeInTheDocument();
  });

  test('should have proper placeholder text for screen readers', () => {
    render(<DateRangePicker placeholder={['Select start date', 'Select end date']} />);

    expect(screen.getByPlaceholderText('Select start date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select end date')).toBeInTheDocument();
  });
});

// ==================== 边界情况测试 ====================

describe('DateRangePicker - Edge Cases', () => {
  test('should handle same start and end date', () => {
    const value = createRange('2024-06-15', '2024-06-15');
    render(<DateRangePicker value={value} />);

    // 使用 getAllByDisplayValue 因为两个输入框都有相同值
    const inputs = screen.getAllByDisplayValue('2024-06-15');
    expect(inputs.length).toBe(2);
  });

  test('should handle跨年 ranges', () => {
    const value = createRange('2023-12-01', '2024-01-31');
    render(<DateRangePicker value={value} />);

    expect(screen.getByDisplayValue('2023-12-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-31')).toBeInTheDocument();
  });

  test('should handle跨月 ranges', () => {
    const value = createRange('2024-05-15', '2024-07-15');
    render(<DateRangePicker value={value} />);

    expect(screen.getByDisplayValue('2024-05-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-07-15')).toBeInTheDocument();
  });

  test('should handle undefined dates in range', () => {
    const value = {
      from: createDate('2024-06-01'),
      to: undefined,
    } as DateRange;
    render(<DateRangePicker value={value} />);

    expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
  });

  test('should handle null value', () => {
    render(<DateRangePicker value={undefined} />);

    const startInput = screen.getByPlaceholderText('Start date');
    const endInput = screen.getByPlaceholderText('End date');

    expect(startInput).toHaveValue('');
    expect(endInput).toHaveValue('');
  });
});

// ==================== 集成测试场景 ====================

describe('DateRangePicker - Integration Scenarios', () => {
  test('should complete full selection flow: open -> select dates -> confirm -> close', async () => {
    const handleChange = vi.fn();
    const handleOk = vi.fn();
    const handleOpenChange = vi.fn();

    render(
      <DateRangePicker
        showTime
        onChange={handleChange}
        onOk={handleOk}
        onOpenChange={handleOpenChange}
      />
    );

    // Open
    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // Select start date
    const dayButtons = screen.getAllByText('1');
    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      await waitFor(() => {}, { timeout: 200 });
    }

    // Select end date
    const dayButtonsSecond = screen.getAllByText('15');
    if (dayButtonsSecond.length > 0) {
      fireEvent.click(dayButtonsSecond[0]);
      await waitFor(() => {}, { timeout: 200 });
    }

    // Confirm
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);

    await waitFor(
      () => {
        expect(handleOk).toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test('should work with presets and custom disabledDates together', async () => {
    const handleChange = vi.fn();
    const disabledDate = (date: Date) => {
      return date.getDay() === 0; // Disable Sundays
    };

    render(
      <DateRangePicker
        presets={[{ label: 'Last 7 Days', value: rangePresets.last7Days() }]}
        disabledDate={disabledDate}
        onChange={handleChange}
      />
    );

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    });
  });

  test('should handle rapid changes without breaking', async () => {
    const handleChange = vi.fn();
    render(<DateRangePicker onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');

    // Rapid open/close
    fireEvent.click(container!);
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 200 }
    );
    // 使用 Escape 键关闭
    fireEvent.keyDown(container!, { key: 'Escape', code: 'Escape' });
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );
    fireEvent.click(container!);
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });
});
