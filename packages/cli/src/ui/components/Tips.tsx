/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { type Config } from '@google/gemini-cli-core';
import { strings } from '../../i18n.js';

interface TipsProps {
  config: Config;
}

export const Tips: React.FC<TipsProps> = ({ config }) => {
  const geminiMdFileCount = config.getGeminiMdFileCount();
  return (
    <Box flexDirection="column">
      <Text color={theme.text.primary}>{strings.gettingStarted.title}</Text>
      <Text color={theme.text.primary}>{strings.gettingStarted.tip1}</Text>
      <Text color={theme.text.primary}>{strings.gettingStarted.tip2}</Text>
      {geminiMdFileCount === 0 && (
        <Text color={theme.text.primary}>
          {strings.gettingStarted.tip3GeminiMd}
          <Text bold color={theme.text.accent}>
            GEMINI.md
          </Text>
          {strings.gettingStarted.tip3GeminiMdPart2}
        </Text>
      )}
      <Text color={theme.text.primary}>
        {geminiMdFileCount === 0 ? '4.' : '3.'}{' '}
        <Text bold color={theme.text.accent}>
          /help
        </Text>
        {strings.gettingStarted.tipHelp}
      </Text>
    </Box>
  );
};
