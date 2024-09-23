/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiServiceStatus } from "@eshg/employee-portal-api/travelMedicine";
import { ChipProps } from "@mui/joy";

export const statusColors = {
  [ApiServiceStatus.Open]: "neutral",
  [ApiServiceStatus.Planned]: "warning",
  [ApiServiceStatus.Accomplished]: "success",
} satisfies Record<ApiServiceStatus, ChipProps["color"]>;
