/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../../semantic-colors.js';
import { strings } from '../../../i18n.js';

interface HooksListProps {
  hooks: ReadonlyArray<{
    config: {
      command?: string;
      type: string;
      name?: string;
      description?: string;
      timeout?: number;
    };
    source: string;
    eventName: string;
    matcher?: string;
    sequential?: boolean;
    enabled: boolean;
  }>;
}

export const HooksList: React.FC<HooksListProps> = ({ hooks }) => (
  <Box flexDirection="column" marginTop={1} marginBottom={1}>
    <Text>{strings.hooksListDescription}</Text>

    <Box marginTop={1} flexDirection="column">
      <Text color={theme.status.warning} bold underline>
        {strings.hooksListSecurityWarningTitle}
      </Text>
      <Text color={theme.status.warning}>
        {strings.hooksListSecurityWarningText}
      </Text>
    </Box>

    <Box marginTop={1}>
      <Text>
        {strings.hooksListLearnMore}{' '}
        <Text color={theme.text.link}>https://geminicli.com/docs/hooks</Text>
      </Text>
    </Box>

    <Box marginTop={1} flexDirection="column">
      {hooks.length === 0 ? (
        <Text>{strings.hooksListNoHooks}</Text>
      ) : (
        <>
          <Text bold underline>
            {strings.hooksListRegisteredTitle}
          </Text>
          <Box flexDirection="column" paddingLeft={2} marginTop={1}>
            {Object.entries(
              hooks.reduce(
                (acc, hook) => {
                  if (!acc[hook.eventName]) {
                    acc[hook.eventName] = [];
                  }
                  acc[hook.eventName].push(hook);
                  return acc;
                },
                {} as Record<string, Array<(typeof hooks)[number]>>,
              ),
            ).map(([eventName, eventHooks]) => (
              <Box key={eventName} flexDirection="column" marginBottom={1}>
                <Text color="cyan" bold>
                  {eventName}:
                </Text>
                <Box flexDirection="column" paddingLeft={2}>
                  {eventHooks.map((hook, index) => {
                    const hookName =
                      hook.config.name || hook.config.command || 'unknown';
                    const statusColor = hook.enabled ? 'green' : 'gray';
                    const statusText = hook.enabled
                      ? strings.hooksListEnabled
                      : strings.hooksListDisabled;

                    return (
                      <Box key={`${eventName}-${index}`} flexDirection="column">
                        <Box>
                          <Text>
                            <Text color="yellow">{hookName}</Text>
                            <Text
                              color={statusColor}
                            >{` [${statusText}]`}</Text>
                          </Text>
                        </Box>
                        <Box paddingLeft={2} flexDirection="column">
                          {hook.config.description && (
                            <Text italic color={theme.text.primary}>
                              {hook.config.description}
                            </Text>
                          )}
                          <Text dimColor>
                            {strings.hooksListSource}: {hook.source}
                            {hook.config.name &&
                              hook.config.command &&
                              ` | ${strings.hooksListCommand}: ${hook.config.command}`}
                            {hook.matcher &&
                              ` | ${strings.hooksListMatcher}: ${hook.matcher}`}
                            {hook.sequential &&
                              ` | ${strings.hooksListSequential}`}
                            {hook.config.timeout &&
                              ` | ${strings.hooksListTimeout}: ${hook.config.timeout}${strings.unitSecond}`}
                          </Text>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>

    <Box marginTop={1}>
      <Text dimColor>{strings.hooksListTip}</Text>
    </Box>
  </Box>
);
