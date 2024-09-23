/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const ImportListType = {
  CitizenList: "citizenList",
  SchoolList: "schoolList",
} as const;
export type ImportListType =
  (typeof ImportListType)[keyof typeof ImportListType];
