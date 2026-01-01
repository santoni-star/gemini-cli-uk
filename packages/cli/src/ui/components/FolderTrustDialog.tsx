/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import type React from 'react';
import { useEffect, useState } from 'react';
import { theme } from '../semantic-colors.js';
import type { RadioSelectItem } from './shared/RadioButtonSelect.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { useKeypress } from '../hooks/useKeypress.js';
import * as process from 'node:process';
import * as path from 'node:path';
import { relaunchApp } from '../../utils/processUtils.js';
import { runExitCleanup } from '../../utils/cleanup.js';
import { ExitCodes } from '@google/gemini-cli-core';
import { strings } from '../../i18n.js';

export enum FolderTrustChoice {
  TRUST_FOLDER = 'trust_folder',
  TRUST_PARENT = 'trust_parent',
  DO_NOT_TRUST = 'do_not_trust',
}

interface FolderTrustDialogProps {
  onSelect: (choice: FolderTrustChoice) => void;
  isRestarting?: boolean;
}

export const FolderTrustDialog: React.FC<FolderTrustDialogProps> = ({
  onSelect,
  isRestarting,
}) => {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const doRelaunch = async () => {
      if (isRestarting) {
        setTimeout(async () => {
          await relaunchApp();
        }, 250);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    doRelaunch();
  }, [isRestarting]);

  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        setExiting(true);
        setTimeout(async () => {
          await runExitCleanup();
          process.exit(ExitCodes.FATAL_CANCELLATION_ERROR);
        }, 100);
      }
    },
    { isActive: !isRestarting },
  );

  const dirName = path.basename(process.cwd());
  const parentFolder = path.basename(path.dirname(process.cwd()));

  const options: Array<RadioSelectItem<FolderTrustChoice>> = [
    {
      label: strings.trustFolder.replace('{dir}', dirName),
      value: FolderTrustChoice.TRUST_FOLDER,
      key: `Trust folder (${dirName})`,
    },
    {
      label: strings.trustParentFolder.replace('{dir}', parentFolder),
      value: FolderTrustChoice.TRUST_PARENT,
      key: `Trust parent folder (${parentFolder})`,
    },
    {
      label: strings.trustNo,
      value: FolderTrustChoice.DO_NOT_TRUST,
      key: "Don't trust",
    },
  ];

  return (
    <Box flexDirection="column" width="100%">
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={theme.status.warning}
        padding={1}
        marginLeft={1}
        marginRight={1}
      >
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color={theme.text.primary}>
            {strings.trustTitle}
          </Text>
          <Text color={theme.text.primary}>{strings.trustDescription}</Text>
        </Box>

        <RadioButtonSelect
          items={options}
          onSelect={onSelect}
          isFocused={!isRestarting}
        />
      </Box>
      {isRestarting && (
        <Box marginLeft={1} marginTop={1}>
          <Text color={theme.status.warning}>{strings.trustRestarting}</Text>
        </Box>
      )}
      {exiting && (
        <Box marginLeft={1} marginTop={1}>
          <Text color={theme.status.warning}>{strings.trustExiting}</Text>
        </Box>
      )}
    </Box>
  );
};
