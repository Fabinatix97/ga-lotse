/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const ImportListType = {
  CitizenList: "citizenList",
  SchoolList: "schoolList",
  PastProcedureList: "pastProcedureList",
} as const;
export type ImportListType =
  (typeof ImportListType)[keyof typeof ImportListType];
