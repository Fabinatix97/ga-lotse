/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "path";

import { extractLinkedDependencies } from "./extractLinkedDependencies.mjs";

/**
 * @typedef Context
 * @prop workspaceDir {string}
 * @prop lockfile {import("@pnpm/lockfile.fs").LockfileObject}
 */

/**
 * @param gradleDependencies {Array | null}
 * @param options {import("@pnpm/meta-updater").FormatPluginFnOptions}
 * @param context {Context}
 */
export function updateGradleDependencies(gradleDependencies, options, context) {
  if (options.dir === context.workspaceDir) {
    return null;
  }

  const linkedDependencies = extractLinkedDependencies(options.dir, context);

  if (linkedDependencies.length === 0) {
    return null;
  }

  const dependencies = linkedDependencies.map((packageDir) => {
    const projectId = path.basename(packageDir);
    return `:${projectId}`;
  }).toSorted();
  return { dependencies };
}
