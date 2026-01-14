/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InsertDriveFileOutlined } from "@mui/icons-material";

import { RowSelectionTableToolbarButton } from "@eshg/lib-employee-portal";

import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { useBulkDownloadInvitations } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkDownloadInvitations/useBulkDownloadInvitations";

import { DownloadNotPossibleDialog } from "./DownloadNotPossibleDialog";
import { PartialDownloadDialog } from "./PartialDownloadDialog";

interface BulkDownloadInvitationsButtonProps {
  selectedProcedureIds: string[];
  procedures: Procedure[];
}

export function BulkDownloadInvitationsButton(
  props: BulkDownloadInvitationsButtonProps,
) {
  const {
    startDownload,
    isPending,
    downloadNotPossibleDialogProps,
    partialDownloadDialogProps,
  } = useBulkDownloadInvitations();

  return (
    <>
      <RowSelectionTableToolbarButton
        decorator={<InsertDriveFileOutlined />}
        isPending={isPending}
        disabled={isPending}
        onClick={() =>
          startDownload(props.procedures, props.selectedProcedureIds)
        }
      >
        Einladungen herunterladen
      </RowSelectionTableToolbarButton>
      <DownloadNotPossibleDialog {...downloadNotPossibleDialogProps} />
      <PartialDownloadDialog
        {...partialDownloadDialogProps}
        isPending={isPending}
      />
    </>
  );
}
