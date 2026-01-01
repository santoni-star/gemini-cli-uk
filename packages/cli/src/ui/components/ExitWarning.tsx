/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { useUIState } from '../contexts/UIStateContext.js';
import { theme } from '../semantic-colors.js';
import { strings } from '../../i18n.js';

export const ExitWarning: React.FC = () => {
  const uiState = useUIState();
  return (
    <>
      {uiState.dialogsVisible && uiState.ctrlCPressedOnce && (
        <Box marginTop={1}>
          <Text color={theme.status.warning}>{strings.pressCtrlC}</Text>
        </Box>
      )}

      {uiState.dialogsVisible && uiState.ctrlDPressedOnce && (
        <Box marginTop={1}>
          <Text color={theme.status.warning}>{strings.pressCtrlD}</Text>
        </Box>
      )}
    </>
  );
};
