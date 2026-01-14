/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const RevisionType = {
  ADD: "ADD",
  MOD: "MOD",
  DEL: "DEL",
} as const;
export type RevisionType = (typeof RevisionType)[keyof typeof RevisionType];

export interface AuditEntity {
  revisionType: RevisionType;
}
