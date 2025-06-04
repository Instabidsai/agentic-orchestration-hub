import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges class names and filters falsy values', () => {
    const result = cn('foo', false && 'bar', null, undefined, 'baz');
    expect(result).toBe('foo baz');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('btn', isActive && 'btn-active');
    expect(result).toBe('btn btn-active');
  });
});
