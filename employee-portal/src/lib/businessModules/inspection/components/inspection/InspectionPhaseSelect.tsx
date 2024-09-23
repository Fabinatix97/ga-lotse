/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspection } from "@eshg/employee-portal-api/inspection";
import { Typography } from "@mui/joy";

import { translateInspectionPhase } from "@/lib/businessModules/inspection/shared/enums";

export function InspectionPhaseSelect({
  inspection,
}: Readonly<{
  inspection: ApiInspection;
}>) {
  return (
    <Typography level="body-md" color="neutral">
      Phase: {translateInspectionPhase(inspection.phase)}
    </Typography>
  );
}
