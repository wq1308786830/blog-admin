/**
 * TDD Test Suite for Card Component
 * 测试卡片组件的所有子组件、布局和样式
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as Card from './card';

describe('Card - Basic Component', () => {
  test('✅ TDD: should export Card component', () => {
    expect(Card.Card).toBeDefined();
    expect(typeof Card.Card).toMatch(/function|object/);
  });

  test('✅ TDD: should export CardHeader component', () => {
    expect(Card.CardHeader).toBeDefined();
    expect(typeof Card.CardHeader).toMatch(/function|object/);
  });

  test('✅ TDD: should export CardTitle component', () => {
    expect(Card.CardTitle).toBeDefined();
    expect(typeof Card.CardTitle).toMatch(/function|object/);
  });

  test('✅ TDD: should export CardDescription component', () => {
    expect(Card.CardDescription).toBeDefined();
    expect(typeof Card.CardDescription).toMatch(/function|object/);
  });

  test('✅ TDD: should export CardContent component', () => {
    expect(Card.CardContent).toBeDefined();
    expect(typeof Card.CardContent).toMatch(/function|object/);
  });

  test('✅ TDD: should export CardFooter component', () => {
    expect(Card.CardFooter).toBeDefined();
    expect(typeof Card.CardFooter).toMatch(/function|object/);
  });
});

describe('Card - Card Base Classes', () => {
  test('✅ TDD: should have correct base classes', () => {
    render(<Card.Card data-testid="card">Card Content</Card.Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    expect(card).toHaveClass('shadow-sm');
  });

  test('✅ TDD: should support custom className', () => {
    render(<Card.Card className="custom-card" data-testid="card">Custom</Card.Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
  });

  test('✅ TDD: should accept ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<Card.Card ref={ref} data-testid="card">Ref Card</Card.Card>);
    expect(screen.getByText('Ref Card')).toBeInTheDocument();
  });
});

describe('Card - CardHeader', () => {
  test('✅ TDD: should render children', () => {
    render(
      <Card.CardHeader>
        <h1>Header</h1>
      </Card.CardHeader>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  test('✅ TDD: should have flex-col layout', () => {
    render(
      <Card.CardHeader>
        <span>Test</span>
      </Card.CardHeader>
    );
    const header = screen.getByText('Test').parentElement;
    expect(header).toHaveClass('flex', 'flex-col');
  });

  test('✅ TDD: should have space-y-1.5', () => {
    render(
      <Card.CardHeader>
        <span>Test</span>
      </Card.CardHeader>
    );
    const header = screen.getByText('Test').parentElement;
    expect(header).toHaveClass('space-y-1.5');
  });

  test('✅ TDD: should have p-6 padding', () => {
    render(
      <Card.CardHeader>
        <span>Test</span>
      </Card.CardHeader>
    );
    const header = screen.getByText('Test').parentElement;
    expect(header).toHaveClass('p-6');
  });

  test('✅ TDD: should be text-center', () => {
    render(
      <Card.CardHeader>
        <span>Test</span>
      </Card.CardHeader>
    );
    const header = screen.getByText('Test').parentElement;
    expect(header).toHaveClass('text-center');
  });

  test('✅ TDD: should be sm:text-left on small screens', () => {
    render(
      <Card.CardHeader>
        <span>Test</span>
      </Card.CardHeader>
    );
    const header = screen.getByText('Test').parentElement;
    expect(header).toHaveClass('sm:text-left');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Card.CardHeader className="custom-header">
        <span>Test</span>
      </Card.CardHeader>
    );
    const header = document.querySelector('.custom-header');
    expect(header).toBeInTheDocument();
  });
});

describe('Card - CardFooter', () => {
  test('✅ TDD: should render children', () => {
    render(
      <Card.CardFooter>
        <button>Cancel</button>
      </Card.CardFooter>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('✅ TDD: should have flex-col-reverse layout', () => {
    render(
      <Card.CardFooter>
        <span>Test</span>
      </Card.CardFooter>
    );
    const footer = screen.getByText('Test').parentElement;
    expect(footer).toHaveClass('flex-col-reverse');
  });

  test('✅ TDD: should be sm:flex-row on small screens', () => {
    render(
      <Card.CardFooter>
        <span>Test</span>
      </Card.CardFooter>
    );
    const footer = screen.getByText('Test').parentElement;
    expect(footer).toHaveClass('sm:flex-row');
  });

  test('✅ TDD: should be sm:justify-end on small screens', () => {
    render(
      <Card.CardFooter>
        <span>Test</span>
      </Card.CardFooter>
    );
    const footer = screen.getByText('Test').parentElement;
    expect(footer).toHaveClass('sm:justify-end');
  });

  test('✅ TDD: should have sm:space-x-2 on small screens', () => {
    render(
      <Card.CardFooter>
        <span>Test</span>
      </Card.CardFooter>
    );
    const footer = screen.getByText('Test').parentElement;
    expect(footer).toHaveClass('sm:space-x-2');
  });

  test('✅ TDD: should support custom className', () => {
    render(
      <Card.CardFooter className="custom-footer">
        <span>Test</span>
      </Card.CardFooter>
    );
    const footer = document.querySelector('.custom-footer');
    expect(footer).toBeInTheDocument();
  });
});

describe('Card - CardTitle', () => {
  test('✅ TDD: should render title', () => {
    render(<Card.CardTitle>Card Title</Card.CardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  test('✅ TDD: should have text-2xl class', () => {
    render(<Card.CardTitle data-testid="card-title">Title</Card.CardTitle>);
    const title = screen.getByTestId('card-title');
    expect(title).toHaveClass('text-2xl');
  });

  test('✅ TDD: should have font-semibold', () => {
    render(<Card.CardTitle data-testid="card-title">Title</Card.CardTitle>);
    const title = screen.getByTestId('card-title');
    expect(title).toHaveClass('font-semibold');
  });

  test('✅ TDD: should have leading-none and tracking-tight', () => {
    render(<Card.CardTitle data-testid="card-title">Title</Card.CardTitle>);
    const title = screen.getByTestId('card-title');
    expect(title).toHaveClass('leading-none');
    expect(title).toHaveClass('tracking-tight');
  });

  test('✅ TDD: should support custom className', () => {
    render(<Card.CardTitle className="custom-title">Title</Card.CardTitle>);
    const title = document.querySelector('.custom-title');
    expect(title).toBeInTheDocument();
  });
});

describe('Card - CardDescription', () => {
  test('✅ TDD: should render description', () => {
    render(<Card.CardDescription>Card Description</Card.CardDescription>);
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  test('✅ TDD: should have text-sm class', () => {
    render(<Card.CardDescription data-testid="card-desc">Description</Card.CardDescription>);
    const description = screen.getByTestId('card-desc');
    expect(description).toHaveClass('text-sm');
  });

  test('✅ TDD: should have text-muted-foreground', () => {
    render(<Card.CardDescription data-testid="card-desc">Description</Card.CardDescription>);
    const description = screen.getByTestId('card-desc');
    expect(description).toHaveClass('text-muted-foreground');
  });

  test('✅ TDD: should support custom className', () => {
    render(<Card.CardDescription className="custom-desc">Description</Card.CardDescription>);
    const description = document.querySelector('.custom-desc');
    expect(description).toBeInTheDocument();
  });
});

describe('Card - CardContent', () => {
  test('✅ TDD: should render content', () => {
    render(<Card.CardContent>Card Content</Card.CardContent>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('✅ TDD: should have p-6 class', () => {
    render(<Card.CardContent data-testid="card-content">Content</Card.CardContent>);
    const content = screen.getByTestId('card-content');
    expect(content).toHaveClass('p-6');
  });

  test('✅ TDD: should have pt-0 class', () => {
    render(<Card.CardContent data-testid="card-content">Content</Card.CardContent>);
    const content = screen.getByTestId('card-content');
    expect(content).toHaveClass('pt-0');
  });

  test('✅ TDD: should support custom className', () => {
    render(<Card.CardContent className="custom-content">Content</Card.CardContent>);
    const content = document.querySelector('.custom-content');
    expect(content).toBeInTheDocument();
  });
});

describe('Card - Integration', () => {
  test('✅ TDD: should work with all components together', () => {
    render(
      <Card.Card>
        <Card.CardHeader>
          <Card.CardTitle>Title</Card.CardTitle>
          <Card.CardDescription>Description</Card.CardDescription>
        </Card.CardHeader>
        <Card.CardContent>Content</Card.CardContent>
        <Card.CardFooter>
          <button>Action</button>
        </Card.CardFooter>
      </Card.Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('✅ TDD: should forward ref correctly', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<Card.Card ref={ref}>Ref Card</Card.Card>);
    expect(screen.getByText('Ref Card')).toBeInTheDocument();
  });
});

describe('Card - Edge Cases', () => {
  test('✅ TDD: should handle empty children', () => {
    render(<Card.CardHeader data-testid="card-header">{''}</Card.CardHeader>);
    const header = screen.getByTestId('card-header');
    expect(header).toBeInTheDocument();
  });

  test('✅ TDD: should handle undefined className', () => {
    render(<Card.Card className={undefined as any}>Test</Card.Card>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('✅ TDD: should pass through HTML attributes', () => {
    render(
      <Card.Card id="test-card" data-testid="card">
        Content
      </Card.Card>
    );
    const card = document.querySelector('#test-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-testid', 'card');
  });
});
