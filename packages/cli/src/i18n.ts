/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './locales/en.js';
import { ua } from './locales/ua.js';
import type { TranslationStrings } from './locales/types.js';

export const getLocale = (): string => {
  if (typeof process === 'undefined' || !process.env) {
    return 'ua';
  }

  const lang = (
    process.env['GEMINI_CLI_LANG'] ||
    process.env['LANG'] ||
    process.env['LC_ALL'] ||
    ''
  ).toLowerCase();

  // Default to 'ua' unless English is explicitly requested

  if (lang.includes('en')) {
    return 'en';
  }

  return 'ua';
};

const translations: Record<string, TranslationStrings> = {
  en,
  ua,
};

export const strings = translations[getLocale()] || en;
