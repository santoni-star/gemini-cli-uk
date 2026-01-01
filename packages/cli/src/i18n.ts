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

  // Support 'en', 'en-US', etc.
  if (lang.startsWith('en')) {
    return 'en';
  }

  // Support 'ua', 'uk', 'uk-UA', etc. Default to 'ua' for this localized fork.
  return 'ua';
};

const translations: Record<string, TranslationStrings> = {
  en,
  ua,
};

export const strings = translations[getLocale()] || en;
