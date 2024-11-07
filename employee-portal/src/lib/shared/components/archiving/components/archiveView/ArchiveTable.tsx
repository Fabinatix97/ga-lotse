/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetArchivableProceduresSortBy } from "@eshg/employee-portal-api/businessProcedures";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { endOfMonth, isAfter, startOfYear } from "date-fns";

import { ArchiveViewProps } from "@/lib/shared/components/archiving/ArchiveView";
import { ArchivableProcedure } from "@/lib/shared/components/archiving/api/models/archivableProcedure";
import { NoProceduresFallback } from "@/lib/shared/components/archiving/components/NoProceduresFallback";
import { ArchiveTableTitle } from "@/lib/shared/components/archiving/components/archiveView/ArchiveTableTitle";
import { archiveTableColumns } from "@/lib/shared/components/archiving/components/archiveView/archiveTableColumns";
import {
  getArchivableProceduresFilters,
  useArchiveFilterSettings,
} from "@/lib/shared/components/archiving/hooks/useArchiveFilterSettings";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
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
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import {
  useRowSelection,
  useSyncRowSelection,
} from "@/lib/shared/hooks/table/useRowSelection";

export type ArchiveTableProps = Omit<ArchiveViewProps, "title">;

export function ArchiveTable(props: ArchiveTableProps) {
  const { data: configuration } = props.useGetArchivingConfiguration();

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    initialSorting: {
      id: ApiGetArchivableProceduresSortBy.ClosedAt,
      desc: false,
    },
  });
  const filterSettings = useArchiveFilterSettings(
    props.additionalFilters.procedureTypes,
    configuration,
  );
  const { pageSize, pageNumber } = tableControl.paginationProps;
  const {
    data: { procedures, totalElements },
  } = props.useGetArchivableProcedures({
    pageSize,
    pageNumber,
    sortBy: getSortKey(tableControl.tableSorting),
    sortOrder: getSortDirection(tableControl.tableSorting),
    ...getArchivableProceduresFilters(filterSettings.activeValues),
  });

  const { rowSelection, rowSelectionProps } =
    useRowSelection<ArchivableProcedure>();
  useSyncRowSelection(rowSelectionProps, procedures);

  const hasActiveFilters = filterSettings.activeValues.length > 0;
  const showTable = hasActiveFilters || totalElements !== 0;

  return (
    <>
      <GracePeriodAlert gracePeriodMonths={configuration.gracePeriodMonths} />
      {showTable ? (
        <TablePage
          fullHeight
          controls={
            <ButtonBar
              left={<FilterButton {...filterSettings.filterButtonProps} />}
            />
          }
          filterSettings={
            filterSettings.filterSettingsVisible && (
              <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
                <FilterSettings {...filterSettings.filterSettingsProps} />
              </FilterSettingsSheet>
            )
          }
          data-testid="archiveTable"
        >
          <TableSheet
            title={<ArchiveTableTitle rowSelection={rowSelection} {...props} />}
            footer={
              <Pagination
                totalCount={totalElements}
                {...tableControl.paginationProps}
              />
            }
          >
            <DataTable
              data={procedures}
              columns={archiveTableColumns}
              sorting={tableControl.tableSorting}
              enableSortingRemoval={false}
              rowSelectionProps={rowSelectionProps}
              rowNavigation={{
                route: (row) =>
                  props.procedureDetailsRoute(row.original.procedureId),
                focusColumnAccessorKey: "closedAt",
              }}
            />
          </TableSheet>
        </TablePage>
      ) : (
        <>
          <ButtonBar left={<FilterButton disabled />} />
          <NoProceduresFallback message="Für dieses Fachmodul liegen keine zu archivierenden Vorgänge vor." />
        </>
      )}
    </>
  );
}

function GracePeriodAlert({
  gracePeriodMonths,
}: {
  gracePeriodMonths: number;
}) {
  const monthIndex = gracePeriodMonths - 1;
  const today = new Date();
  const endOfGracePeriod = endOfMonth(
    new Date(today.getFullYear(), monthIndex),
  );

  if (isAfter(today, endOfGracePeriod)) {
    const startOfNextGracePeriod = startOfYear(
      new Date(today.getFullYear() + 1, 0),
    );
    return (
      <Alert
        color="primary"
        sx={{ marginBottom: 2 }}
        title={`Die diesjährige Archivierungsperiode ist abgelaufen. Am ${formatDate(startOfNextGracePeriod, "de")} beginnt die nächste Archivierungsperiode.`}
      />
    );
  }

  return (
    <Alert
      color="primary"
      sx={{ marginBottom: 2 }}
      title={`Das System hat eine Standard-Aktion für die Vorgänge definiert. Diese wird am ${formatDate(endOfGracePeriod, "de")} ausgeführt, wenn Sie keine manuelle Aktion auswählen.`}
    />
  );
}
