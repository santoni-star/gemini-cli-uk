/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { type IdeContext, type MCPServerConfig } from '@google/gemini-cli-core';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { isNarrowWidth } from '../utils/isNarrowWidth.js';
import { strings } from '../../i18n.js';

interface ContextSummaryDisplayProps {
  geminiMdFileCount: number;
  contextFileNames: string[];
  mcpServers?: Record<string, MCPServerConfig>;
  blockedMcpServers?: Array<{ name: string; extensionName: string }>;
  ideContext?: IdeContext;
}

export const ContextSummaryDisplay: React.FC<ContextSummaryDisplayProps> = ({
  geminiMdFileCount,
  contextFileNames,
  mcpServers,
  blockedMcpServers,
  ideContext,
}) => {
  const { columns: terminalWidth } = useTerminalSize();
  const isNarrow = isNarrowWidth(terminalWidth);
  const mcpServerCount = Object.keys(mcpServers || {}).length;
  const blockedMcpServerCount = blockedMcpServers?.length || 0;
  const openFileCount = ideContext?.workspaceState?.openFiles?.length ?? 0;

  if (
    geminiMdFileCount === 0 &&
    mcpServerCount === 0 &&
    blockedMcpServerCount === 0 &&
    openFileCount === 0
  ) {
    return <Text> </Text>; // Render an empty space to reserve height
  }

  const openFilesText = (() => {
    if (openFileCount === 0) {
      return '';
    }
    return `${openFileCount} ${
      openFileCount > 1 ? strings.summaryOpenFiles : strings.summaryOpenFile
    } ${strings.summaryCtrlG}`;
  })();

  const geminiMdText = (() => {
    if (geminiMdFileCount === 0) {
      return '';
    }
    const allNamesTheSame = new Set(contextFileNames).size < 2;
    const name = allNamesTheSame ? contextFileNames[0] : 'context';
    return `${geminiMdFileCount} ${name} ${
      geminiMdFileCount > 1 ? strings.summaryFiles : strings.summaryFile
    }`;
  })();

  const mcpText = (() => {
    if (mcpServerCount === 0 && blockedMcpServerCount === 0) {
      return '';
    }

    const parts = [];
    if (mcpServerCount > 0) {
      parts.push(
        `${mcpServerCount} ${
          mcpServerCount > 1
            ? strings.summaryMcpServers
            : strings.summaryMcpServer
        }`,
      );
    }

    if (blockedMcpServerCount > 0) {
      let blockedText = `${blockedMcpServerCount} ${strings.summaryBlocked}`;
      if (mcpServerCount === 0) {
        blockedText += ` ${
          blockedMcpServerCount > 1
            ? strings.summaryMcpServers
            : strings.summaryMcpServer
        }`;
      }
      parts.push(blockedText);
    }
    return parts.join(', ');
  })();

  const summaryParts = [openFilesText, geminiMdText, mcpText].filter(Boolean);

  if (isNarrow) {
    return (
      <Box flexDirection="column" paddingX={1}>
        <Text color={theme.text.secondary}>{strings.summaryUsing}:</Text>
        {summaryParts.map((part, index) => (
          <Text key={index} color={theme.text.secondary}>
            {'  '}- {part}
          </Text>
        ))}
      </Box>
    );
  }

  return (
    <Box paddingX={1}>
      <Text color={theme.text.secondary}>
        {strings.summaryUsing}: {summaryParts.join(' | ')}
      </Text>
    </Box>
  );
};
