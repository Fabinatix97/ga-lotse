/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureStatus } from "@eshg/base-api";

export const procedureStatusNames = {
  [ApiProcedureStatus.Draft]: "Entwurf",
  [ApiProcedureStatus.Open]: "Offen",
  [ApiProcedureStatus.InProgress]: "In Bearbeitung",
  [ApiProcedureStatus.Closed]: "Abgeschlossen",
  [ApiProcedureStatus.Aborted]: "Abgebrochen",
} satisfies Record<ApiProcedureStatus, string>;

export function translateProcedureStatus(status: ApiProcedureStatus) {
  return procedureStatusNames[status];
}
