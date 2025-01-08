/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export enum RevisionType {
  ADD = "ADD",
  MOD = "MOD",
  DEL = "DEL",
}

export interface AuditEntity {
  revisionType: RevisionType;
}
