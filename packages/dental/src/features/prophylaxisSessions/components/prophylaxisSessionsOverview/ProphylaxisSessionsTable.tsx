/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { ApiProphylaxisSessionSortKey } from "@eshg/dental-api";
import {
  ButtonBar,
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  formatBoolean,
  getSortDirection,
  getSortKey,
  useFilterDictionary,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { useToggleableState } from "@eshg/lib-portal/hooks/useToggleableState";

import { ProphylaxisSessionStatusChip } from "../../../../components/prophylaxisSession/ProphylaxisSessionStatusChip";
import { routes } from "../../../../config/routes";
import { ProphylaxisSession } from "../../api/models/ProphylaxisSession";
import { useGetProphylaxisSessions } from "../../api/queries/overview";
import { formatFluoridationVarnishDescription } from "../../utils/formatters";

import {
  ProphylaxisSessionFilterSettings,
  ProphylaxisSessionFilters,
} from "./ProphylaxisSessionFilterSettings";
import { CreateProphylaxisSessionButton } from "./tableButtons";

const INITIAL_SORTING: ColumnSort = {
  id: "id",
  desc: true,
};

export function ProphylaxisSessionsTable() {
  const [activePanel, toggleActivePanel] = useToggleableState<"filters">();

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: INITIAL_SORTING,
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
    sortKey: getSortKey(tableControl.tableSorting, SORT_KEY_MAPPING),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={[
            <ToggleFilterButton
              {...filterButtonProps}
              key="filterButton"
              isFilterVisible={activePanel === "filters"}
              onClick={() => toggleActivePanel("filters")}
            />,
          ]}
          right={<CreateProphylaxisSessionButton />}
          alignItems="flex-end"
          invertDomOrder
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
          minWidth={1200}
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
    cell: (props) => `${formatDateTime(props.getValue())} Uhr`,
    enableSorting: true,
    meta: {
      width: 180,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("institution", {
    header: "Einrichtung",
    cell: (props) => (
      <Typography sx={{ fontWeight: "bold" }}>
        {props.getValue().name}
      </Typography>
    ),
    enableSorting: false,
    meta: {
      width: 250,
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("groupName", {
    header: "Gruppe",
    cell: (props) => props.getValue(),
    enableSorting: true,
    meta: {
      width: 160,
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
  columnHelper.accessor("isScreening", {
    header: "Reihenuntersuchung",
    cell: (props) => formatBoolean(props.getValue()),
    enableSorting: true,
    meta: {
      width: 180,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("fluoridationVarnish", {
    header: "Fluoridierung",
    cell: (props) => formatFluoridationVarnishDescription(props.getValue()),
    enableSorting: true,
    meta: {
      width: 120,
      canNavigate: { parentRow: true },
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (props) => <ProphylaxisSessionStatusChip status={props.getValue()} />,
    enableSorting: true,
    meta: {
      canNavigate: { parentRow: true },
    },
  }),
];

const SORT_KEY_MAPPING: Record<string, ApiProphylaxisSessionSortKey> = {
  dateAndTime: ApiProphylaxisSessionSortKey.DateAndTime,
  groupName: ApiProphylaxisSessionSortKey.GroupName,
  type: ApiProphylaxisSessionSortKey.Type,
  isScreening: ApiProphylaxisSessionSortKey.IsScreening,
  fluoridationVarnish: ApiProphylaxisSessionSortKey.FluoridationVarnish,
  status: ApiProphylaxisSessionSortKey.Status,
};
