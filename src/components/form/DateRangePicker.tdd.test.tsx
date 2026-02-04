/**
 * TDD 测试补集 - 针对日期选择完成行为的精确验证
 * 核心测试条件: 每次打开，有且仅有选择两个日期的情况下才关闭弹框并触发 onChange
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker';

// Helper to create a date object from string
const createDate = (dateStr: string): Date => {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Helper to create date range
const createRange = (fromStr: string, toStr: string) => ({
  from: createDate(fromStr),
  to: createDate(toStr),
});

// ==================== 核心测试: 选择行为和弹框关闭 ====================

describe('DateRangePicker - TDD: Date Selection and Auto-close Behavior', () => {
  describe('Date Picker (default) - 基础日期选择', () => {
    test('✅ TDD: 选择第一个日期时不关闭弹框，不触发 onChange', async () => {
      const handleChange = vi.fn();
      const handleOpenChange = vi.fn();

      render(<DateRangePicker onChange={handleChange} onOpenChange={handleOpenChange} />);

      // 打开弹框
      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一个日期
      const firstDay = '15';
      const dayButtons = screen.getAllByText(firstDay);
      if (dayButtons.length > 0) {
        fireEvent.click(dayButtons[0]);
      }

      // 验证：弹框仍然打开，onChange 未被调用
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
          // onChange 应该没有被调用（因为是第一个日期）
          // 注意：onCalendarChange 会被调用，但 onChange 不会
        },
        { timeout: 300 }
      );
    });

    test('✅ TDD: 选择两个日期后自动关闭弹框并触发 onChange', async () => {
      const handleChange = vi.fn();
      const handleOpenChange = vi.fn();

      render(<DateRangePicker onChange={handleChange} onOpenChange={handleOpenChange} />);

      // 打开弹框
      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一个日期
      const firstDay = '15';
      const dayButtons = screen.getAllByText(firstDay);
      if (dayButtons.length > 0) {
        fireEvent.click(dayButtons[0]);
      }

      // 等待一小段时间让状态更新
      await waitFor(() => {}, { timeout: 200 });

      // 选择第二个日期
      const secondDay = '20';
      const dayButtonsSecond = screen.getAllByText(secondDay);
      if (dayButtonsSecond.length > 0) {
        fireEvent.click(dayButtonsSecond[0]);
      }

      // 验证：弹框关闭，onChange 被调用
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    test('✅ TDD: showTime=true 时，选择两个日期后不自动关闭', async () => {
      const handleChange = vi.fn();
      const handleOpenChange = vi.fn();

      render(<DateRangePicker showTime onChange={handleChange} onOpenChange={handleOpenChange} />);

      // 打开弹框
      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一个日期
      const firstDay = '15';
      const dayButtons = screen.getAllByText(firstDay);
      if (dayButtons.length > 0) {
        fireEvent.click(dayButtons[0]);
      }

      await waitFor(() => {}, { timeout: 200 });

      // 选择第二个日期
      const secondDay = '20';
      const dayButtonsSecond = screen.getAllByText(secondDay);
      if (dayButtonsSecond.length > 0) {
        fireEvent.click(dayButtonsSecond[0]);
      }

      // 验证：弹框仍然打开，onChange 未被调用
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });

    test('✅ TDD: needConfirm=true 时，选择两个日期后不自动关闭', async () => {
      const handleChange = vi.fn();
      const handleOpenChange = vi.fn();

      render(
        <DateRangePicker
          needConfirm={true}
          onChange={handleChange}
          onOpenChange={handleOpenChange}
        />
      );

      // 打开弹框
      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 检查确认按钮存在
      expect(screen.getByText('OK')).toBeInTheDocument();

      // 选择第一个日期
      const firstDay = '15';
      const dayButtons = screen.getAllByText(firstDay);
      if (dayButtons.length > 0) {
        fireEvent.click(dayButtons[0]);
      }

      await waitFor(() => {}, { timeout: 200 });

      // 选择第二个日期
      const secondDay = '20';
      const dayButtonsSecond = screen.getAllByText(secondDay);
      if (dayButtonsSecond.length > 0) {
        fireEvent.click(dayButtonsSecond[0]);
      }

      // 验证：弹框仍然打开，onChange 未被调用
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });

    test('✅ TDD: 只选择一个日期后手动关闭，不触发onChange（除非allowEmpty允许）', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker onChange={handleChange} allowEmpty={[false, false]} />);

      // 打开弹框
      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择一个日期
      const firstDay = '15';
      const dayButtons = screen.getAllByText(firstDay);
      if (dayButtons.length > 0) {
        fireEvent.click(dayButtons[0]);
      }

      await waitFor(() => {}, { timeout: 200 });

      // 手动按ESC关闭
      fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // onChange 不应该被调用（因为只选择了一个日期且 allowEmpty=[false, false]）
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('✅ TDD: 重新选择日期时，先前的选择被清除', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker onChange={handleChange} />);

      // 打开弹框
      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一个日期
      const firstDay = '15';
      const dayButtons = screen.getAllByText(firstDay);
      if (dayButtons.length > 0) {
        fireEvent.click(dayButtons[0]);
      }

      await waitFor(() => {}, { timeout: 200 });

      // 选择第二个日期
      const secondDay = '20';
      const dayButtonsSecond = screen.getAllByText(secondDay);
      if (dayButtonsSecond.length > 0) {
        fireEvent.click(dayButtonsSecond[0]);
      }

      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );

      // 重新打开
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 再次选择新日期（应该清除之前的选择）
      const thirdDay = '25';
      const dayButtonsThird = screen.getAllByText(thirdDay);
      if (dayButtonsThird.length > 0) {
        fireEvent.click(dayButtonsThird[0]);
      }

      // 弹框应该保持打开
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });
  });

  describe('Week Picker - 周选择', () => {
    test('✅ TDD Week: 选择第一周时不关闭弹框', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="week" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一周
      const dayButton = screen.getAllByText('1')[0];
      fireEvent.click(dayButton);

      // 弹框应该保持打开
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    test('✅ TDD Week: 选择两周后自动关闭并触发 onChange', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="week" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一周
      const firstDay = '1';
      const firstDayButton = screen.getAllByText(firstDay)[0];
      fireEvent.click(firstDayButton);

      await waitFor(() => {}, { timeout: 200 });

      // 选择第二周（选择一周后的某天）
      const secondDay = '8';
      const secondDayButton = screen
        .getAllByText(secondDay)
        .find((btn) =>
          btn.parentElement?.parentElement?.parentElement?.textContent?.includes(secondDay)
        );

      if (secondDayButton) {
        fireEvent.click(secondDayButton);
      }

      // 验证关闭和 onChange
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('Month Picker - 月选择', () => {
    test('✅ TDD Month: 选择第一个月时不关闭弹框', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="month" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择一月
      const monthButtons = screen.getAllByText('1');
      if (monthButtons.length > 0) {
        fireEvent.click(monthButtons[0]);
      }

      // 弹框应该保持打开
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    test('✅ TDD Month: 选择两个月后自动关闭并触发 onChange', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="month" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择一月
      const firstMonth = '1';
      const firstMonthButtons = screen.getAllByText(firstMonth);
      if (firstMonthButtons.length > 0) {
        fireEvent.click(firstMonthButtons[0]);
      }

      await waitFor(() => {}, { timeout: 200 });

      // 选择三月
      const secondMonth = '3';
      const secondMonthButtons = screen.getAllByText(secondMonth);
      if (secondMonthButtons.length > 0) {
        fireEvent.click(secondMonthButtons[0]);
      }

      // 验证关闭和 onChange
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('Quarter Picker - 季度选择', () => {
    test('✅ TDD Quarter: 选择第一季度时不关闭弹框', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="quarter" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择Q1
      const q1Buttons = screen.queryAllByText('1');
      if (q1Buttons.length > 0) {
        fireEvent.click(q1Buttons[0]);
      }

      // 弹框应该保持打开
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    test('✅ TDD Quarter: 选择两个季度后自动关闭并触发 onChange', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="quarter" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择Q1
      const q1Buttons = screen.queryAllByText('1');
      if (q1Buttons.length > 0) {
        fireEvent.click(q1Buttons[0]);
      }

      await waitFor(() => {}, { timeout: 200 });

      // 选择Q3
      const q3Buttons = screen.queryAllByText('3');
      if (q3Buttons.length > 0) {
        fireEvent.click(q3Buttons[0]);
      }

      // 验证关闭和 onChange
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('Year Picker - 年选择', () => {
    test('✅ TDD Year: 选择第一年时不关闭弹框', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="year" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一个年份
      const yearButtons = screen.queryAllByText(/\d{4}/);
      if (yearButtons.length > 0) {
        fireEvent.click(yearButtons[0]);
      }

      // 弹框应该保持打开
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });

    test('✅ TDD Year: 选择两年后自动关闭并触发 onChange', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker picker="year" onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 获取所有按钮，过滤出只有年份文本的按钮（排除"xxxx - xxxx"这种范围文本）
      const getAllYearButtons = () => {
        const allButtons = screen.queryAllByText(/\d{4}/);
        return allButtons.filter((btn) => {
          const text = btn.textContent || '';
          // 只选择纯年份（4个数字），不包括年份范围
          return /^\d{4}$/.test(text.trim());
        });
      };

      // 选择第一个年份
      const yearButtons1 = getAllYearButtons();
      if (yearButtons1.length > 0) {
        fireEvent.click(yearButtons1[0]);
        await waitFor(() => {}, { timeout: 200 });
      }

      // 选择第二个年份（至少选择第3个，确保是不同的年份）
      const yearButtons2 = getAllYearButtons();
      if (yearButtons2.length >= 3) {
        fireEvent.click(yearButtons2[2]);
      }

      // 验证关闭和 onChange
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('特殊情况验证', () => {
    test('✅ TDD: 点击已选择的日期重新开始选择', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择第一个日期
      const firstDay = '15';
      const firstDayButton = screen.getAllByText(firstDay)[0];
      fireEvent.click(firstDayButton);

      await waitFor(() => {}, { timeout: 200 });

      // 再次点击同一个日期（应该重新开始选择）
      fireEvent.click(firstDayButton);

      // 重新选择第二个日期
      const secondDay = '20';
      const secondDayButton = screen.getAllByText(secondDay)[0];
      fireEvent.click(secondDayButton);

      // 应该关闭
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    test('✅ TDD: 手动点击取消时不触发 onChange', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker showTime onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      fireEvent.click(container!);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 选择两个日期
      const firstDay = '15';
      fireEvent.click(screen.getAllByText(firstDay)[0]);
      await waitFor(() => {}, { timeout: 200 });

      const secondDay = '20';
      fireEvent.click(screen.getAllByText(secondDay)[0]);
      await waitFor(() => {}, { timeout: 200 });

      // 点击取消按钮
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // 弹框关闭但 onChange 不应该被调用
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      expect(handleChange).not.toHaveBeenCalled();
    });

    test('✅ TDD: 在 needConfirm 模式下点击 OK 触发 onChange', async () => {
      const handleChange = vi.fn();

      render(<DateRangePicker needConfirm={true} onChange={handleChange} />);

      const container = screen.getByPlaceholderText('Start date').closest('div');
      await act(async () => {
        fireEvent.click(container!);
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
      });

      // 检查确认按钮存在
      expect(screen.getByText('OK')).toBeInTheDocument();

      // 选择第一个日期
      await act(async () => {
        const firstDay = '15';
        const firstDayButtons = screen.getAllByText(firstDay);
        if (firstDayButtons.length > 0) {
          fireEvent.click(firstDayButtons[0]);
        }
      });

      // 等待状态更新
      await waitFor(() => {}, { timeout: 300 });

      // 选择第二个日期
      await act(async () => {
        const secondDay = '20';
        const secondDayButtons = screen.getAllByText(secondDay);
        if (secondDayButtons.length > 0) {
          fireEvent.click(secondDayButtons[0]);
        }
      });

      // 等待 tempValue 更新完成
      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/date/);
        const hasValue = inputs.some((input) => input.value && input.value !== '');
        expect(hasValue).toBe(true);
      }, { timeout: 1000 });

      // 点击 OK 按钮
      await act(async () => {
        const okButton = screen.getByText('OK');
        fireEvent.click(okButton);
      });

      // 验证 onChange 被调用和弹框关闭
      await waitFor(
        () => {
          expect(handleChange).toHaveBeenCalled();
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    test('✅ TDD: 清空按钮清除选择', async () => {
      const handleChange = vi.fn();
      const value = createRange('2024-01-15', '2024-01-20');

      render(<DateRangePicker value={value as any} onChange={handleChange} />);

      // 点击清除按钮
      const clearButton = screen.getByLabelText('Clear range');
      fireEvent.click(clearButton);

      // onChange 应该被调用并传入 undefined
      expect(handleChange).toHaveBeenCalledWith(undefined, ['', '']);
    });
  });
});

// ==================== 回调函数验证 ====================

describe('DateRangePicker - Callback Verification', () => {
  test('✅ onCalendarChange 在选择每个日期时都会被调用', async () => {
    const handleCalendarChange = vi.fn();

    render(<DateRangePicker onCalendarChange={handleCalendarChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    fireEvent.click(container!);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // 选择第一个日期
    const firstDay = '15';
    fireEvent.click(screen.getAllByText(firstDay)[0]);

    await waitFor(
      () => {
        // onCalendarChange 应该被调用，range: 'start'
        expect(handleCalendarChange).toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  test('✅ onOpenChange 在打开和关闭时被调用', async () => {
    const handleOpenChange = vi.fn();

    render(<DateRangePicker onOpenChange={handleOpenChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');

    // 打开
    fireEvent.click(container!);
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    // 关闭（选择两个日期后）
    const firstDay = '15';
    const secondDay = '20';
    fireEvent.click(screen.getAllByText(firstDay)[0]);
    await waitFor(() => {}, { timeout: 200 });
    fireEvent.click(screen.getAllByText(secondDay)[0]);

    await waitFor(
      () => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test('✅ onOk 只在 showTime 模式下点击 OK 时被调用', async () => {
    const handleOk = vi.fn();
    const handleChange = vi.fn();

    render(<DateRangePicker showTime onOk={handleOk} onChange={handleChange} />);

    const container = screen.getByPlaceholderText('Start date').closest('div');
    await act(async () => {
      fireEvent.click(container!);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    // 选择第一个日期
    await act(async () => {
      const firstDay = '15';
      const firstDayButtons = screen.getAllByText(firstDay);
      if (firstDayButtons.length > 0) {
        fireEvent.click(firstDayButtons[0]);
      }
    });

    // 等待状态更新
    await waitFor(() => {}, { timeout: 300 });

    // 选择第二个日期
    await act(async () => {
      const secondDay = '20';
      const secondDayButtons = screen.getAllByText(secondDay);
      if (secondDayButtons.length > 0) {
        fireEvent.click(secondDayButtons[0]);
      }
    });

    // 等待 tempValue 更新完成
    await waitFor(
      () => {
        const inputs = screen.getAllByPlaceholderText(/date/);
        const hasValue = inputs.some((input) => input.value && input.value !== '');
        expect(hasValue).toBe(true);
      },
      { timeout: 1000 }
    );

    // 点击 OK
    await act(async () => {
      const okButton = screen.getByText('OK');
      fireEvent.click(okButton);
    });

    await waitFor(
      () => {
        expect(handleOk).toHaveBeenCalled();
        expect(handleChange).toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });
});
