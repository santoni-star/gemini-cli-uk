/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { strings } from '../../i18n.js';

export const RawMarkdownIndicator: React.FC = () => {
  const modKey = process.platform === 'darwin' ? 'option+m' : 'alt+m';
  return (
    <Box>
      <Text>
        {strings.indicatorRawMarkdown}
        <Text color={theme.text.secondary}>
          {' '}
          {strings.indicatorRawMarkdownToggleHint.replace('{key}', modKey)}{' '}
        </Text>
      </Text>
    </Box>
  );
};
