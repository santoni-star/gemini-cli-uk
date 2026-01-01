/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs/promises';
import * as os from 'node:os';
import path from 'node:path';
import { strings } from '../i18n.js';

type WarningCheck = {
  id: string;
  check: (workspaceRoot: string) => Promise<string | null>;
};

// Individual warning checks
const homeDirectoryCheck: WarningCheck = {
  id: 'home-directory',
  check: async (workspaceRoot: string) => {
    try {
      const [workspaceRealPath, homeRealPath] = await Promise.all([
        fs.realpath(workspaceRoot),
        fs.realpath(os.homedir()),
      ]);

      if (workspaceRealPath === homeRealPath) {
        return strings.warningHomeDirectory;
      }
      return null;
    } catch (_err: unknown) {
      return strings.warningFileSystemError;
    }
  },
};

const rootDirectoryCheck: WarningCheck = {
  id: 'root-directory',
  check: async (workspaceRoot: string) => {
    try {
      const workspaceRealPath = await fs.realpath(workspaceRoot);
      const errorMessage = strings.warningRootDirectory;

      // Check for Unix root directory
      if (path.dirname(workspaceRealPath) === workspaceRealPath) {
        return errorMessage;
      }

      return null;
    } catch (_err: unknown) {
      return strings.warningFileSystemError;
    }
  },
};

// All warning checks
const WARNING_CHECKS: readonly WarningCheck[] = [
  homeDirectoryCheck,
  rootDirectoryCheck,
];

export async function getUserStartupWarnings(
  workspaceRoot: string = process.cwd(),
): Promise<string[]> {
  const results = await Promise.all(
    WARNING_CHECKS.map((check) => check.check(workspaceRoot)),
  );
  return results.filter((msg) => msg !== null);
}
