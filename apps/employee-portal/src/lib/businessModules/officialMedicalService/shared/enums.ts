/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/base-api";

import { procedureStatusNames } from "@/lib/baseModule/api/procedures/enums";

export const omsProcedureStatusFilterNames = {
  [ApiProcedureStatus.Draft]: procedureStatusNames[ApiProcedureStatus.Draft],
  [ApiProcedureStatus.Open]: procedureStatusNames[ApiProcedureStatus.Open],
  [ApiProcedureStatus.InProgress]:
    procedureStatusNames[ApiProcedureStatus.InProgress],
} satisfies Record<string, string>;

export const omsProcedureUrgentFilterNames = {
  ["true"]: "Nur dringende Fälle",
} satisfies Record<string, string>;
