/**
 * TDD Test Suite for Toast Utility Functions
 * 测试消息提示工具函数的所有类型和调用
 */

import { describe, it, expect, vi } from 'vitest';
import { showToast, showSuccess, showError, showInfo, showWarning } from './toast';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Toast Utility Functions - showToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call toast.success for success type', () => {
    showToast('Success message', 'success');
    expect(toast.success).toHaveBeenCalledWith('Success message');
  });

  test('✅ TDD: should call toast.error for error type', () => {
    showToast('Error message', 'error');
    expect(toast.error).toHaveBeenCalledWith('Error message');
  });

  test('✅ TDD: should call toast.warning for warning type', () => {
    showToast('Warning message', 'warning');
    expect(toast.warning).toHaveBeenCalledWith('Warning message');
  });

  test('✅ TDD: should call toast.info for info type (default)', () => {
    showToast('Info message', 'info');
    expect(toast.info).toHaveBeenCalledWith('Info message');
  });

  test('✅ TDD: should default to info when type not provided', () => {
    showToast('Default message');
    expect(toast.info).toHaveBeenCalledWith('Default message');
  });
});

describe('Toast Utility Functions - showSuccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call toast.success', () => {
    showSuccess('Success message');
    expect(toast.success).toHaveBeenCalledWith('Success message');
  });

  test('✅ TDD: should accept single argument', () => {
    showSuccess('Single arg');
    expect(toast.success).toHaveBeenCalledWith('Single arg');
  });

  test('✅ TDD: should accept message with emoji', () => {
    showSuccess('✅ Success');
    expect(toast.success).toHaveBeenCalledWith('✅ Success');
  });
});

describe('Toast Utility Functions - showError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call toast.error', () => {
    showError('Error message');
    expect(toast.error).toHaveBeenCalledWith('Error message');
  });

  test('✅ TDD: should pass error message', () => {
    showError('Validation failed');
    expect(toast.error).toHaveBeenCalledWith('Validation failed');
  });

  test('✅ TDD: should accept empty message', () => {
    showError('');
    expect(toast.error).toHaveBeenCalledWith('');
  });
});

describe('Toast Utility Functions - showInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call toast.info', () => {
    showInfo('Info message');
    expect(toast.info).toHaveBeenCalledWith('Info message');
  });

  test('✅ TDD: should accept informational message', () => {
    showInfo('Your data has been saved');
    expect(toast.info).toHaveBeenCalledWith('Your data has been saved');
  });
});

describe('Toast Utility Functions - showWarning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call toast.warning', () => {
    showWarning('Warning message');
    expect(toast.warning).toHaveBeenCalledWith('Warning message');
  });

  test('✅ TDD: should accept warning message', () => {
    showWarning('Please check your input');
    expect(toast.warning).toHaveBeenCalledWith('Please check your input');
  });

  test('✅ TDD: should accept warning with icon emoji', () => {
    showWarning('⚠️ Warning');
    expect(toast.warning).toHaveBeenCalledWith('⚠️ Warning');
  });
});

describe('Toast Utility Functions - Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should work with all toast types in sequence', () => {
    showSuccess('Step 1 complete');
    showInfo('Step 2 in progress');
    showWarning('Step 3 has issues');
    showError('Step 4 failed');

    expect(toast.success).toHaveBeenCalledWith('Step 1 complete');
    expect(toast.info).toHaveBeenCalledWith('Step 2 in progress');
    expect(toast.warning).toHaveBeenCalledWith('Step 3 has issues');
    expect(toast.error).toHaveBeenCalledWith('Step 4 failed');
  });

  test('✅ TDD: should handle rapid toast calls', () => {
    for (let i = 0; i < 10; i++) {
      showSuccess(`Message ${i}`);
    }
    expect(toast.success).toHaveBeenCalledTimes(10);
  });

  test('✅ TDD: should handle all wrapper functions', () => {
    showSuccess('Using showSuccess');
    showError('Using showError');
    showInfo('Using showInfo');
    showWarning('Using showWarning');
    showToast('Using showToast', 'info');

    expect(toast.success).toHaveBeenCalledWith('Using showSuccess');
    expect(toast.error).toHaveBeenCalledWith('Using showError');
    expect(toast.info).toHaveBeenCalledWith('Using showInfo');
    expect(toast.warning).toHaveBeenCalledWith('Using showWarning');
    expect(toast.info).toHaveBeenCalledWith('Using showToast');
  });
});

describe('Toast Utility Functions - Type Safety', () => {
  test('✅ TDD: should be type-safe for all functions', () => {
    expect(typeof showSuccess).toBe('function');
    expect(typeof showError).toBe('function');
    expect(typeof showInfo).toBe('function');
    expect(typeof showWarning).toBe('function');
    expect(typeof showToast).toBe('function');
  });

  test('✅ TDD: should accept only string messages', () => {
    showSuccess('String message');
    showError('Error string');
    showInfo('Info string');
    showWarning('Warning string');
    showToast('Toast string', 'info');

    expect(toast.success).toHaveBeenCalledWith('String message');
    expect(toast.error).toHaveBeenCalledWith('Error string');
    expect(toast.info).toHaveBeenCalledWith('Info string');
    expect(toast.warning).toHaveBeenCalledWith('Warning string');
    expect(toast.info).toHaveBeenCalledWith('Toast string');
  });

  test('✅ TDD: should handle empty strings', () => {
    showSuccess('');
    showError('');
    showInfo('');
    showWarning('');

    expect(toast.success).toHaveBeenCalledWith('');
    expect(toast.error).toHaveBeenCalledWith('');
    expect(toast.info).toHaveBeenCalledWith('');
    expect(toast.warning).toHaveBeenCalledWith('');
  });

  test('✅ TDD: should handle special characters in messages', () => {
    showSuccess('✅ Success! <b>Bold</b> &nbsp;');
    showError('⚠️ <i>Warning</i>');
    showInfo('📝 <u>Info</u>');
    showWarning('💥 <s>Strike</s>');

    expect(toast.success).toHaveBeenCalledWith('✅ Success! <b>Bold</b> &nbsp;');
    expect(toast.error).toHaveBeenCalledWith('⚠️ <i>Warning</i>');
    expect(toast.info).toHaveBeenCalledWith('📝 <u>Info</u>');
    expect(toast.warning).toHaveBeenCalledWith('💥 <s>Strike</s>');
  });
});

describe('Toast Utility Functions - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should handle very long messages', () => {
    const longMessage = 'A'.repeat(1000);
    showSuccess(longMessage);
    expect(toast.success).toHaveBeenCalledWith(longMessage);
  });

  test('✅ TDD: should handle messages with newlines', () => {
    const multiLineMessage = 'Line 1\nLine 2\nLine 3';
    showSuccess(multiLineMessage);
    expect(toast.success).toHaveBeenCalledWith(multiLineMessage);
  });

  test('✅ TDD: should handle messages with tabs', () => {
    const messageWithTabs = 'Tab\tSeparated';
    showSuccess(messageWithTabs);
    expect(toast.success).toHaveBeenCalledWith(messageWithTabs);
  });

  test('✅ TDD: should handle unicode messages', () => {
    const unicodeMessage = 'Success 🎉 Party 🥳';
    showSuccess(unicodeMessage);
    expect(toast.success).toHaveBeenCalledWith(unicodeMessage);
  });

  test('✅ TDD: should handle numeric string messages', () => {
    showSuccess('12345');
    showError('0 items');
    expect(toast.success).toHaveBeenCalledWith('12345');
    expect(toast.error).toHaveBeenCalledWith('0 items');
  });

  test('✅ TDD: should handle multiple simultaneous calls', () => {
    showSuccess('First');
    showError('Second');
    showInfo('Third');
    showWarning('Fourth');

    expect(toast.success).toHaveBeenCalledWith('First');
    expect(toast.error).toHaveBeenCalledWith('Second');
    expect(toast.info).toHaveBeenCalledWith('Third');
    expect(toast.warning).toHaveBeenCalledWith('Fourth');
  });
});
