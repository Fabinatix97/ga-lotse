/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { ApiInspection } from "@eshg/inspection-api";

import { translateInspectionPhase } from "@/lib/businessModules/inspection/shared/enums";

export function InspectionPhaseSelect({
  inspection,
}: Readonly<{
  inspection: ApiInspection;
}>) {
  return (
    <Typography
      sx={{ ml: "auto" }}
      level="body-md"
      color="neutral"
      component="span"
      noWrap
    >
      Phase: {translateInspectionPhase(inspection.phase)}
    </Typography>
  );
}
