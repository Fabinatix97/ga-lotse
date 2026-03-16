/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChipProps } from "@mui/joy";

import {
  ApiInstructionType,
  ApiProcedureStatus,
  ApiProcedureType,
} from "@eshg/infection-briefing-api";
import { EnumMap } from "@eshg/lib-portal";

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

export const INSTRUCTION_TYPE_VALUES: EnumMap<ApiInstructionType> = {
  [ApiInstructionType.Online]: "Online",
  [ApiInstructionType.OnSite]: "Vor-Ort",
};

export const PROCEDURE_TYPE_VALUES: Partial<EnumMap<ApiProcedureType>> = {
  [ApiProcedureType.InfectionBriefingNew]: "Erstaustellung",
  [ApiProcedureType.InfectionBriefingReplacement]: "Duplikat",
};
