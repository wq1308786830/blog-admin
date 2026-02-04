/**
 * TDD Test Suite for cn Utility Function
 * 测试类名合并工具函数的所有情况
 */

import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn Utility Function', () => {
  test('✅ TDD: should merge multiple class names', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  test('✅ TDD: should handle single class name', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  test('✅ TDD: should handle empty arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  test('✅ TDD: should handle undefined arguments', () => {
    const result = cn(undefined, undefined);
    expect(result).toBe('');
  });

  test('✅ TDD: should handle null arguments', () => {
    const result = cn(null, null);
    expect(result).toBe('');
  });

  test('✅ TDD: should handle mixed types', () => {
    const result = cn('string-class', undefined, null, 'another-class');
    expect(result).toBe('string-class another-class');
  });

  test('✅ TDD: should handle empty strings', () => {
    const result = cn('', '', '');
    expect(result).toBe('');
  });

  test('✅ TDD: should handle conflicting Tailwind classes', () => {
    const result = cn('px-4', 'px-2', 'py-1');
    // tailwind-merge should resolve conflicting classes
    // Later class (px-2) should override earlier (px-4)
    expect(result).toContain('px-2');
    expect(result).not.toContain('px-4');
  });

  test('✅ TDD: should deduplicate duplicate classes', () => {
    const result = cn('mb-4', 'mb-4', 'mt-2');
    // tailwind-merge removes duplicates
    expect(result).toBe('mb-4 mt-2');
    expect(result).not.toContain('mb-4  mb-4');
  });

  test('✅ TDD: should handle arrays', () => {
    const result = cn(['flex', 'items-center'], ['justify-center']);
    expect(result).toBe('flex items-center justify-center');
  });

  test('✅ TDD: should handle nested arrays', () => {
    const result = cn([['flex', 'gap-2'], ['items-center']]);
    expect(result).toBe('flex gap-2 items-center');
  });

  test('✅ TDD: should handle empty arrays', () => {
    const result = cn([]);
    expect(result).toBe('');
  });

  test('✅ TDD: should handle arrays with single element', () => {
    const result = cn(['single-class']);
    expect(result).toBe('single-class');
  });

  test('✅ TDD: should handle conditional classes', () => {
    const condition = true;
    const result = cn('base-class', condition && 'conditional-class');
    expect(result).toBe('base-class conditional-class');
  });

  test('✅ TDD: should filter out falsy conditional classes', () => {
    const result = cn(
      'base-class',
      false && 'not-included',
      null && 'also-not',
      undefined && 'not-defined'
    );
    expect(result).toBe('base-class');
  });

  test('✅ TDD: should handle objects with arrays', () => {
    const result = cn({ base: true }, ['extra-class']);
    expect(result).toContain('base');
    expect(result).toContain('extra-class');
  });

  test('✅ TDD: should handle many arguments', () => {
    const result = cn(
      'class1',
      'class2',
      'class3',
      'class4',
      'class5',
      'class6',
      'class7',
      'class8',
      'class9',
      'class10'
    );
    expect(result).toContain('class1');
    expect(result).toContain('class10');
  });

  test('✅ TDD: should preserve order of classes', () => {
    const result = cn('first', 'second', 'third', 'fourth', 'fifth');
    const parts = result.split(' ');
    expect(parts[0]).toBe('first');
    expect(parts[4]).toBe('fifth');
  });

  test('✅ TDD: should handle numbers as strings', () => {
    const result = cn('1', '2', '3');
    expect(result).toBe('1 2 3');
  });

  test('✅ TDD: should handle special characters in class names', () => {
    const result = cn('text-[color:red]', 'hover:bg-[color:blue]');
    expect(result).toContain('text-[color:red]');
    expect(result).toContain('hover:bg-[color:blue]');
  });

  test('✅ TDD: should handle classes with spaces', () => {
    const result = cn('class with   spaces', 'another-class');
    expect(result).toContain('class');
    expect(result).toContain('another-class');
  });

  test('✅ TDD: should trim and normalize output', () => {
    const result = cn('  class1  ', '  class2  ', '  class3  ');
    const parts = result.split(' ').filter((p) => p.length > 0);
    expect(parts.length).toBe(3);
    expect(parts[0]).not.toMatch(/^ /);
    expect(parts[2]).not.toMatch(/  $/);
  });

  test('✅ TDD: should handle CSS syntax', () => {
    const result = cn('hover:bg-red-500', 'focus:ring-2', 'active:scale-105');
    expect(result).toContain('hover:bg-red-500');
    expect(result).toContain('focus:ring-2');
    expect(result).toContain('active:scale-105');
  });

  test('✅ TDD: should be idempotent', () => {
    const result1 = cn('class1', 'class2');
    const result2 = cn('class1', 'class2');
    expect(result1).toBe(result2);
  });

  test('✅ TDD: should return string type', () => {
    const result = cn('test-class');
    expect(typeof result).toBe('string');
  });

  test('✅ TDD: should handle complex combinations', () => {
    const condition = true;
    const result = cn(
      ['flex', 'items-center'],
      condition && ['bg-red-500', 'text-white'],
      'mt-4',
      undefined,
      null
    );
    expect(result).toContain('flex');
    expect(result).toContain('items-center');
    expect(result).toContain('bg-red-500');
    expect(result).toContain('text-white');
    expect(result).toContain('mt-4');
  });

  test('✅ TDD: should handle zero-length strings', () => {
    const result = cn('');
    expect(result).toBe('');
  });

  test('✅ TDD: should handle only undefined', () => {
    const result = cn(undefined);
    expect(result).toBe('');
  });

  test('✅ TDD: should handle empty arrays and strings', () => {
    const result = cn([], '', null, []);
    expect(result).toBe('');
  });

  test('✅ TDD: should handle nested conditional classes', () => {
    const active = true;
    const disabled = false;
    const result = cn(
      'base',
      active && 'active-class',
      !disabled && 'enabled-class',
      disabled && 'disabled-class'
    );
    expect(result).toContain('active-class');
    expect(result).toContain('enabled-class');
    expect(result).not.toContain('disabled-class');
  });
});
