/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { endOfMonth, isAfter, startOfYear } from "date-fns";

import { Alert, formatDate } from "@eshg/lib-portal";
import { ApiGetArchivableProceduresSortBy } from "@eshg/lib-procedures-api";

import { ButtonBar } from "../../../../components/buttons/ButtonBar";
import { FilterSettings } from "../../../filters/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "../../../filters/components/filterSettings/FilterSettingsSheet";
import { ToggleFilterButton } from "../../../filters/components/filterSettings/ToggleFilterButton";
import { DataTable } from "../../../table/components/DataTable";
import { TablePage } from "../../../table/components/TablePage";
import { TableSheet } from "../../../table/components/TableSheet";
import { Pagination } from "../../../table/components/pagination/Pagination";
import {
  useRowSelection,
  useSyncRowSelection,
} from "../../../table/hooks/useRowSelection";
import { useTableControl } from "../../../table/hooks/useTableControl";
import { getSortDirection, getSortKey } from "../../../table/utils/sorting";
import { ArchivableProcedure } from "../../api/models/archivableProcedure";
import {
  useGetArchivableProcedures,
  useGetArchivingConfiguration,
} from "../../api/queries";
import {
  getArchivableProceduresFilters,
  useArchiveFilterSettings,
} from "../../hooks/useArchiveFilterSettings";
import { NoProceduresFallback } from "../NoProceduresFallback";

import { ArchivePageProps } from "./ArchivePage";
import { ArchiveTableTitle } from "./ArchiveTableTitle";
import { archiveTableColumns } from "./archiveTableColumns";

export type ArchiveTableProps = Omit<ArchivePageProps, "title">;

export function ArchiveTable(props: ArchiveTableProps) {
  const {
    procedureDetailsRoute,
    businessModule,
    archivingApi,
    procedureTypes,
  } = props;
  const { data: configuration } = useGetArchivingConfiguration(
    archivingApi,
    businessModule,
  );

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    initialSorting: {
      id: ApiGetArchivableProceduresSortBy.ClosedAt,
      desc: false,
    },
  });
  const filterSettings = useArchiveFilterSettings(
    procedureTypes,
    configuration,
  );
  const { pageSize, pageNumber } = tableControl.paginationProps;
  const {
    data: { procedures, totalElements },
  } = useGetArchivableProcedures(archivingApi, businessModule, {
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
              left={
                <ToggleFilterButton {...filterSettings.filterButtonProps} />
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
                route: (row) => procedureDetailsRoute(row.original.procedureId),
                focusColumnAccessorKey: "closedAt",
              }}
            />
          </TableSheet>
        </TablePage>
      ) : (
        <>
          <ButtonBar left={<ToggleFilterButton disabled />} />
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
