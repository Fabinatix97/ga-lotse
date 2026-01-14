/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { readWantedLockfile } from "@pnpm/lockfile.fs";
import { createUpdateOptions } from "@pnpm/meta-updater";

import { updateGradleDependencies } from "./updateGradleDependencies.mjs";

/**
 * @param workspaceDir {string}
 */
export default async (workspaceDir) => {
  const lockfile = await readWantedLockfile(workspaceDir, {
    ignoreIncompatible: false,
  });
  if (lockfile == null) {
    throw new Error("No lockfile found");
  }

  const context = { workspaceDir, lockfile };

  return createUpdateOptions({
    files: {
      "gradleDependencies.json": (gradleDependencies, options) =>
        updateGradleDependencies(gradleDependencies, options, context),
      "package.json": (manifest) => {
        return {
          ...manifest,
          packageManager: "pnpm@10.23.0",
          devEngines: {
            runtime: {
              name: "node",
              version: ">=22.18 <23",
              onFail: "error",
            },
            packageManager: {
              name: "pnpm",
              version: ">=10.21 <11",
              onFail: "error",
            },
          },
        };
      },
    },
  });
};
