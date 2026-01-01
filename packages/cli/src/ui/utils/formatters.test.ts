/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { formatDuration, formatMemoryUsage } from './formatters.js';

describe('formatters', () => {
  describe('formatMemoryUsage', () => {
    it('should format bytes into KB', () => {
      expect(formatMemoryUsage(12345)).toBe('12.1 КБ');
    });

    it('should format bytes into MB', () => {
      expect(formatMemoryUsage(12345678)).toBe('11.8 МБ');
    });

    it('should format bytes into GB', () => {
      expect(formatMemoryUsage(12345678901)).toBe('11.50 ГБ');
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds less than a second', () => {
      expect(formatDuration(500)).toBe('500мс');
    });

    it('should format a duration of 0', () => {
      expect(formatDuration(0)).toBe('0с');
    });

    it('should format an exact number of seconds', () => {
      expect(formatDuration(5000)).toBe('5.0с');
    });

    it('should format a duration in seconds with one decimal place', () => {
      expect(formatDuration(12345)).toBe('12.3с');
    });

    it('should format an exact number of minutes', () => {
      expect(formatDuration(120000)).toBe('2хв');
    });

    it('should format a duration in minutes and seconds', () => {
      expect(formatDuration(123000)).toBe('2хв 3с');
    });

    it('should format an exact number of hours', () => {
      expect(formatDuration(3600000)).toBe('1год');
    });

    it('should format a duration in hours and seconds', () => {
      expect(formatDuration(3605000)).toBe('1год 5с');
    });

    it('should format a duration in hours, minutes, and seconds', () => {
      expect(formatDuration(3723000)).toBe('1год 2хв 3с');
    });

    it('should handle large durations', () => {
      expect(formatDuration(86400000 + 3600000 + 120000 + 1000)).toBe(
        '25год 2хв 1с',
      );
    });

    it('should handle negative durations', () => {
      expect(formatDuration(-100)).toBe('0с');
    });
  });
});
