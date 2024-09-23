/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiInspection,
  ApiInspectionPhase,
} from "@eshg/employee-portal-api/inspection";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { CheckOutlined, EditRoadOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useApproveInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { inspectionHasResult } from "@/lib/businessModules/inspection/components/inspection/reportresult/reportutils";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export function ReportApprovalButtons({
  inspection,
}: Readonly<{
  inspection: ApiInspection;
}>) {
  const snackbar = useSnackbar();
  const { mutateAsync: approveInspection } = useApproveInspection();
  const router = useRouter();
  const { openConfirmationDialog } = useConfirmationDialog();
  const isOffline = useIsOffline();
  const editable =
    !isOffline &&
    inspectionIsBeforePhase(inspection.phase, ApiInspectionPhase.Closed);

  if (!editable) {
    // don't show those buttons if a) report has been created already (i.e. we're
    // in phase Closed), or b) we're offline
    return null;
  }

  function handleApproveInspection() {
    if (!inspectionHasResult(inspection)) {
      snackbar.notification("Bitte geben Sie erst eine Bewertung ab.");
      return;
    }
    openConfirmationDialog({
      title: "Begehungsprotokoll freigeben",
      description:
        "Möchten Sie das Begehungsprotokoll in der jetzigen Fassung endgültig freigeben? Der finale Bericht wird dann erzeugt. Dies kann nicht rückgängig gemacht werden.",
      confirmLabel: "Freigeben",
      onConfirm: executeApproveInspection,
      color: "danger",
    });
  }

  async function executeApproveInspection() {
    await approveInspection({ id: inspection.externalId });
    router.refresh(); // to update displayed page
  }

  return (
    <>
      <InternalLinkButton
        href={routes.procedures.reportEditor(
          inspection.externalId,
          inspection.reportId!,
        )}
        variant="outlined"
        startDecorator={<EditRoadOutlined />}
      >
        Zum Editor
      </InternalLinkButton>
      <Button
        variant="solid"
        startDecorator={<CheckOutlined />}
        onClick={handleApproveInspection}
      >
        Freigeben
      </Button>
    </>
  );
}
