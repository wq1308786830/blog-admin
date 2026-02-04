/**
 * TDD Test Suite for Label Component
 * 测试标签组件的样式、变体和禁用状态
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label - Basic Rendering', () => {
  test('✅ TDD: should render label element', () => {
    const { container } = render(<Label>Username</Label>);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  test('✅ TDD: should export Label component', () => {
    expect(Label).toBeDefined();
    expect(typeof Label).toMatch(/function|object/);
  });
});

describe('Label - Default Styles', () => {
  test('✅ TDD: should have correct base classes', () => {
    const { container } = render(<Label>Test Label</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-medium');
    expect(label).toHaveClass('leading-none');
  });

  test('✅ TDD: should support custom className', () => {
    const { container } = render(<Label className="custom-label">Test</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('custom-label');
    expect(label).toHaveClass('text-sm');
  });

  test('✅ TDD: should merge classes with variants', () => {
    const { container } = render(<Label className="custom-class">Test</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none', 'custom-class');
  });
});

describe('Label - Disabled State', () => {
  test('✅ TDD: should have peer-disabled style', () => {
    const { container } = render(<Label>Test</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
  });

  test('✅ TDD: should have peer-disabled:opacity-70', () => {
    const { container } = render(<Label>Test</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveClass('peer-disabled:opacity-70');
  });
});

describe('Label - Ref Forwarding', () => {
  test('✅ TDD: should forward ref to label element', () => {
    const ref = { current: null } as React.RefObject<HTMLLabelElement>;
    render(<Label ref={ref}>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    // Component should render without errors
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});

describe('Label - HTML Attributes', () => {
  test('✅ TDD: should support htmlFor', () => {
    const { container } = render(<Label htmlFor="username">Username</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('for', 'username'); // htmlFor becomes 'for' in HTML
  });

  test('✅ TDD: should support id', () => {
    const { container } = render(<Label id="label-id">Test</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('id', 'label-id');
  });

  test('✅ TDD: should support form attribute', () => {
    const { container } = render(<Label form="login-form">Username</Label>);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('form', 'login-form');
  });

  test('✅ TDD: should pass through other attributes', () => {
    const { container } = render(
      <Label data-testid="test-label" aria-label="Name Label">
        Name
      </Label>
    );
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('data-testid', 'test-label');
    expect(label).toHaveAttribute('aria-label', 'Name Label');
  });
});

describe('Label - Children Rendering', () => {
  test('✅ TDD: should render text children', () => {
    render(<Label>Simple Label</Label>);
    expect(screen.getByText('Simple Label')).toBeInTheDocument();
  });

  test('✅ TDD: should render complex children', () => {
    render(
      <Label>
        <span>Icon</span> <span>Label Text</span>
      </Label>
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  test('✅ TDD: should render nested elements', () => {
    render(
      <Label>
        <div>
          <strong>Bold Label</strong>
        </div>
      </Label>
    );
    expect(screen.getByText('Bold Label')).toBeInTheDocument();
  });
});

describe('Label - Edge Cases', () => {
  test('✅ TDD: should handle empty children', () => {
    const { container } = render(<Label>{''}</Label>);
    // Should render without errors
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
  });

  test('✅ TDD: should handle undefined className', () => {
    const { container } = render(<Label className={undefined as any}>Test</Label>);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
  });

  test('✅ TDD: should render without errors when all props provided', () => {
    const { container } = render(
      <Label id="test-id" htmlFor="test-for" className="test-class" data-testid="test-label">
        Full Test Label
      </Label>
    );
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('id', 'test-id');
    expect(label).toHaveAttribute('for', 'test-for');
    expect(label).toHaveClass('test-class');
    expect(screen.getByText('Full Test Label')).toBeInTheDocument();
  });
});
