/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteOutlined, DownloadOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import {
  ButtonBar,
  DataTable,
  FilterSettings,
  FilterSettingsSheet,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  getSortDirection,
  getSortKey,
  useConfirmationDialog,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { formatFileSize } from "@eshg/lib-portal/components/formFields/file/helpers";
import {
  ApiArchivingRelevance,
  ApiGetRelevantArchivableProceduresSortBy,
} from "@eshg/lib-procedures-api";

import { ArchiveAdminViewProps } from "@/lib/shared/components/archiving/ArchiveAdminView";
import { NoProceduresFallback } from "@/lib/shared/components/archiving/components/NoProceduresFallback";
import { archiveAdminTableColumns } from "@/lib/shared/components/archiving/components/archiveAdminView/archiveAdminTableColumns";
import {
  getRelevantArchivableProceduresFilters,
  useArchiveAdminFilterSettings,
} from "@/lib/shared/components/archiving/hooks/useArchiveAdminFilterSettings";

type ArchiveAdminTableProps = Omit<ArchiveAdminViewProps, "title">;

export function ArchiveAdminTable(props: ArchiveAdminTableProps) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    initialSorting: {
      id: ApiGetRelevantArchivableProceduresSortBy.ClosedAt,
      desc: false,
    },
  });
  const filterSettings = useArchiveAdminFilterSettings();

  const { pageSize, pageNumber } = tableControl.paginationProps;
  const {
    data: { procedures, totalElements, fileSizeBytes },
  } = props.useGetRelevantArchivableProcedures({
    pageSize,
    pageNumber,
    sortBy: getSortKey(tableControl.tableSorting),
    sortOrder: getSortDirection(tableControl.tableSorting),
    ...getRelevantArchivableProceduresFilters(filterSettings.activeValues),
  });

  const exportRelevantProcedures = props.useExportRelevantProcedures();
  const bulkUpdateProceduresArchivingRelevance =
    props.useBulkUpdateProceduresArchivingRelevance();

  const { download: downloadRelevantProcedures } = useFileDownload(
    exportRelevantProcedures.mutateAsync,
  );

  const { openConfirmationDialog } = useConfirmationDialog();

  function handleExportAction() {
    openConfirmationDialog({
      title: "Dateien exportieren?",
      description: `Möchten Sie die Vorgänge wirklich herunterladen? Die exportierte Datei ist im ZIP-Format und ungefähr ${formatFileSize(fileSizeBytes)} groß.`,
      confirmLabel: "Herunterladen",
      color: "danger",
      onConfirm: handleExportActionConfirm,
    });
  }

  function handleDeleteAction() {
    openConfirmationDialog({
      title: "Vorgänge löschen?",
      description: `Wollen Sie ${totalElements} ${totalElements === 1 ? "Vorgang" : "Vorgänge"} wirklich unwiderruflich löschen?`,
      confirmLabel: "Löschen",
      color: "danger",
      onConfirm: handleDeleteActionConfirm,
    });
  }

  async function handleExportActionConfirm() {
    const procedureIds = procedures.map(({ procedureId }) => procedureId);
    await downloadRelevantProcedures({ procedureIds });
  }

  function handleDeleteActionConfirm() {
    bulkUpdateProceduresArchivingRelevance.mutate({
      procedureIds: procedures.map(({ procedureId }) => procedureId),
      archivingRelevance: ApiArchivingRelevance.Irrelevant,
    });
  }

  const hasActiveFilters = filterSettings.activeValues.length > 0;
  const showTable = hasActiveFilters || totalElements !== 0;
  if (!showTable) {
    return (
      <>
        <ButtonBar left={<ToggleFilterButton disabled />} />
        <NoProceduresFallback message="Es liegen keine archivierten Vorgänge vor." />
      </>
    );
  }

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={<ToggleFilterButton {...filterSettings.filterButtonProps} />}
          right={
            totalElements > 0 ? (
              <>
                <Button
                  disabled={bulkUpdateProceduresArchivingRelevance.isPending}
                  loading={bulkUpdateProceduresArchivingRelevance.isPending}
                  loadingPosition="start"
                  variant="outlined"
                  startDecorator={<DeleteOutlined />}
                  onClick={handleDeleteAction}
                >
                  Alle löschen
                </Button>
                <Button
                  disabled={exportRelevantProcedures.isPending}
                  loading={exportRelevantProcedures.isPending}
                  loadingPosition="start"
                  startDecorator={<DownloadOutlined />}
                  onClick={handleExportAction}
                >
                  Alle als ZIP exportieren
                </Button>
              </>
            ) : undefined
          }
          invertDomOrder
        />
      }
      filterSettings={
        filterSettings.filterSettingsVisible && (
          <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
            <FilterSettings {...filterSettings.filterSettingsProps} />
          </FilterSettingsSheet>
        )
      }
      data-testid="archiveAdminTable"
    >
      <TableSheet
        footer={
          <Pagination
            totalCount={totalElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={procedures}
          columns={archiveAdminTableColumns}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
        />
      </TableSheet>
    </TablePage>
  );
}
