import { describe, it, expect } from 'vitest';
import * as Card from './card';
import * as Button from './button';
import * as Label from './label';

describe('Components - Typeof Check', () => {
  test('DEBUG: check component types', () => {
    console.log('typeof Card.Card:', typeof Card.Card);
    console.log('typeof Button.Button:', typeof Button.Button);
    console.log('typeof Label:', typeof Label);
  });
});
