/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";

import { InspectionHistoryTable } from "@/lib/businessModules/inspection/components/inspection/history/InspectionHistoryTable";

export function InspectionTabHistory({
  inspectionId,
}: Readonly<{ inspectionId: string }>) {
  return (
    <Box padding={2} role="tabpanel">
      <InspectionHistoryTable filter={{}} inspectionId={inspectionId} />
    </Box>
  );
}
