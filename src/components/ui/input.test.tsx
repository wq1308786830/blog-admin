import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input, TextArea, Search, Password, OTP } from './input'

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('should render input', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should render with default value', () => {
      render(<Input defaultValue="default" />)
      expect(screen.getByDisplayValue('default')).toBeInTheDocument()
    })

    it('should render with value (controlled)', () => {
      render(<Input value="controlled" />)
      expect(screen.getByDisplayValue('controlled')).toBeInTheDocument()
    })

    it('should render disabled state', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Input size="small" />)
      expect(screen.getByRole('textbox')).toHaveClass('h-8')
    })

    it('should render middle size', () => {
      render(<Input size="middle" />)
      expect(screen.getByRole('textbox')).toHaveClass('h-10')
    })

    it('should render large size', () => {
      render(<Input size="large" />)
      expect(screen.getByRole('textbox')).toHaveClass('h-12')
    })
  })

  describe('Variants', () => {
    it('should render outlined variant', () => {
      render(<Input variant="outlined" />)
      expect(screen.getByRole('textbox')).toHaveClass('border')
    })

    it('should render borderless variant', () => {
      render(<Input variant="borderless" />)
      expect(screen.getByRole('textbox')).toHaveClass('border-0')
    })

    it('should render filled variant', () => {
      render(<Input variant="filled" />)
      expect(screen.getByRole('textbox')).toHaveClass('bg-muted')
    })

    it('should render underlined variant', () => {
      render(<Input variant="underlined" />)
      expect(screen.getByRole('textbox')).toHaveClass('border-b-2')
    })
  })

  describe('Prefix and Suffix', () => {
    it('should render prefix', () => {
      render(<Input prefix={<span>$</span>} />)
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    it('should render suffix', () => {
      render(<Input suffix={<span>.com</span>} />)
      expect(screen.getByText('.com')).toBeInTheDocument()
    })

    it('should render both prefix and suffix', () => {
      render(
        <Input
          prefix={<span>https://</span>}
          suffix={<span>.com</span>}
        />
      )
      expect(screen.getByText('https://')).toBeInTheDocument()
      expect(screen.getByText('.com')).toBeInTheDocument()
    })
  })

  describe('Clear Button', () => {
    it('should show clear icon when allowClear and has value', () => {
      render(<Input allowClear value="text" data-testid="clear-input" />)
      // Clear button renders with X icon
      const clearIcon = screen.getByTestId('clear-input').parentElement?.querySelector('svg.lucide-x')
      expect(clearIcon).toBeInTheDocument()
    })

    it('should not show clear icon when no value', () => {
      render(<Input allowClear data-testid="no-clear-input" />)
      const clearIcon = screen.getByTestId('no-clear-input').parentElement?.querySelector('svg.lucide-x')
      expect(clearIcon).not.toBeInTheDocument()
    })

    it('should clear value on click', () => {
      const handleChange = vi.fn()
      render(<Input allowClear value="text" onChange={handleChange} data-testid="clear-click-input" />)
      const clearIcon = screen.getByTestId('clear-click-input').parentElement?.querySelector('.cursor-pointer')
      if (clearIcon) {
        fireEvent.click(clearIcon)
      }
      expect(handleChange).toHaveBeenCalled()
    })

    it('should call onClear callback', () => {
      const handleClear = vi.fn()
      render(<Input allowClear value="text" onClear={handleClear} data-testid="clear-callback-input" />)
      const clearIcon = screen.getByTestId('clear-callback-input').parentElement?.querySelector('.cursor-pointer')
      if (clearIcon) {
        fireEvent.click(clearIcon)
      }
      expect(handleClear).toHaveBeenCalled()
    })
  })

  describe('Character Count', () => {
    it('should show character count', () => {
      render(<Input showCount value="hello" />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should show character count with maxLength', () => {
      render(<Input showCount maxLength={10} value="hello" />)
      expect(screen.getByText('5 / 10')).toBeInTheDocument()
    })

    it('should show custom count formatter', () => {
      render(
        <Input
          showCount={({ count }) => `${count} chars`}
          value="hello"
        />
      )
      expect(screen.getByText('5 chars')).toBeInTheDocument()
    })
  })

  describe('Count Configuration', () => {
    it('should use custom count strategy', () => {
      render(
        <Input
          count={{
            max: 10,
            strategy: (value) => value.length,
            show: true,
          }}
          value="hello"
        />
      )
      expect(screen.getByText('5 / 10')).toBeInTheDocument()
    })

    it('should use exceedFormatter', () => {
      const handleChange = vi.fn()
      render(
        <Input
          count={{
            max: 5,
            exceedFormatter: (value) => value.slice(0, 5),
          }}
          onChange={handleChange}
        />
      )
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'helloworld' } })
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Status', () => {
    it('should render error status', () => {
      render(<Input status="error" />)
      expect(screen.getByRole('textbox')).toHaveClass('border-destructive')
    })

    it('should render warning status', () => {
      render(<Input status="warning" />)
      expect(screen.getByRole('textbox')).toHaveClass('border-yellow-500')
    })
  })

  describe('Events', () => {
    it('should call onChange', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
      expect(handleChange).toHaveBeenCalled()
    })

    it('should call onPressEnter', () => {
      const handlePressEnter = vi.fn()
      render(<Input onPressEnter={handlePressEnter} />)
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
      expect(handlePressEnter).toHaveBeenCalled()
    })

    it('should call onFocus', () => {
      const handleFocus = vi.fn()
      render(<Input onFocus={handleFocus} />)
      screen.getByRole('textbox').focus()
      expect(handleFocus).toHaveBeenCalled()
    })

    it('should call onBlur', () => {
      const handleBlur = vi.fn()
      render(<Input onBlur={handleBlur} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(handleBlur).toHaveBeenCalled()
    })
  })

  describe('MaxLength', () => {
    it('should enforce maxLength', () => {
      render(<Input maxLength={5} />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'helloworld' } })
      expect(input.value).toBe('hello')
    })
  })
})

describe('TextArea Component', () => {
  describe('Basic Rendering', () => {
    it('should render textarea', () => {
      render(<TextArea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with default value', () => {
      render(<TextArea defaultValue="default text" />)
      expect(screen.getByDisplayValue('default text')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<TextArea size="small" />)
      expect(screen.getByRole('textbox')).toHaveClass('h-8')
    })

    it('should render middle size', () => {
      render(<TextArea size="middle" />)
      expect(screen.getByRole('textbox')).toHaveClass('h-10')
    })

    it('should render large size', () => {
      render(<TextArea size="large" />)
      expect(screen.getByRole('textbox')).toHaveClass('h-12')
    })
  })

  describe('Auto Size', () => {
    it('should auto resize when autoSize is true', () => {
      render(<TextArea autoSize value="line1\nline2\nline3" />)
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.style.height).not.toBe('')
    })

    it('should respect minRows', () => {
      render(<TextArea autoSize={{ minRows: 3 }} />)
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.style.height).not.toBe('')
    })

    it('should respect maxRows', () => {
      render(<TextArea autoSize={{ maxRows: 5 }} value="line1\nline2\nline3\nline4\nline5\nline6" />)
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.style.height).not.toBe('')
    })
  })

  describe('Character Count', () => {
    it('should show character count', () => {
      render(<TextArea showCount value="hello" />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should show character count with maxLength', () => {
      render(<TextArea showCount maxLength={100} value="hello" />)
      expect(screen.getByText('5 / 100')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should render outlined variant', () => {
      render(<TextArea variant="outlined" />)
      expect(screen.getByRole('textbox')).toHaveClass('border')
    })

    it('should render borderless variant', () => {
      render(<TextArea variant="borderless" />)
      expect(screen.getByRole('textbox')).toHaveClass('border-0')
    })

    it('should render filled variant', () => {
      render(<TextArea variant="filled" />)
      expect(screen.getByRole('textbox')).toHaveClass('bg-muted')
    })

    it('should render underlined variant', () => {
      render(<TextArea variant="underlined" />)
      expect(screen.getByRole('textbox')).toHaveClass('border-b-2')
    })
  })
})

describe('Search Component', () => {
  describe('Basic Rendering', () => {
    it('should render search input', () => {
      render(<Search />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with search icon', () => {
      render(<Search />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Enter Button', () => {
    it('should render enter button when true', () => {
      render(<Search enterButton />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should render custom enter button', () => {
      render(<Search enterButton={<span>Go</span>} />)
      expect(screen.getByText('Go')).toBeInTheDocument()
    })

    it('should call onSearch when button clicked', () => {
      const handleSearch = vi.fn()
      render(<Search enterButton onSearch={handleSearch} />)
      fireEvent.click(screen.getByRole('button'))
      expect(handleSearch).toHaveBeenCalled()
    })

    it('should call onSearch when Enter pressed', () => {
      const handleSearch = vi.fn()
      render(<Search onSearch={handleSearch} />)
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
      expect(handleSearch).toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner', () => {
      render(<Search loading />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should show loading in button', () => {
      render(<Search enterButton loading />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Search Icon', () => {
    it('should show search icon when no enter button', () => {
      render(<Search />)
      const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg')
      expect(searchIcon).toBeInTheDocument()
    })

    it('should call onSearch when search icon clicked', () => {
      const handleSearch = vi.fn()
      render(<Search onSearch={handleSearch} />)
      const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg')
      if (searchIcon) {
        fireEvent.click(searchIcon)
        expect(handleSearch).toHaveBeenCalled()
      }
    })
  })
})

describe('Password Component', () => {
  describe('Basic Rendering', () => {
    it('should render password input', () => {
      render(<Password />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password')
    })

    it('should toggle visibility on click', () => {
      render(<Password />)
      const toggleButton = screen.getByRole('textbox').parentElement?.querySelector('div[role="button"]')
      if (toggleButton) {
        fireEvent.click(toggleButton)
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
      }
    })
  })

  describe('Visibility Toggle', () => {
    it('should respect controlled visibilityToggle', () => {
      render(<Password visibilityToggle={{ visible: true }} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    })

    it('should call onVisibleChange', () => {
      const handleVisibleChange = vi.fn()
      render(
        <Password
          visibilityToggle={{
            visible: false,
            onVisibleChange: handleVisibleChange,
          }}
        />
      )
      const toggleButton = screen.getByRole('textbox').parentElement?.querySelector('div')
      if (toggleButton) {
        fireEvent.click(toggleButton)
        expect(handleVisibleChange).toHaveBeenCalledWith(true)
      }
    })

    it('should not show toggle when visibilityToggle is false', () => {
      render(<Password visibilityToggle={false} />)
      const toggleButton = screen.getByRole('textbox').parentElement?.querySelector('div')
      expect(toggleButton).not.toBeInTheDocument()
    })
  })

  describe('Custom Icon Render', () => {
    it('should render custom icon', () => {
      render(<Password iconRender={() => <span>Custom</span>} />)
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })
  })
})

describe('OTP Component', () => {
  describe('Basic Rendering', () => {
    it('should render OTP inputs', () => {
      render(<OTP length={6} />)
      expect(screen.getAllByRole('textbox')).toHaveLength(6)
    })

    it('should render with default length of 6', () => {
      render(<OTP />)
      expect(screen.getAllByRole('textbox')).toHaveLength(6)
    })

    it('should render with custom length', () => {
      render(<OTP length={4} />)
      expect(screen.getAllByRole('textbox')).toHaveLength(4)
    })
  })

  describe('Input Handling', () => {
    it('should handle single character input', () => {
      const handleChange = vi.fn()
      render(<OTP onChange={handleChange} />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      expect(inputs[0]).toHaveDisplayValue('1')
    })

    it('should auto focus next input', () => {
      render(<OTP />)
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      fireEvent.change(inputs[0], { target: { value: '1' } })
      expect(document.activeElement).toBe(inputs[1])
    })

    it('should handle backspace to previous input', () => {
      render(<OTP defaultValue="1" />)
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      inputs[1].focus()
      fireEvent.keyDown(inputs[1], { key: 'Backspace' })
      expect(document.activeElement).toBe(inputs[0])
    })

    it('should handle arrow key navigation', () => {
      render(<OTP />)
      const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
      inputs[1].focus()
      fireEvent.keyDown(inputs[1], { key: 'ArrowLeft' })
      expect(document.activeElement).toBe(inputs[0])
      fireEvent.keyDown(inputs[0], { key: 'ArrowRight' })
      expect(document.activeElement).toBe(inputs[1])
    })

    it('should handle paste', () => {
      const handleInput = vi.fn()
      render(<OTP onInput={handleInput} />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.paste(inputs[0], { clipboardData: { getData: () => '123456' } } as any)
      expect(handleInput).toHaveBeenCalled()
    })
  })

  describe('Value Handling', () => {
    it('should work with controlled value', () => {
      render(<OTP value="123456" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveDisplayValue('1')
      expect(inputs[5]).toHaveDisplayValue('6')
    })

    it('should work with default value', () => {
      render(<OTP defaultValue="123" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveDisplayValue('1')
      expect(inputs[2]).toHaveDisplayValue('3')
    })
  })

  describe('Mask', () => {
    it('should mask values when mask is true', () => {
      render(<OTP mask value="123" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveDisplayValue('•')
    })

    it('should use custom mask string', () => {
      render(<OTP mask="*" value="123" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveDisplayValue('*')
    })
  })

  describe('Formatter', () => {
    it('should format values', () => {
      render(<OTP formatter={(val) => val.toUpperCase()} value="a" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveDisplayValue('A')
    })
  })

  describe('Separator', () => {
    it('should render separator', () => {
      render(<OTP separator="-" length={6} />)
      expect(screen.getAllByText('-')).toHaveLength(5)
    })

    it('should render function separator', () => {
      render(<OTP separator={(i) => (i === 2 ? '-' : undefined)} length={6} />)
      expect(screen.queryAllByText('-')).toHaveLength(1)
    })
  })

  describe('Disabled State', () => {
    it('should render disabled inputs', () => {
      render(<OTP disabled />)
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach((input) => {
        expect(input).toBeDisabled()
      })
    })
  })

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<OTP size="small" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('w-8', 'h-8')
    })

    it('should render middle size', () => {
      render(<OTP size="middle" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('w-10', 'h-10')
    })

    it('should render large size', () => {
      render(<OTP size="large" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('w-12', 'h-12')
    })
  })

  describe('Variants', () => {
    it('should render outlined variant', () => {
      render(<OTP variant="outlined" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('border')
    })

    it('should render borderless variant', () => {
      render(<OTP variant="borderless" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('border-0')
    })

    it('should render filled variant', () => {
      render(<OTP variant="filled" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('bg-muted')
    })

    it('should render underlined variant', () => {
      render(<OTP variant="underlined" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('border-b-2')
    })
  })

  describe('Status', () => {
    it('should render error status', () => {
      render(<OTP status="error" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('border-destructive')
    })

    it('should render warning status', () => {
      render(<OTP status="warning" />)
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[0]).toHaveClass('border-yellow-500')
    })
  })

  describe('Callbacks', () => {
    it('should call onChange when all fields filled', () => {
      const handleChange = vi.fn()
      render(<OTP onChange={handleChange} length={3} />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      fireEvent.change(inputs[1], { target: { value: '2' } })
      fireEvent.change(inputs[2], { target: { value: '3' } })
      expect(handleChange).toHaveBeenCalledWith('123')
    })

    it('should call onInput on each change', () => {
      const handleInput = vi.fn()
      render(<OTP onInput={handleInput} />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      expect(handleInput).toHaveBeenCalled()
    })
  })
})
