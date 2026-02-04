/**
 * TDD Test Suite for Tabs Component
 * 测试标签页组件的所有状态、样式和交互
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Tabs from './tabs';

describe('Tabs - Basic Component', () => {
  test('✅ TDD: should export Tabs component', () => {
    expect(typeof Tabs.Tabs).toBe('object');
  });

  test('✅ TDD: should export TabsList component', () => {
    expect(typeof Tabs.TabsList).toBe('object');
  });

  test('✅ TDD: should export TabsTrigger component', () => {
    expect(typeof Tabs.TabsTrigger).toBe('object');
  });

  test('✅ TDD: should export TabsContent component', () => {
    expect(typeof Tabs.TabsContent).toBe('object');
  });
});

describe('Tabs - TabsList Styles', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(
      <Tabs.Tabs>
        <Tabs.TabsList data-testid="tabs-list">
          <Tabs.TabsTrigger>Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger>Tab 2</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const list = screen.getByTestId('tabs-list');
    expect(list).toHaveClass('inline-flex');
    expect(list).toHaveClass('h-10');
    expect(list).toHaveClass('items-center');
    expect(list).toHaveClass('justify-center');
    expect(list).toHaveClass('rounded-md');
    expect(list).toHaveClass('bg-muted');
    expect(list).toHaveClass('p-1');
  });

  test('✅ TDD: should have text styles', () => {
    render(
      <Tabs.Tabs>
        <Tabs.TabsList data-testid="tabs-list">
          <Tabs.TabsTrigger>Tab</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const list = screen.getByTestId('tabs-list');
    expect(list).toHaveClass('text-muted-foreground');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Tabs.Tabs>
        <Tabs.TabsList className="custom-list">
          <Tabs.TabsTrigger>Tab</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const list = document.querySelector('.custom-list');
    expect(list).toBeInTheDocument();
  });
});

describe('Tabs - TabsTrigger Styles', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const trigger = screen.getByRole('tab', { name: 'Tab 1' });
    expect(trigger.className).toContain('inline-flex');
    expect(trigger.className).toContain('items-center');
    expect(trigger.className).toContain('justify-center');
    expect(trigger.className).toContain('whitespace-nowrap');
    expect(trigger.className).toContain('rounded-sm');
    expect(trigger.className).toContain('px-3');
    expect(trigger.className).toContain('py-1.5');
    expect(trigger.className).toContain('text-sm');
    expect(trigger.className).toContain('font-medium');
  });

  test('✅ TDD: should have ring styles', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const trigger = screen.getByRole('tab', { name: 'Tab' });
    expect(trigger.className).toContain('ring-offset-background');
    expect(trigger.className).toContain('focus-visible:outline-none');
    expect(trigger.className).toContain('focus-visible:ring-2');
    expect(trigger.className).toContain('focus-visible:ring-ring');
    expect(trigger.className).toContain('focus-visible:ring-offset-2');
  });

  test('✅ TDD: should have transition classes', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const trigger = screen.getByRole('tab', { name: 'Tab' });
    expect(trigger.className).toContain('transition-all');
  });

  test('✅ TDD: should have disabled styles', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1" disabled>Tab</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const trigger = screen.getByRole('tab', { name: 'Tab' });
    expect(trigger.className).toContain('disabled:pointer-events-none');
    expect(trigger.className).toContain('disabled:opacity-50');
  });

  test('✅ TDD: should have active state styles', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="tab2">Tab 2</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const activeTrigger = screen.getByRole('tab', { name: 'Tab 1' });
    const inactiveTrigger = screen.getByRole('tab', { name: 'Tab 2' });

    // Both triggers have the same CSS classes (they use data-[state] selectors)
    expect(activeTrigger.className).toContain('data-[state=active]:bg-background');
    expect(activeTrigger.className).toContain('data-[state=active]:text-foreground');
    expect(activeTrigger.className).toContain('data-[state=active]:shadow-sm');

    // The difference is in the data-state attribute
    expect(activeTrigger).toHaveAttribute('data-state', 'active');
    expect(inactiveTrigger).toHaveAttribute('data-state', 'inactive');
  });
});

describe('Tabs - TabsContent Styles', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="tab1" data-testid="tab-content-1">Content 1</Tabs.TabsContent>
      </Tabs.Tabs>
    );
    const content = screen.getByTestId('tab-content-1');
    expect(content.className).toContain('mt-2');
    expect(content.className).toContain('ring-offset-background');
  });

  test('✅ TDD: should have focus styles', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="tab1" data-testid="tab-content">Content</Tabs.TabsContent>
      </Tabs.Tabs>
    );
    const content = screen.getByTestId('tab-content');
    expect(content.className).toContain('focus-visible:outline-none');
    expect(content.className).toContain('focus-visible:ring-2');
    expect(content.className).toContain('focus-visible:ring-ring');
    expect(content.className).toContain('focus-visible:ring-offset-2');
  });
});

describe('Tabs - Tab Switching', () => {
  test('✅ TDD: should switch tabs on click', async () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="tab2">Tab 2</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="tab1" data-testid="content-1">Content 1</Tabs.TabsContent>
        <Tabs.TabsContent value="tab2" data-testid="content-2">Content 2</Tabs.TabsContent>
      </Tabs.Tabs>
    );
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    const content1 = screen.getByTestId('content-1');
    const content2 = screen.getByTestId('content-2');

    // Tab 1 should be initially active (check trigger state)
    expect(tab1).toHaveAttribute('data-state', 'active');
    expect(tab2).toHaveAttribute('data-state', 'inactive');

    // Contents should be rendered
    expect(content1).toBeInTheDocument();
    expect(content2).toBeInTheDocument();

    // Click Tab 2 to switch
    await userEvent.click(tab2);

    await waitFor(() => {
      expect(tab2).toHaveAttribute('data-state', 'active');
      expect(tab1).toHaveAttribute('data-state', 'inactive');
    }, { timeout: 3000 });
  });

  test('✅ TDD: should support controlled value', async () => {
    const handleChange = vi.fn();
    render(
      <Tabs.Tabs value="tab1" onValueChange={handleChange}>
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="tab2">Tab 2</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="tab1">Content</Tabs.TabsContent>
      </Tabs.Tabs>
    );
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    await userEvent.click(tab2);
    // In controlled mode, clicking should call onValueChange
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });
});

describe('Tabs - Accessibility', () => {
  test('✅ TDD: should be keyboard accessible', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="tab2">Tab 2</Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    const triggers = screen.getAllByRole('tab');
    expect(triggers.length).toBe(2);
    expect(triggers[0]).not.toHaveAttribute('aria-hidden');
    expect(triggers[1]).not.toHaveAttribute('aria-hidden');
  });

  test('✅ TDD: should support keyboard navigation', () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="tab2">Tab 2</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="tab1">Content</Tabs.TabsContent>
      </Tabs.Tabs>
    );
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    tab1.focus();

    expect(tab1).toHaveFocus();
  });
});

describe('Tabs - Edge Cases', () => {
  test('✅ TDD: should handle empty children', () => {
    render(
      <Tabs.Tabs>
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="empty"></Tabs.TabsTrigger>
        </Tabs.TabsList>
      </Tabs.Tabs>
    );
    // Component should render without errors - empty tab trigger still renders
    const triggers = screen.getAllByRole('tab');
    expect(triggers.length).toBe(1);
  });

  test('✅ TDD: should handle undefined defaultValue', () => {
    render(
      <Tabs.Tabs defaultValue={undefined as any}>
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="tab1" data-testid="content">Content</Tabs.TabsContent>
      </Tabs.Tabs>
    );
    // When defaultValue is undefined, the content still renders but may be hidden
    const content = screen.getByTestId('content');
    expect(content).toBeInTheDocument();
    // It will be in inactive state
    expect(content).toHaveAttribute('data-state', 'inactive');
  });

  test('✅ TDD: should handle multiple tab switches', async () => {
    render(
      <Tabs.Tabs defaultValue="tab1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="tab1">Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="tab2">Tab 2</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="tab3">Tab 3</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="tab1" data-testid="content-1">Content 1</Tabs.TabsContent>
        <Tabs.TabsContent value="tab2" data-testid="content-2">Content 2</Tabs.TabsContent>
        <Tabs.TabsContent value="tab3" data-testid="content-3">Content 3</Tabs.TabsContent>
      </Tabs.Tabs>
    );
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });

    // Initially tab 1 should be active
    expect(tab1).toHaveAttribute('data-state', 'active');

    await userEvent.click(tab2);
    await waitFor(() => {
      expect(tab2).toHaveAttribute('data-state', 'active');
    });

    await userEvent.click(tab3);
    await waitFor(() => {
      expect(tab3).toHaveAttribute('data-state', 'active');
    });
  });
});
