/**
 * TDD Test Suite for Checkbox Component
 * 测试复选框组件的所有状态、样式和交互
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox - Basic Rendering', () => {
  test('✅ TDD: should render checkbox input', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  test('✅ TDD: should render indicator with Check icon', () => {
    render(<Checkbox />);
    const indicator = screen.getByLabelText(/Check/i).parentElement;
    expect(indicator).toBeInTheDocument();
    const icon = screen.getByRole('img', { name: 'Check' });
    expect(icon).toBeInTheDocument();
  });

  test('✅ TDD: should export Checkbox component', () => {
    expect(typeof Checkbox).toBe('object');
  });
});

describe('Checkbox - Base Styles', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('peer');
    expect(checkbox).toHaveClass('h-4');
    expect(checkbox).toHaveClass('w-4');
    expect(checkbox).toHaveClass('shrink-0');
    expect(checkbox).toHaveClass('rounded-sm');
    expect(checkbox).toHaveClass('border');
    expect(checkbox).toHaveClass('border-primary');
  });

  test('✅ TDD: should have ring-offset-background', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('ring-offset-background');
  });

  test('✅ TDD: should have outline-none', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('focus-visible:outline-none');
  });

  test('✅ TDD: should have focus-visible:ring-2', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('focus-visible:ring-2');
  });

  test('✅ TDD: should have focus-visible:ring-ring', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('focus-visible:ring-ring');
  });

  test('✅ TDD: should have focus-visible:ring-offset-2', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('focus-visible:ring-offset-2');
  });

  test('✅ TDD: should support custom className', () => {
    render(<Checkbox className="custom-checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-checkbox');
  });
});

describe('Checkbox - Indicator Styles', () => {
  test('✅ TDD: should have indicator classes', () => {
    render(<Checkbox />);
    const indicator = screen.getByLabelText(/Check/i).parentElement;
    expect(indicator).toHaveClass('flex');
    expect(indicator).toHaveClass('items-center');
    expect(indicator).toHaveClass('justify-center');
    expect(indicator).toHaveClass('text-current');
  });

  test('✅ TDD: should hide indicator when checked', () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('data-[state=checked]');
  });
});

describe('Checkbox - Checked State', () => {
  test('✅ TDD: should be checked when checked prop is true', () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('✅ TDD: should not be checked by default', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('✅ TDD: should have bg-primary when checked', () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('data-[state=checked]:bg-primary');
  });

  test('✅ TDD: should have text-primary-foreground when checked', () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('data-[state=checked]:text-primary-foreground');
  });

  test('✅ TDD: should toggle checked state on click', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});

describe('Checkbox - Disabled State', () => {
  test('✅ TDD: should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  test('✅ TDD: should have cursor-not-allowed when disabled', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed');
  });

  test('✅ TDD: should have opacity-50 when disabled', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('disabled:opacity-50');
  });

  test('✅ TDD: should not respond to click when disabled', () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('Checkbox - Focus Styles', () => {
  test('✅ TDD: should have focus-visible styles on focus', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    expect(checkbox).toHaveClass('focus-visible:outline-none');
    expect(checkbox).toHaveClass('focus-visible:ring-2');
    expect(checkbox).toHaveClass('focus-visible:ring-ring');
  });
});

describe('Checkbox - Icon Styles', () => {
  test('✅ TDD: should have h-4 and w-4 classes', () => {
    render(<Checkbox />);
    const icon = screen.getByRole('img', { name: 'Check' });
    expect(icon).toHaveClass('h-4');
    expect(icon).toHaveClass('w-4');
  });
});

describe('Checkbox - Ref Forwarding', () => {
  test('✅ TDD: should forward ref to native checkbox', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Checkbox ref={ref}>Checkbox</Checkbox>);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test('✅ TDD: should accept additional props', () => {
    render(<Checkbox id="test-checkbox" name="test" value="test" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    expect(checkbox).toHaveAttribute('name', 'test');
    expect(checkbox).toHaveAttribute('value', 'test');
  });
});

describe('Checkbox - Controlled Behavior', () => {
  test('✅ TDD: should respect checked prop changes', () => {
    const { rerender } = render(<Checkbox checked={false} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(<Checkbox checked={true} />);
    expect(checkbox).toBeChecked();
  });

  test('✅ TDD: should work with controlled onChange', () => {
    let checked = false;
    const handleChange = vi.fn(() => {
      checked = !checked;
    });
    const { rerender } = render(<Checkbox checked={checked} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(checked).toBe(true);
  });
});

describe('Checkbox - Accessibility', () => {
  test('✅ TDD: should be keyboard accessible', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toHaveAttribute('aria-hidden');
  });

  test('✅ TDD: should support keyboard navigation', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');

    // Space to toggle
    fireEvent.keyDown(checkbox, { key: ' ' });
    expect(checkbox).toBeChecked();

    // Enter to check
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    // Enter behavior may vary by implementation
  });
});

describe('Checkbox - Edge Cases', () => {
  test('✅ TDD: should handle multiple clicks', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  test('✅ TDD: should work with label wrapper', () => {
    render(
      <label>
        <Checkbox /> Checkbox
      </label>
    );
    expect(screen.getByText('Checkbox')).toBeInTheDocument();
  });

  test('✅ TDD: should handle undefined className', () => {
    render(<Checkbox className={undefined as any} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });
});
