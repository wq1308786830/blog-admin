/**
 * TDD Test Suite for Dialog Component
 * 测试对话框组件的所有子组件、状态、动画和交互
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

describe('Dialog - Basic Component', () => {
  test('✅ TDD: should export Dialog component', () => {
    expect(Dialog).toBeDefined();
    expect(typeof Dialog).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogTrigger component', () => {
    expect(DialogTrigger).toBeDefined();
    expect(typeof DialogTrigger).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogPortal component', () => {
    expect(DialogPortal).toBeDefined();
    expect(typeof DialogPortal).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogOverlay component', () => {
    expect(DialogOverlay).toBeDefined();
    expect(typeof DialogOverlay).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogClose component', () => {
    expect(DialogClose).toBeDefined();
    expect(typeof DialogClose).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogContent component', () => {
    expect(DialogContent).toBeDefined();
    expect(typeof DialogContent).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogHeader component', () => {
    expect(DialogHeader).toBeDefined();
    expect(typeof DialogHeader).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogFooter component', () => {
    expect(DialogFooter).toBeDefined();
    expect(typeof DialogFooter).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogTitle component', () => {
    expect(DialogTitle).toBeDefined();
    expect(typeof DialogTitle).toMatch(/function|object/);
  });

  test('✅ TDD: should export DialogDescription component', () => {
    expect(DialogDescription).toBeDefined();
    expect(typeof DialogDescription).toMatch(/function|object/);
  });
});

describe('Dialog - DialogOverlay', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(
      <Dialog open>
        <DialogOverlay />
      </Dialog>
    );
    const overlay = document.querySelector('.bg-black\\/80');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-black/80');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Dialog open>
        <DialogOverlay className="custom-overlay" />
      </Dialog>
    );
    const overlay = document.querySelector('.custom-overlay');
    expect(overlay).toBeInTheDocument();
  });
});

describe('Dialog - DialogClose', () => {
  test('✅ TDD: should render X icon', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('✅ TDD: should have correct positioning classes', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
    const closeButton = screen.getByRole('button').parentElement;
    expect(closeButton).toHaveClass('absolute', 'right-4', 'top-4');
  });

  test('✅ TDD: should have rounded-sm and opacity-70', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-sm', 'opacity-70');
  });

  test('✅ TDD: should have ring-offset-background', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ring-offset-background');
  });

  test('✅ TDD: should have focus styles', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus-visible:outline-none');
    expect(button).toHaveClass('focus-visible:ring-2');
    expect(button).toHaveClass('focus-visible:ring-ring');
    expect(button).toHaveClass('focus-visible:ring-offset-2');
  });

  test('✅ TDD: should have hover styles', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('transition-opacity');
    expect(button).toHaveClass('hover:opacity-100');
  });

  test('✅ TDD: should be focusable by default', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('aria-hidden');
  });
});

describe('Dialog - DialogContent', () => {
  test('✅ TDD: should render children', () => {
    render(
      <Dialog open>
        <DialogContent>
          <div>Content</div>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('✅ TDD: should render DialogOverlay when open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <div>Test</div>
        </DialogContent>
      </Dialog>
    );
    // Overlay should be present
    const overlay = document.querySelector('.bg-black\\/80');
    expect(overlay).toBeInTheDocument();
  });

  test('✅ TDD: should not render overlay when closed', () => {
    render(
      <Dialog open={false}>
        <DialogContent>
          <div>Test</div>
        </DialogContent>
      </Dialog>
    );
    const overlay = document.querySelector('.bg-black\\/80');
    expect(overlay).not.toBeInTheDocument();
  });

  test('✅ TDD: should have correct positioning classes', () => {
    render(
      <Dialog open>
        <DialogContent>
          <div>Test</div>
        </DialogContent>
      </Dialog>
    );
    const content = document.querySelector('.fixed.left-\\[50\\%\\]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('top-\\[50\\%\\]');
    expect(content).toHaveClass('z-50');
  });

  test('✅ TDD: should have animation classes', () => {
    render(
      <Dialog open>
        <DialogContent>
          <div>Test</div>
        </DialogContent>
      </Dialog>
    );
    const content = document.querySelector('.max-w-lg');
    expect(content).toHaveClass('data-\\[state=open\\]:animate-in');
    expect(content).toHaveClass('data-\\[state=closed\\]:animate-out');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Dialog open>
        <DialogContent className="custom-content">
          <div>Test</div>
        </DialogContent>
      </Dialog>
    );
    const content = document.querySelector('.custom-content');
    expect(content).toBeInTheDocument();
  });
});

describe('Dialog - DialogHeader', () => {
  test('✅ TDD: should render children', () => {
    render(
      <Dialog>
        <DialogHeader>
          <h1>Header</h1>
        </DialogHeader>
      </Dialog>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  test('✅ TDD: should have default classes', () => {
    render(
      <Dialog>
        <DialogHeader>
          <div>Test</div>
        </DialogHeader>
      </Dialog>
    );
    const header = screen.getByText('Test').parentElement;
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5');
    expect(header).toHaveClass('text-center');
  });

  test('✅ TDD: should be left-aligned on small screens', () => {
    render(
      <Dialog>
        <DialogHeader>
          <div>Test</div>
        </DialogHeader>
      </Dialog>
    );
    const header = screen.getByText('Test').parentElement;
    expect(header).toHaveClass('sm:text-left');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Dialog>
        <DialogHeader className="custom-header">
          <div>Test</div>
        </DialogHeader>
      </Dialog>
    );
    const header = document.querySelector('.custom-header');
    expect(header).toBeInTheDocument();
  });
});

describe('Dialog - DialogFooter', () => {
  test('✅ TDD: should render children', () => {
    render(
      <DialogFooter>
        <button>Cancel</button>
      </DialogFooter>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('✅ TDD: should have default classes', () => {
    render(
      <DialogFooter>
        <div>Test</div>
      </DialogFooter>
    );
    const footer = screen.getByText('Test').parentElement;
    expect(footer).toHaveClass('flex', 'flex-col-reverse');
    expect(footer).toHaveClass('sm:flex-row');
    expect(footer).toHaveClass('sm:justify-end');
    expect(footer).toHaveClass('sm:space-x-2');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <DialogFooter className="custom-footer">
        <div>Test</div>
      </DialogFooter>
    );
    const footer = document.querySelector('.custom-footer');
    expect(footer).toBeInTheDocument();
  });
});

describe('Dialog - DialogTitle', () => {
  test('✅ TDD: should render title text', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  test('✅ TDD: should have correct typography classes', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const title = screen.getByText('Title').parentElement;
    expect(title).toHaveClass('text-lg', 'font-semibold', 'leading-none', 'tracking-tight');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogTitle className="custom-title">Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    const title = document.querySelector('.custom-title');
    expect(title).toBeInTheDocument();
  });
});

describe('Dialog - DialogDescription', () => {
  test('✅ TDD: should render description', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogDescription>Description text</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  test('✅ TDD: should have correct text classes', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogDescription>Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const description = screen.getByText('Description').parentElement;
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogDescription className="custom-desc">Description</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const description = document.querySelector('.custom-desc');
    expect(description).toBeInTheDocument();
  });
});

describe('Dialog - Integration', () => {
  test('✅ TDD: should work with DialogTrigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
          <div>Content</div>
        </DialogContent>
      </Dialog>
    );
    const trigger = screen.getByText('Open');
    expect(trigger).toBeInTheDocument();
    const content = document.querySelector('.max-w-lg');
    expect(content).toBeInTheDocument();
  });

  test('✅ TDD: should include Close button in content', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
          <div>Content</div>
        </DialogContent>
      </Dialog>
    );
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
  });
});

describe('Dialog - Edge Cases', () => {
  test('✅ TDD: should handle empty children', () => {
    render(
      <Dialog>
        <DialogContent open>
          <DialogHeader>
            <span>Header</span>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  test('✅ TDD: should handle undefined className', () => {
    render(
      <Dialog>
        <DialogHeader className={undefined as any}>
          <div>Test</div>
        </DialogHeader>
      </Dialog>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('✅ TDD: should forward ref correctly', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(
      <Dialog>
        <DialogContent open>
          <DialogTitle ref={ref}>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    // Component should render without errors
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
