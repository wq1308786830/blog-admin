import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label - Debug', () => {
  test('DEBUG: inspect rendered label', () => {
    const { container } = render(<Label id="test-id" htmlFor="username" className="custom-label">Test Label</Label>);

    console.log('Container HTML:', container.innerHTML);
    console.log('All elements:', container.querySelectorAll('*'));

    const text = screen.getByText('Test Label');
    console.log('Text element:', text);
    console.log('Text element tagName:', text.tagName);
    console.log('Text element className:', text.className);
    console.log('Text element attributes:', Array.from(text.attributes).map(a => `${a.name}=${a.value}`));

    const label = text.closest('label');
    console.log('Label element:', label);
    if (label) {
      console.log('Label className:', label.className);
      console.log('Label attributes:', Array.from(label.attributes).map(a => `${a.name}=${a.value}`));
    }
  });
});
