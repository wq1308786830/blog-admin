import { describe, it, expect } from 'vitest';
import * as LabelModule from './label';
import { Label } from './label';

describe('Label - Typeof Debug', () => {
  test('DEBUG: check Label types', () => {
    console.log('typeof Label:', typeof Label);
    console.log('Label:', Label);
    console.log('LabelModule:', LabelModule);
    console.log('typeof LabelModule.Label:', typeof LabelModule.Label);

    // React.forwardRef components may be typeof 'object' or 'function'
    expect(Label).toBeDefined();
    expect(typeof Label).toMatch(/function|object/);
  });
});
