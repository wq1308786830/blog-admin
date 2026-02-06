import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Spin } from './spin';

describe('Spin Component', () => {
  describe('Basic Rendering', () => {
    it('should render spinner by default', () => {
      render(<Spin />);
      const spinner = screen.getByRole('img', { name: 'loading' });
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should not render when spinning is false', () => {
      render(<Spin spinning={false} />);
      const spinner = screen.queryByRole('img', { name: 'loading' });
      expect(spinner).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Spin className="custom-class" />);
      const container = screen.getByRole('img', { name: 'loading' }).parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      render(<Spin size="small" />);
      const spinner = screen.getByRole('img', { name: 'loading' });
      expect(spinner).toHaveClass('h-4', 'w-4');
    });

    it('should render default size', () => {
      render(<Spin size="default" />);
      const spinner = screen.getByRole('img', { name: 'loading' });
      expect(spinner).toHaveClass('h-5', 'w-5');
    });

    it('should render large size', () => {
      render(<Spin size="large" />);
      const spinner = screen.getByRole('img', { name: 'loading' });
      expect(spinner).toHaveClass('h-8', 'w-8');
    });
  });

  describe('Tip/Description', () => {
    it('should render tip text', () => {
      render(<Spin tip="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not render tip when empty', () => {
      render(<Spin />);
      const tip = screen.queryByText(/.*/, { selector: 'p' });
      expect(tip).not.toBeInTheDocument();
    });
  });

  describe('Custom Indicator', () => {
    it('should render custom indicator', () => {
      const CustomIndicator = () => <div data-testid="custom-indicator">Custom</div>;
      render(<Spin indicator={<CustomIndicator />} />);
      expect(screen.getByTestId('custom-indicator')).toBeInTheDocument();
    });

    it('should not render default spinner when custom indicator provided', () => {
      const CustomIndicator = () => <div data-testid="custom-indicator">Custom</div>;
      render(<Spin indicator={<CustomIndicator />} />);
      const defaultSpinner = screen.queryByRole('img', { name: 'loading' });
      expect(defaultSpinner).not.toBeInTheDocument();
    });

    it('should render custom indicator with tip', () => {
      const CustomIndicator = () => <div data-testid="custom-indicator">Custom</div>;
      render(<Spin indicator={<CustomIndicator />} tip="Custom loading" />);
      expect(screen.getByTestId('custom-indicator')).toBeInTheDocument();
      expect(screen.getByText('Custom loading')).toBeInTheDocument();
    });
  });

  describe('Wrapped Content Mode', () => {
    it('should render children when not spinning', () => {
      render(
        <Spin spinning={false}>
          <div>Content</div>
        </Spin>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render overlay when spinning with children', () => {
      render(
        <Spin spinning={true}>
          <div>Content</div>
        </Spin>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
      const spinner = screen.getByRole('img', { name: 'loading' });
      expect(spinner).toBeInTheDocument();
    });

    it('should apply opacity to content when spinning', () => {
      render(
        <Spin spinning={true}>
          <div>Content</div>
        </Spin>
      );
      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('opacity-30', 'pointer-events-none');
    });

    it('should not apply opacity when not spinning', () => {
      render(
        <Spin spinning={false}>
          <div>Content</div>
        </Spin>
      );
      const content = screen.getByText('Content').parentElement;
      expect(content).not.toHaveClass('opacity-30', 'pointer-events-none');
    });

    it('should apply wrapperClassName', () => {
      render(
        <Spin spinning={true} wrapperClassName="custom-wrapper">
          <div>Content</div>
        </Spin>
      );
      const wrapper = screen.getByText('Content').parentElement?.parentElement;
      expect(wrapper).toHaveClass('custom-wrapper');
    });

    it('should apply wrapperStyle', () => {
      const customStyle = { backgroundColor: 'red' };
      render(
        <Spin spinning={true} wrapperStyle={customStyle}>
          <div>Content</div>
        </Spin>
      );
      const wrapper = screen.getByText('Content').parentElement;
      // wrapper 现在是直接包装内容的 div，应用了 wrapperStyle
      // 使用 RGB 格式，因为浏览器会将颜色转换为 RGB
      expect(wrapper).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
    });
  });

  describe('Delay Feature', () => {
    it('should show immediately when delay is 0', () => {
      render(<Spin spinning={true} delay={0} />);
      expect(screen.getByRole('img', { name: 'loading' })).toBeInTheDocument();
    });

    it('should delay showing spinner', async () => {
      render(<Spin spinning={true} delay={300} />);
      expect(screen.queryByRole('img', { name: 'loading' })).not.toBeInTheDocument();

      await waitFor(
        () => {
          expect(screen.getByRole('img', { name: 'loading' })).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should clear delay if spinning becomes false before delay completes', async () => {
      const { rerender } = render(<Spin spinning={true} delay={500} />);
      expect(screen.queryByRole('img', { name: 'loading' })).not.toBeInTheDocument();

      rerender(<Spin spinning={false} delay={500} />);

      await waitFor(
        () => {
          expect(screen.queryByRole('img', { name: 'loading' })).not.toBeInTheDocument();
        },
        { timeout: 600 }
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(<Spin />);
      const spinner = screen.getByRole('img', { name: 'loading' });
      expect(spinner).toHaveAttribute('aria-label', 'loading');
    });

    it('should pass through other props', () => {
      render(<Spin data-testid="test-spin" />);
      expect(screen.getByTestId('test-spin')).toBeInTheDocument();
    });
  });
});
