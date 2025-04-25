/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteOutlined, Inventory2Outlined } from "@mui/icons-material";
import { Divider, Typography } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import {
  RowSelectionTableToolbar,
  RowSelectionTableToolbarButton,
  mapRowSelectionToRowIds,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { ApiArchivingRelevance } from "@eshg/lib-procedures-api";

import { ArchiveTableProps } from "@/lib/shared/components/archiving/components/archiveView/ArchiveTable";

interface ArchiveTableTitleProps extends ArchiveTableProps {
  rowSelection: RowSelectionState;
}

export function ArchiveTableTitle(props: ArchiveTableTitleProps) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const selectedProcedureIds = mapRowSelectionToRowIds(props.rowSelection);

  const bulkUpdateProceduresArchivingRelevance =
    props.useBulkUpdateProceduresArchivingRelevance();
  const isUpdatePending = bulkUpdateProceduresArchivingRelevance.isPending;

  function handleBulkArchiveAction() {
    openConfirmationDialog({
      title: "Vorgänge archivieren?",
      description:
        "Sind Sie sicher, dass Sie die ausgewählten Vorgänge archivieren möchten?",
      confirmLabel: "Für die Archivierung markieren",
      children: (
        <Typography textColor="text.secondary">
          Diese Vorgänge werden einem Archiv-Admin vorgelegt und sind nach dem
          Archivieren für Sie nicht mehr sichtbar.
        </Typography>
      ),
      color: "danger",
      onConfirm: handleBulkArchiveActionConfirm,
    });
  }

  function handleBulkArchiveActionConfirm() {
    bulkUpdateProceduresArchivingRelevance.mutate({
      procedureIds: selectedProcedureIds,
      archivingRelevance: ApiArchivingRelevance.Relevant,
    });
  }

  function handleBulkDeleteAction() {
    openConfirmationDialog({
      title: "Vorgänge löschen?",
      description:
        "Sind Sie sicher, dass Sie die ausgewählten Vorgänge löschen möchten? Diese Aktion ist unwiderruflich.",
      confirmLabel: "Löschen",
      color: "danger",
      onConfirm: handleBulkDeleteActionConfirm,
    });
  }

  function handleBulkDeleteActionConfirm() {
    bulkUpdateProceduresArchivingRelevance.mutate({
      procedureIds: selectedProcedureIds,
      archivingRelevance: ApiArchivingRelevance.Irrelevant,
    });
  }

  return (
    <RowSelectionTableToolbar
      rowSelection={props.rowSelection}
      elementName={{
        singular: "Vorgang ausgewählt",
        plural: "Vorgänge ausgewählt",
      }}
    >
      {selectedProcedureIds.length === 0 && (
        <Typography level="body-sm" color="danger">
          Bitte Vorgänge auswählen
        </Typography>
      )}
      {selectedProcedureIds.length > 0 && (
        <>
          <RowSelectionTableToolbarButton
            data-testid="archiveButton"
            decorator={<Inventory2Outlined />}
            disabled={isUpdatePending}
            onClick={handleBulkArchiveAction}
          >
            Archivieren
          </RowSelectionTableToolbarButton>
          <Divider orientation="vertical" sx={{ marginY: 1 }} />
          <RowSelectionTableToolbarButton
            data-testid="deleteButton"
            decorator={<DeleteOutlined />}
            disabled={isUpdatePending}
            onClick={handleBulkDeleteAction}
          >
            Löschen
          </RowSelectionTableToolbarButton>
        </>
      )}
    </RowSelectionTableToolbar>
  );
}
