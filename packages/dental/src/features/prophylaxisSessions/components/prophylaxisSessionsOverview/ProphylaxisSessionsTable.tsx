/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { ApiProphylaxisSessionSortKey } from "@eshg/dental-api";
import {
  ActionsItem,
  ActionsMenu,
  ButtonBar,
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  formatBoolean,
  getSortDirection,
  getSortKey,
  usePersistentFilterDictionary,
  usePersistentTableControl,
} from "@eshg/lib-employee-portal";
import { formatDateTime, useToggleableState } from "@eshg/lib-portal";

import { ProphylaxisSessionStatusChip } from "../../../../components/prophylaxisSession/ProphylaxisSessionStatusChip";
import { routes } from "../../../../config/routes";
import { ProphylaxisSession } from "../../api/models/ProphylaxisSession";
import { useDeleteProphylaxisSession } from "../../api/mutations/overview";
import { useGetProphylaxisSessions } from "../../api/queries/overview";
import { formatFluoridationVarnishDescription } from "../../utils/formatters";

import {
  ProphylaxisSessionFilterSettings,
  ProphylaxisSessionFilters,
} from "./ProphylaxisSessionFilterSettings";
import { CreateProphylaxisSessionButton } from "./tableButtons";

const INITIAL_SORTING: ColumnSort = {
  id: "dateAndTime",
  desc: true,
};

export function ProphylaxisSessionsTable() {
  const [activePanel, toggleActivePanel] = useToggleableState<"filters">();

  const tableControl = usePersistentTableControl(
    "ZAD_PROPHYLAXIS_SESSIONS_TABLE_CONTROL",
    {
      serverSideSorting: true,
      sortFieldName: "sortKey",
      sortDirectionName: "sortDirection",
      initialSorting: INITIAL_SORTING,
      defaultPageSize: "50",
    },
  );

  const {
    filterValues,
    filterFormValues,
    setFilterFormValue,
    deleteFilterValue,
    clearFilterValues,
    filterButtonProps,
    filterSettingsSheetProps,
    activeFilters,
  } = usePersistentFilterDictionary<
    keyof ProphylaxisSessionFilters,
    ProphylaxisSessionFilters
  >({
    key: "ZAD_PROPHYLAXIS_SESSIONS_TABLE_FILTER",
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

  const deleteProphylaxisSession = useDeleteProphylaxisSession();

  async function handleDelete(prophylaxisSessionId: string, version: number) {
    await deleteProphylaxisSession.mutateAsync({
      prophylaxisSessionId,
      apiDeleteProphylaxisSessionRequest: { version },
    });
  }

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
          columns={columnDefs(handleDelete)}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          minWidth={1210}
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

function columnDefs(
  handleDelete: (
    prophylaxisSessionId: string,
    version: number,
  ) => Promise<void>,
) {
  const columnHelper = createColumnHelper<ProphylaxisSession>();
  return [
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
        width: 195,
        canNavigate: { parentRow: true },
      },
    }),
    columnHelper.accessor("fluoridationVarnish", {
      header: "Fluoridierung",
      cell: (props) => formatFluoridationVarnishDescription(props.getValue()),
      enableSorting: true,
      meta: {
        width: 145,
        canNavigate: { parentRow: true },
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => (
        <ProphylaxisSessionStatusChip status={props.getValue()} />
      ),
      enableSorting: true,
      meta: {
        canNavigate: { parentRow: true },
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "navigationControl",
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            ...(props.row.original.isDeletable
              ? [
                  {
                    label: "Löschen",
                    color: "danger",
                    startDecorator: <DeleteOutlined />,
                    onClick: () =>
                      handleDelete(
                        props.row.original.id,
                        props.row.original.version,
                      ),
                  } as ActionsItem,
                ]
              : []),
          ]}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}

const SORT_KEY_MAPPING: Record<string, ApiProphylaxisSessionSortKey> = {
  dateAndTime: ApiProphylaxisSessionSortKey.DateAndTime,
  groupName: ApiProphylaxisSessionSortKey.GroupName,
  type: ApiProphylaxisSessionSortKey.Type,
  isScreening: ApiProphylaxisSessionSortKey.IsScreening,
  fluoridationVarnish: ApiProphylaxisSessionSortKey.FluoridationVarnish,
  status: ApiProphylaxisSessionSortKey.Status,
};
