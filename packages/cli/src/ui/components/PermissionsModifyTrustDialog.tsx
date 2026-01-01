/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import type React from 'react';
import * as process from 'node:process';
import * as path from 'node:path';
import { TrustLevel } from '../../config/trustedFolders.js';
import { useKeypress } from '../hooks/useKeypress.js';
import { usePermissionsModifyTrust } from '../hooks/usePermissionsModifyTrust.js';
import { theme } from '../semantic-colors.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { relaunchApp } from '../../utils/processUtils.js';
import { type UseHistoryManagerReturn } from '../hooks/useHistoryManager.js';
import { strings } from '../../i18n.js';

export interface PermissionsDialogProps {
  targetDirectory?: string;
}

interface PermissionsModifyTrustDialogProps extends PermissionsDialogProps {
  onExit: () => void;
  addItem: UseHistoryManagerReturn['addItem'];
}

export function PermissionsModifyTrustDialog({
  onExit,
  addItem,
  targetDirectory,
}: PermissionsModifyTrustDialogProps): React.JSX.Element {
  const currentDirectory = targetDirectory ?? process.cwd();
  const dirName = path.basename(currentDirectory);
  const parentFolder = path.basename(path.dirname(currentDirectory));

  const TRUST_LEVEL_ITEMS = [
    {
      label: strings.trustFolder.replace('{dir}', dirName),
      value: TrustLevel.TRUST_FOLDER,
      key: TrustLevel.TRUST_FOLDER,
    },
    {
      label: strings.trustParentFolder.replace('{dir}', parentFolder),
      value: TrustLevel.TRUST_PARENT,
      key: TrustLevel.TRUST_PARENT,
    },
    {
      label: strings.trustNo,
      value: TrustLevel.DO_NOT_TRUST,
      key: TrustLevel.DO_NOT_TRUST,
    },
  ];

  const {
    cwd,
    currentTrustLevel,
    isInheritedTrustFromParent,
    isInheritedTrustFromIde,
    needsRestart,
    updateTrustLevel,
    commitTrustLevelChange,
  } = usePermissionsModifyTrust(onExit, addItem, currentDirectory);

  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        onExit();
      }
      if (needsRestart && key.name === 'r') {
        const success = commitTrustLevelChange();
        if (success) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          relaunchApp();
        } else {
          onExit();
        }
      }
    },
    { isActive: true },
  );

  const index = TRUST_LEVEL_ITEMS.findIndex(
    (item) => item.value === currentTrustLevel,
  );
  const initialIndex = index === -1 ? 0 : index;

  return (
    <>
      <Box
        borderStyle="round"
        borderColor={theme.border.default}
        flexDirection="column"
        padding={1}
      >
        <Box flexDirection="column" paddingBottom={1}>
          <Text bold>
            {'> '}
            {strings.permissionsModifyTitle}
          </Text>
          <Box marginTop={1} />
          <Text>
            {strings.permissionsFolder}: {cwd}
          </Text>
          <Text>
            {strings.permissionsCurrentLevel}:{' '}
            <Text bold>{currentTrustLevel || strings.permissionsNotSet}</Text>
          </Text>
          {isInheritedTrustFromParent && (
            <Text color={theme.text.secondary}>
              {strings.permissionsInheritedParent}
            </Text>
          )}
          {isInheritedTrustFromIde && (
            <Text color={theme.text.secondary}>
              {strings.permissionsInheritedIde}
            </Text>
          )}
        </Box>

        <RadioButtonSelect
          items={TRUST_LEVEL_ITEMS}
          onSelect={updateTrustLevel}
          isFocused={true}
          initialIndex={initialIndex}
        />
        <Box marginTop={1}>
          <Text color={theme.text.secondary}>
            {strings.authUseEnter.replace(
              '(Use Enter to select)',
              '(Enter — вибрати',
            )}
            {', Esc — закрити)'}
          </Text>
        </Box>
      </Box>
      {needsRestart && (
        <Box marginLeft={1} marginTop={1}>
          <Text color={theme.status.warning}>
            {strings.permissionsRestartRequired}
          </Text>
        </Box>
      )}
    </>
  );
}
