/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiArchivingRelevance,
  ApiGetRelevantArchivableProceduresSortBy,
} from "@eshg/employee-portal-api/businessProcedures";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { DeleteOutlined, DownloadOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { ArchiveAdminViewProps } from "@/lib/shared/components/archiving/ArchiveAdminView";
import { NoProceduresFallback } from "@/lib/shared/components/archiving/components/NoProceduresFallback";
import { archiveAdminTableColumns } from "@/lib/shared/components/archiving/components/archiveAdminView/archiveAdminTableColumns";
import {
  getRelevantArchivableProceduresFilters,
  useArchiveAdminFilterSettings,
} from "@/lib/shared/components/archiving/hooks/useArchiveAdminFilterSettings";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKey,
} from "@/lib/shared/components/table/sorting";
import { formatFileSize } from "@/lib/shared/helpers/file";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

export type ArchiveAdminTableProps = Omit<ArchiveAdminViewProps, "title">;

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

  const { downloadContainerRef, download: downloadRelevantProcedures } =
    useFileDownload(exportRelevantProcedures.mutateAsync);

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
        <ButtonBar left={<FilterButton disabled />} />
        <NoProceduresFallback message="Es liegen keine archivierten Vorgänge vor." />
      </>
    );
  }

  return (
    <>
      <TablePage
        fullHeight
        controls={
          <ButtonBar
            left={<FilterButton {...filterSettings.filterButtonProps} />}
            right={
              totalElements > 0 ? (
                <>
                  <Button
                    onClick={handleDeleteAction}
                    disabled={bulkUpdateProceduresArchivingRelevance.isPending}
                    loading={bulkUpdateProceduresArchivingRelevance.isPending}
                    loadingPosition="start"
                    variant="outlined"
                    startDecorator={<DeleteOutlined />}
                  >
                    Alle löschen
                  </Button>
                  <Button
                    onClick={handleExportAction}
                    disabled={exportRelevantProcedures.isPending}
                    loading={exportRelevantProcedures.isPending}
                    loadingPosition="start"
                    startDecorator={<DownloadOutlined />}
                  >
                    Alle als ZIP exportieren
                  </Button>
                </>
              ) : undefined
            }
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
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
