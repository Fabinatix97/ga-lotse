/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProcedureStatus } from "@eshg/base-api";

export const PROCEDURE_STATUS_NAMES: Record<ApiProcedureStatus, string> = {
  [ApiProcedureStatus.Aborted]: "Abgebrochen",
  [ApiProcedureStatus.Closed]: "Geschlossen",
  [ApiProcedureStatus.Draft]: "Entwurf",
  [ApiProcedureStatus.InProgress]: "in Arbeit",
  [ApiProcedureStatus.Open]: "Offen",
} satisfies Record<ApiProcedureStatus, string>;
