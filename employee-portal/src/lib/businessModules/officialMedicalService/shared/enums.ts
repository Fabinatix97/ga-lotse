/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/base-api";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";

export const omsProcedureAssignedFilterNames = {
  ["true"]: "Nur mir zugewiesene Fälle",
} satisfies Record<string, string>;

export const omsProcedureStatusFilterNames = {
  [ApiProcedureStatus.Draft]: procedureStatusNames[ApiProcedureStatus.Draft],
  [ApiProcedureStatus.Open]: procedureStatusNames[ApiProcedureStatus.Open],
  [ApiProcedureStatus.InProgress]:
    procedureStatusNames[ApiProcedureStatus.InProgress],
} satisfies Record<string, string>;

export const omsProcedureHighPriorityFilterNames = {
  ["true"]: "Nur dringende Fälle",
} satisfies Record<string, string>;

export const omsProcedureTodayFilterNames = {
  ["true"]: "Nur Vorgänge mit Termin heute",
} satisfies Record<string, string>;
