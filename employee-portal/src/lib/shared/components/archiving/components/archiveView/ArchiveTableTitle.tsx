/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiArchivingRelevance } from "@eshg/employee-portal-api/businessProcedures";
import {
  DeleteOutlined,
  Inventory2Outlined,
  SubdirectoryArrowRightOutlined,
} from "@mui/icons-material";
import { Button, Divider, Sheet, Typography } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import { ArchiveTableProps } from "@/lib/shared/components/archiving/components/archiveView/ArchiveTable";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { mapToRowIds } from "@/lib/shared/hooks/table/useRowSelection";

interface ArchiveTableTitleProps extends ArchiveTableProps {
  rowSelection: RowSelectionState;
}

export function ArchiveTableTitle(props: ArchiveTableTitleProps) {
  const { openConfirmationDialog } = useConfirmationDialog();
  const selectedProcedureIds = mapToRowIds(props.rowSelection);

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
    <Sheet
      variant="soft"
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        borderRadius: 0,
        height: 48,
        padding: (theme) => theme.spacing(0.5, 1.5),
      }}
    >
      <SubdirectoryArrowRightOutlined
        sx={{ transform: "rotate(90deg)", fontSize: "1.25rem" }}
      />
      <Typography level="body-sm" data-testid="selectedIndicator">
        <Typography fontWeight="bold">{selectedProcedureIds.length}</Typography>{" "}
        {selectedProcedureIds.length === 1 ? "Vorgang" : "Vorgänge"} ausgewählt
      </Typography>
      <Divider orientation="vertical" />
      {selectedProcedureIds.length === 0 && (
        <Typography level="body-sm" color="danger">
          Bitte Vorgänge auswählen
        </Typography>
      )}
      {selectedProcedureIds.length > 0 && (
        <>
          <Button
            data-testid="archiveButton"
            startDecorator={<Inventory2Outlined />}
            variant="plain"
            color="neutral"
            size="sm"
            disabled={isUpdatePending}
            onClick={handleBulkArchiveAction}
          >
            Archivieren
          </Button>
          <Divider orientation="vertical" sx={{ marginY: 1 }} />
          <Button
            data-testid="deleteButton"
            startDecorator={<DeleteOutlined />}
            variant="plain"
            color="neutral"
            size="sm"
            disabled={isUpdatePending}
            onClick={handleBulkDeleteAction}
          >
            Löschen
          </Button>
        </>
      )}
    </Sheet>
  );
}
