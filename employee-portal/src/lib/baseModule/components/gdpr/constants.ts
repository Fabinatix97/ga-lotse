/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureStatus } from "@eshg/employee-portal-api/base";
import { DefaultColorPalette } from "@mui/joy/styles/types";

export const gdprProcedureStatusColor = {
  OPEN: "neutral",
  DRAFT: "warning",
  IN_PROGRESS: "primary",
  CLOSED: "success",
  ABORTED: "danger",
} as const satisfies Record<ApiGdprProcedureStatus, DefaultColorPalette>;
