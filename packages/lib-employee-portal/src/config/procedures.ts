/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProcedureStatus } from "@eshg/base-api";
import { ChipProps } from "@mui/joy";

export const PROCEDURE_STATUS_COLORS: Record<
  ApiProcedureStatus,
  ChipProps["color"]
> = {
  [ApiProcedureStatus.Aborted]: "warning",
  [ApiProcedureStatus.Closed]: "success",
  [ApiProcedureStatus.Draft]: "neutral",
  [ApiProcedureStatus.InProgress]: "primary",
  [ApiProcedureStatus.Open]: "warning",
};
