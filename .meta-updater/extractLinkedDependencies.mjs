/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import * as path from "path";
import * as fs from "fs";

/**
 * @typedef Context
 * @prop workspaceDir {string}
 * @prop lockfile {import("@pnpm/lockfile.fs").LockfileObject}
 */

/**
 * @param sourcePackageDir {string}
 * @param context {Context}
 */
export function extractLinkedDependencies(sourcePackageDir, context) {
  const projectId = path.normalize(
    path.relative(context.workspaceDir, sourcePackageDir),
  );

  const importer = context.lockfile.importers[projectId];
  if (importer === undefined) {
    return [];
  }

  const dependencies = {
    ...importer.dependencies,
    ...importer.devDependencies
  };

  /**
   * @type {string[]}
   */
  const linkValues = [];

  for (const [_depName, spec] of Object.entries(dependencies)) {
    if (!spec.startsWith("link:") || spec.length === 5) continue;
    const relativePath = spec.slice(5);
    const linkedPackageDir = path.join(sourcePackageDir, relativePath);
    if (!fs.existsSync(path.join(linkedPackageDir, "tsconfig.json"))) continue;
    linkValues.push(relativePath);
  }

  return linkValues.toSorted();
}
