/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { strings } from '../../i18n.js';

export const ShellModeIndicator: React.FC = () => (
  <Box>
    <Text color={theme.ui.symbol}>
      {strings.shellModeEnabled}
      <Text color={theme.text.secondary}> {strings.shellModeDisableHint}</Text>
    </Text>
  </Box>
);
