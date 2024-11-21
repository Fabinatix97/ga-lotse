/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionFeature } from "@eshg/employee-portal-api/inspection";
import { FileDownloadOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useExportBannedFacilities } from "@/lib/businessModules/inspection/api/mutations/facility";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

export function ExportBannedFacilitiesButton() {
  return (
    <OverlayBoundary>
      <ExportBannedFacilitiesButtonWithinOverlay />
    </OverlayBoundary>
  );
}

function ExportBannedFacilitiesButtonWithinOverlay() {
  const isEnabled = useIsNewFeatureEnabled(
    ApiInspectionFeature.BannedFacilitiesExport,
  );
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

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        startDecorator={<FileDownloadOutlined />}
      >
        Untersagte Einrichtungen
      </Button>
    </>
  );
}
