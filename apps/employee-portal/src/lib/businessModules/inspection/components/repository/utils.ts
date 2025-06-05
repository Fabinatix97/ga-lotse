/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish, isNullish } from "remeda";

export function isCurrentVersion(
  version: number,
  localCldRepoVersion?: number,
) {
  return version === localCldRepoVersion;
}

export function isUpdateableVersion(
  version: number,
  localCldRepoVersion?: number,
) {
  return isNonNullish(localCldRepoVersion) && localCldRepoVersion < version;
}

export function isNewVersion(localCldRepoVersion?: number) {
  return isNullish(localCldRepoVersion);
}
