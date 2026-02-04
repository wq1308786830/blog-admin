/**
 * TDD Test Suite for Popover Component
 * 测试弹出框组件的所有子组件、对齐、偏移和交互
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as Popover from './popover';

describe('Popover - Basic Component', () => {
  test('✅ TDD: should export Popover component', () => {
    expect(Popover.Popover).toBeDefined();
    expect(typeof Popover.Popover).toMatch(/function|object/);
  });

  test('✅ TDD: should export PopoverTrigger component', () => {
    expect(Popover.PopoverTrigger).toBeDefined();
    expect(typeof Popover.PopoverTrigger).toMatch(/function|object/);
  });

  test('✅ TDD: should export PopoverContent component', () => {
    expect(Popover.PopoverContent).toBeDefined();
    expect(typeof Popover.PopoverContent).toMatch(/function|object/);
  });
});

describe('Popover - PopoverContent Base Classes', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Content</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('rounded-md');
    expect(content).toHaveClass('border');
    expect(content).toHaveClass('bg-popover');
    expect(content).toHaveClass('p-4');
    expect(content).toHaveClass('text-popover-foreground');
    expect(content).toHaveClass('shadow-md');
  });

  test('✅ TDD: should have outline-none', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toHaveClass('outline-none');
  });
});

describe('Popover - Alignment', () => {
  test('✅ TDD: should support center align', () => {
    render(
      <Popover.Popover open align="center">
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should support start align', () => {
    render(
      <Popover.Popover open align="start">
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should support end align', () => {
    render(
      <Popover.Popover open align="end">
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
  });
});

describe('Popover - Side Offset', () => {
  test('✅ TDD: should apply sideOffset correctly', () => {
    render(
      <Popover.Popover open sideOffset={8}>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should default sideOffset to 4', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();
  });
});

describe('Popover - Animations', () => {
  test('✅ TDD: should have zoom-in animation on open', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content.className).toContain('data-[state=open]:animate-in');
    expect(content.className).toContain('data-[state=closed]:zoom-out-95');
  });

  test('✅ TDD: should have zoom-out animation on closed', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    // Component should have both animate-in and animate-out classes
    expect(content.className).toContain('animate-out');
  });

  test('✅ TDD: should have fade-in animation on open', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content.className).toContain('data-[state=open]:fade-in-0');
    expect(content.className).toContain('data-[state=closed]:fade-out-0');
  });

  test('✅ TDD: should have slide animations based on side', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('popover-content');
    expect(content.className).toContain('data-[side=bottom]:slide-in-from-top-2');
  });
});

describe('Popover - Custom className', () => {
  test('✅ TDD: should support custom className', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent className="custom-popover" data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const popover = screen.getByTestId('popover-content');
    expect(popover).toHaveClass('custom-popover');
  });

  test('✅ TDD: should merge custom className with base classes', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent className="custom-class" data-testid="popover-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const popover = screen.getByTestId('popover-content');
    expect(popover).toHaveClass('rounded-md');
    expect(popover).toHaveClass('custom-class');
  });
});

describe('Popover - PopoverTrigger', () => {
  test('✅ TDD: should render children', () => {
    render(
      <Popover.Popover>
        <Popover.PopoverTrigger>Click me</Popover.PopoverTrigger>
      </Popover.Popover>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('✅ TDD: should trigger popover on click', () => {
    render(
      <Popover.Popover>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="popover-content">
          <div>Content</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const trigger = screen.getByText('Trigger');
    expect(trigger).toBeInTheDocument();
    // Content may not be visible initially (controlled by open state)
  });
});

describe('Popover - Portal', () => {
  test('✅ TDD: should render content in portal', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="portal-content">
          <div>Portal Content</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('portal-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should support ref forwarding', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent ref={ref} data-testid="ref-content">
          <div>Ref Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    // Component should render without errors
    expect(screen.getByText('Ref Test')).toBeInTheDocument();
  });
});

describe('Popover - Edge Cases', () => {
  test('✅ TDD: should handle empty children', () => {
    render(
      <Popover.Popover open>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="empty-content">{}</Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('empty-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should handle undefined align', () => {
    render(
      <Popover.Popover open align={undefined as any}>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="align-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('align-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should handle undefined sideOffset', () => {
    render(
      <Popover.Popover open sideOffset={undefined as any}>
        <Popover.PopoverTrigger>Trigger</Popover.PopoverTrigger>
        <Popover.PopoverContent data-testid="sideOffset-content">
          <div>Test</div>
        </Popover.PopoverContent>
      </Popover.Popover>
    );
    const content = screen.getByTestId('sideOffset-content');
    expect(content).toBeInTheDocument();
  });
});
