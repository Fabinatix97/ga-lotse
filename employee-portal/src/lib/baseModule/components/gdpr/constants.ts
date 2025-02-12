/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureStatus } from "@eshg/base-api";
import { DefaultColorPalette } from "@mui/joy/styles/types";

export const gdprProcedureStatusColor = {
  DRAFT: "warning",
  IN_PROGRESS: "primary",
  CLOSED: "success",
  ABORTED: "danger",
} as const satisfies Record<ApiGdprProcedureStatus, DefaultColorPalette>;
