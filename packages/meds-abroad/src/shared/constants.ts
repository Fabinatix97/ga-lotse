/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipProps } from "@mui/joy";

import { EnumMap } from "@eshg/lib-portal";

import { ApiProcedureStatus } from "./tempApiTypes";

export const PROCEDURE_STATUS_VALUES: EnumMap<ApiProcedureStatus> = {
  [ApiProcedureStatus.Aborted]: "Abgebrochen",
  [ApiProcedureStatus.Closed]: "Geschlossen",
  [ApiProcedureStatus.Draft]: "Entwurf",
  [ApiProcedureStatus.InProgress]: "In Arbeit",
  [ApiProcedureStatus.Open]: "Offen",
};

export const PROCEDURE_STATUS_COLORS: EnumMap<
  ApiProcedureStatus,
  ChipProps["color"]
> = {
  [ApiProcedureStatus.Aborted]: "warning",
  [ApiProcedureStatus.Closed]: "success",
  [ApiProcedureStatus.Draft]: "neutral",
  [ApiProcedureStatus.InProgress]: "primary",
  [ApiProcedureStatus.Open]: "neutral",
};
