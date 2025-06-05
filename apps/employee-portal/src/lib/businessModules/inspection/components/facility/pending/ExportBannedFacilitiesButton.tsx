/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FileDownloadOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import {
  OverlayBoundary,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";

import { useExportBannedFacilities } from "@/lib/businessModules/inspection/api/mutations/facility";

export function ExportBannedFacilitiesButton() {
  return (
    <OverlayBoundary>
      <ExportBannedFacilitiesButtonWithinOverlay />
    </OverlayBoundary>
  );
}

function ExportBannedFacilitiesButtonWithinOverlay() {
  const { openConfirmationDialog } = useConfirmationDialog();
  const { mutate: exportBannedFacilities } = useExportBannedFacilities();

  function handleClick() {
    openConfirmationDialog({
      title: "Untersagte Einrichtungen als Liste herunterladen?",
      description:
        "Sie sind im Begriff, eine Liste herunterzuladen, die sämtliche untersagten Einrichtungen umfasst.",
      confirmLabel: "Herunterladen",
      color: "primary",
      onConfirm: exportBannedFacilities,
    });
    return Promise.resolve();
  }

  return (
    <Button
      variant="outlined"
      startDecorator={<FileDownloadOutlined />}
      onClick={handleClick}
    >
      Untersagte Einrichtungen
    </Button>
  );
}
