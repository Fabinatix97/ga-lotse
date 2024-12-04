/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProphylaxisSessionSortKey } from "@eshg/employee-portal-api/dental";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { ReactNode, useState } from "react";

import { ProphylaxisSession } from "@/lib/businessModules/dental/api/models/ProphylaxisSession";
import { useGetProphylaxisSessions } from "@/lib/businessModules/dental/api/queries/prophylaxisSessionApi";
import {
  ProphylaxisSessionFilterSettings,
  ProphylaxisSessionFilters,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionFilterSettings";
import { routes } from "@/lib/businessModules/dental/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { useFilterDictionary } from "@/lib/shared/components/filterSettings/useFilterDictionary";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKeyWithSpecificMapping,
} from "@/lib/shared/components/table/sorting";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

const initialSorting: ColumnSort = {
  id: "id",
  desc: true,
};

interface ProphylaxisSessionsTableProps {
  buttons?: ReactNode[];
}

export function ProphylaxisSessionsTable(props: ProphylaxisSessionsTableProps) {
  const [activePanel, toggleActivePanel] = useState<"filters" | undefined>();

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const {
    filterValues,
    filterFormValues,
    setFilterFormValue,
    deleteFilterValue,
    clearFilterValues,
    filterButtonProps,
    filterSettingsSheetProps,
    activeFilters,
  } = useFilterDictionary<
    keyof ProphylaxisSessionFilters,
    ProphylaxisSessionFilters
  >({
    onChangeFilters: () => {
      tableControl.paginationProps.onPageChange(0);
    },
  });

  const sessions = useGetProphylaxisSessions({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    ...filterValues,
    sortKey: getSortKeyWithSpecificMapping(
      tableControl.tableSorting,
      SORT_KEY_MAPPING,
    ),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={[
            <FilterButton
              {...filterButtonProps}
              key="filterButton"
              isFilterVisible={activePanel === "filters"}
              onClick={() => toggleActivePanel("filters")}
            />,
          ]}
          right={props.buttons}
          alignItems="flex-end"
        />
      }
      filterSettings={
        activePanel === "filters" && (
          <ProphylaxisSessionFilterSettings
            filterFormValues={filterFormValues}
            setFilterFormValue={setFilterFormValue}
            deleteFilterValue={deleteFilterValue}
            clearFilterValues={clearFilterValues}
            filterSettingsSheetProps={filterSettingsSheetProps}
            activeFilters={activeFilters}
          />
        )
      }
      data-testid="prophylaxisTable"
    >
      <TableSheet
        loading={sessions.isFetching}
        footer={
          <Pagination
            totalCount={sessions.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={sessions.data.elements}
          columns={COLUMNS}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          minWidth={500}
          rowNavigation={{
            route: (row) =>
              routes.prophylaxisSessions.byId(row.original.id).details,
            focusColumnAccessorKey: "dateAndTime",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<ProphylaxisSession>();
const COLUMNS = [
  columnHelper.accessor("dateAndTime", {
    header: "Zeitpunkt",
    cell: (props) => formatDateTime(props.getValue()),
    enableSorting: true,
    meta: {
      width: 120,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("institution.name", {
    header: "Einrichtung",
    cell: (props) => props.getValue(),
    enableSorting: false,
    meta: {
      width: 180,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 120,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("type", {
    header: "Typ",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 80,
      canNavigate: { parentRow: true },
    },
  }),
];

const SORT_KEY_MAPPING: Record<string, ApiProphylaxisSessionSortKey> = {
  dateAndTime: ApiProphylaxisSessionSortKey.DateAndTime,
  groupName: ApiProphylaxisSessionSortKey.GroupName,
  type: ApiProphylaxisSessionSortKey.Type,
};
