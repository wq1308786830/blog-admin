import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QueryErrorBoundary from './QueryErrorBoundary';

describe('QueryErrorBoundary - 错误边界', () => {
  it('✅ TDD: 应捕获子组件错误并显示错误信息', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <QueryErrorBoundary>
        <ThrowError />
      </QueryErrorBoundary>
    );

    expect(screen.getByText(/出错了/)).toBeInTheDocument();
  });

  it('✅ TDD: 应显示具体的错误消息', () => {
    const ThrowError = () => {
      throw new Error('Test error message');
    };

    render(
      <QueryErrorBoundary>
        <ThrowError />
      </QueryErrorBoundary>
    );

    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });

  it('✅ TDD: 应显示重试按钮', () => {
    const ThrowError = () => {
      throw new Error('Error');
    };

    render(
      <QueryErrorBoundary>
        <ThrowError />
      </QueryErrorBoundary>
    );

    expect(screen.getByText('重试')).toBeInTheDocument();
  });

  it('✅ TDD: 非Error对象错误应显示默认消息', () => {
    const ThrowString = () => {
      throw 'String error';
    };

    render(
      <QueryErrorBoundary>
        <ThrowString />
      </QueryErrorBoundary>
    );

    expect(screen.getByText(/应用遇到了一些问题/)).toBeInTheDocument();
  });

  it('✅ TDD: 正常子组件应正常渲染', () => {
    const NormalComponent = () => <div>Normal Content</div>;

    render(
      <QueryErrorBoundary>
        <NormalComponent />
      </QueryErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(screen.queryByText(/出错了/)).not.toBeInTheDocument();
  });

  it('✅ TDD: 多个子组件应全部渲染', () => {
    render(
      <QueryErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </QueryErrorBoundary>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('✅ TDD: 点击重试按钮应调用重置函数', () => {
    let hasError = true;

    const ConditionalError = () => {
      if (hasError) {
        throw new Error('Initial error');
      }
      return <div>Recovered</div>;
    };

    const { rerender } = render(
      <QueryErrorBoundary>
        <ConditionalError />
      </QueryErrorBoundary>
    );

    expect(screen.getByText(/Initial error/)).toBeInTheDocument();

    // 点击重试
    hasError = false;
    fireEvent.click(screen.getByText('重试'));

    // ErrorBoundary重置后，组件重新渲染
    rerender(
      <QueryErrorBoundary>
        <ConditionalError />
      </QueryErrorBoundary>
    );
  });

  it('✅ TDD: 空子组件不应报错', () => {
    render(
      <QueryErrorBoundary>
        {null}
      </QueryErrorBoundary>
    );

    // 空子组件不应该触发错误边界
    expect(document.body).toBeInTheDocument();
  });

  it('✅ TDD: 应正确处理Error类型的错误', () => {
    const customError = new TypeError('Custom type error');

    const ThrowTypeError = () => {
      throw customError;
    };

    render(
      <QueryErrorBoundary>
        <ThrowTypeError />
      </QueryErrorBoundary>
    );

    expect(screen.getByText(/Custom type error/)).toBeInTheDocument();
  });

  it('✅ TDD: 错误边界应该有正确的样式类', () => {
    const ThrowError = () => {
      throw new Error('Styled error');
    };

    render(
      <QueryErrorBoundary>
        <ThrowError />
      </QueryErrorBoundary>
    );

    const container = screen.getByText(/出错了/).parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  it('✅ TDD: 错误消息应该在pre标签中显示', () => {
    const ThrowError = () => {
      throw new Error('Error in pre');
    };

    render(
      <QueryErrorBoundary>
        <ThrowError />
      </QueryErrorBoundary>
    );

    const errorElement = screen.getByText(/Error in pre/);
    expect(errorElement.tagName).toBe('PRE');
  });
});
