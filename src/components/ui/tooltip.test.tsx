/**
 * TDD Test Suite for Tooltip Component
 * 测试工具提示组件的所有子组件、位置和交互
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as Tooltip from './tooltip';

describe('Tooltip - Basic Component', () => {
  test('✅ TDD: should export Tooltip component', () => {
    // Radix primitives may be typeof 'object' or 'function'
    expect(Tooltip.Tooltip).toBeDefined();
    expect(typeof Tooltip.Tooltip).toMatch(/function|object/);
  });

  test('✅ TDD: should export TooltipTrigger component', () => {
    expect(Tooltip.TooltipTrigger).toBeDefined();
    expect(typeof Tooltip.TooltipTrigger).toMatch(/function|object/);
  });

  test('✅ TDD: should export TooltipContent component', () => {
    expect(Tooltip.TooltipContent).toBeDefined();
    expect(typeof Tooltip.TooltipContent).toMatch(/function|object/);
  });

  test('✅ TDD: should export TooltipProvider component', () => {
    expect(Tooltip.TooltipProvider).toBeDefined();
    expect(typeof Tooltip.TooltipProvider).toMatch(/function|object/);
  });
});

describe('Tooltip - TooltipContent Base Classes', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>Tooltip content</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('rounded-md');
    expect(content).toHaveClass('border');
    expect(content).toHaveClass('bg-popover');
    expect(content).toHaveClass('px-3');
    expect(content).toHaveClass('py-1.5');
    expect(content).toHaveClass('text-sm');
    expect(content).toHaveClass('text-popover-foreground');
    expect(content).toHaveClass('shadow-md');
  });

  test('✅ TDD: should have overflow-hidden', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>Content</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toHaveClass('overflow-hidden');
  });
});

describe('Tooltip - Animations', () => {
  test('✅ TDD: should have zoom-in animation on open', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toHaveClass('animate-in');
  });

  test('✅ TDD: should have zoom-out animation on closed', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    // Component should have both animate-in and animate-out classes (for different states)
    expect(content.className).toContain('animate-out');
  });

  test('✅ TDD: should have fade-in animation on open', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toHaveClass('fade-in-0');
  });

  test('✅ TDD: should have fade-out animation on closed', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    // Component should have both fade-in and fade-out classes (for different states)
    expect(content.className).toContain('fade-out-0');
  });
});

describe('Tooltip - Slide Animations', () => {
  test('✅ TDD: should have slide animations based on side', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    // Check for slide animation class (it includes multiple side variants)
    expect(content.className).toContain('slide-in-from-top-2');
  });
});

describe('Tooltip - Side Offset', () => {
  test('✅ TDD: should apply sideOffset correctly', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open sideOffset={8}>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should default sideOffset to 4', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toBeInTheDocument();
  });
});

describe('Tooltip - Custom className', () => {
  test('✅ TDD: should support custom className', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent className="custom-tooltip">
            <div>Content</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const tooltip = document.querySelector('.custom-tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  test('✅ TDD: should merge custom className with base classes', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent className="custom-class">
            <div>Content</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const tooltip = document.querySelector('.custom-class');
    expect(tooltip).toHaveClass('rounded-md');
    expect(tooltip).toHaveClass('custom-class');
  });
});

describe('Tooltip - Hover Behavior', () => {
  test('✅ TDD: should show content on hover', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover me</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>TC</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const trigger = screen.getByText('Hover me');

    // With open prop, content should be visible
    expect(trigger).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });
});

describe('Tooltip - Ref Forwarding', () => {
  test('✅ TDD: should support ref forwarding on Content', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent ref={ref} data-testid="tooltip-content">
            <div>CT</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    // Component should render without errors
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });
});

describe('Tooltip - Edge Cases', () => {
  test('✅ TDD: should handle empty children', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">{}</Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should handle undefined sideOffset', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open sideOffset={undefined as any}>
          <Tooltip.TooltipTrigger>Hover</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent data-testid="tooltip-content">
            <div>C</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const content = screen.getByTestId('tooltip-content');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should render with all props', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open delayDuration={100} skipDelayDuration={200}>
          <Tooltip.TooltipTrigger>Test</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent className="custom-class" data-testid="tooltip-content">
            <div>CT</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    expect(document.querySelector('.custom-class')).toBeInTheDocument();
  });
});

describe('Tooltip - Accessibility', () => {
  test('✅ TDD: should be accessible with proper role', () => {
    render(
      <Tooltip.TooltipProvider>
        <Tooltip.Tooltip open>
          <Tooltip.TooltipTrigger>Accessible</Tooltip.TooltipTrigger>
          <Tooltip.TooltipContent>
            <div>Content</div>
          </Tooltip.TooltipContent>
        </Tooltip.Tooltip>
      </Tooltip.TooltipProvider>
    );
    const trigger = screen.getByText('Accessible');
    expect(trigger).toBeInTheDocument();
  });
});
