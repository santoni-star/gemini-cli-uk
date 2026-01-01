/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { strings } from '../../i18n.js';

interface ConsoleSummaryDisplayProps {
  errorCount: number;
  // logCount is not currently in the plan to be displayed in summary
}

export const ConsoleSummaryDisplay: React.FC<ConsoleSummaryDisplayProps> = ({
  errorCount,
}) => {
  if (errorCount === 0) {
    return null;
  }

  const errorIcon = '\u2716'; // Heavy multiplication x (✖)

  const getErrorLabel = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) {
      return strings.consoleError;
    }
    if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
    ) {
      return strings.consoleErrors;
    }
    return strings.consoleErrorsMany;
  };

  return (
    <Box>
      {errorCount > 0 && (
        <Text color={theme.status.error}>
          {errorIcon} {errorCount} {getErrorLabel(errorCount)}{' '}
          <Text color={theme.text.secondary}>{strings.consoleDetails}</Text>
        </Text>
      )}
    </Box>
  );
};
