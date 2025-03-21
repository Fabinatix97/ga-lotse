/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  getSortDirection,
  getSortKey,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiAppointmentBlockSortKey,
  ApiAppointmentLocation,
  ApiAppointmentType,
  ApiLocationSelectionMode,
} from "@eshg/school-entry-api";
import { Chip } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
  ColumnSort,
  TableOptions,
  createColumnHelper,
} from "@tanstack/react-table";
import { ReactNode } from "react";

import {
  useAppointmentBlockApi,
  useConfigApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import {
  AppointmentBlock,
  AppointmentBlockGroup,
} from "@/lib/businessModules/schoolEntry/api/models/AppointmentBlockGroup";
import { getAppointmentBlockGroupsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import { getLocationSelectionModeQuery } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { formatCalendarWeek } from "@/lib/shared/helpers/dateTime";

const columnHelper = createColumnHelper<AppointmentBlockRow>();

const COLUMNS = [
  columnHelper.accessor("start", {
    id: "calendarWeek",
    header: "Woche",
    cell: (props) =>
      props.row.depth === 0 ? formatCalendarWeek(props.getValue()) : undefined,
    enableSorting: false,
    meta: {
      width: 96,
    },
  }),
  columnHelper.accessor("type", {
    header: "Art",
    cell: (props) =>
      props.row.depth === 0 ? APPOINTMENT_TYPES[props.getValue()] : undefined,
    enableSorting: false,
    meta: {
      width: 200,
    },
  }),
  columnHelper.accessor("start", {
    header: "Start",
    cell: (props) => formatDateTime(props.getValue()),
    enableSorting: true,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("end", {
    header: "Ende",
    cell: (props) => formatDateTime(props.getValue()),
    enableSorting: true,
    meta: {
      width: 180,
    },
  }),
  columnHelper.accessor("numberOfFreeAppointments", {
    header: "Verfügbar",
    cell: (props) => (
      <Chip size="sm" color="primary">
        {props.getValue()}
      </Chip>
    ),
    enableSorting: false,
    meta: {
      width: 140,
    },
  }),
  columnHelper.accessor("numberOfBookedAppointments", {
    header: "Gebucht",
    cell: (props) => (
      <Chip size="sm" color="success">
        {props.getValue()}
      </Chip>
    ),
    enableSorting: false,
    meta: {
      width: 140,
    },
  }),
];

const LOCATION_COLUMN = columnHelper.accessor("location.name", {
  header: "Ort",
  cell: (props) => props.getValue(),
  enableSorting: false,
});

function useAppointmentBlockColumns(
  locationSelectionMode: ApiLocationSelectionMode,
): TableOptions<AppointmentBlockRow>["columns"] {
  return [
    ...COLUMNS,
    ...(locationSelectionMode !== ApiLocationSelectionMode.None
      ? [LOCATION_COLUMN]
      : []),
  ];
}

const initialSorting: ColumnSort = {
  id: "start",
  desc: false,
};

interface AppointmentBlockRow {
  type: ApiAppointmentType;
  start: Date;
  end: Date;
  numberOfFreeAppointments: number;
  numberOfBookedAppointments: number;
  location?: ApiAppointmentLocation;
  subRows?: AppointmentBlockRow[];
}

function toAggregatedAppointmentBlockRow(
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  return {
    type: appointmentBlockGroup.type,
    start: appointmentBlockGroup.start,
    end: appointmentBlockGroup.end,
    numberOfFreeAppointments: appointmentBlockGroup.numberOfFreeAppointments,
    numberOfBookedAppointments:
      appointmentBlockGroup.numberOfBookedAppointments,
    location: appointmentBlockGroup.location,
    subRows: appointmentBlockGroup.appointmentBlocks.map((appointmentBlock) =>
      toAppointmentBlockRow(appointmentBlock, appointmentBlockGroup),
    ),
  };
}

function toAppointmentBlockRow(
  appointmentBlock: AppointmentBlock,
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  return {
    type: appointmentBlockGroup.type,
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    numberOfFreeAppointments: appointmentBlock.numberOfFreeAppointments,
    numberOfBookedAppointments: appointmentBlock.numberOfBookedAppointments,
    location: appointmentBlockGroup.location,
  };
}

function getSubRows(appointmentBlockRow: AppointmentBlockRow) {
  return appointmentBlockRow.subRows;
}

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
}

export function AppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const configApi = useConfigApi();
  const appointmentBlockApi = useAppointmentBlockApi();
  const [{ data: locationSelectionMode }, getAppointmentBlockGroups] =
    useSuspenseQueries({
      queries: [
        getLocationSelectionModeQuery(configApi),
        getAppointmentBlockGroupsQuery(appointmentBlockApi, {
          pageNumber: tableControl.paginationProps.pageNumber,
          pageSize: tableControl.paginationProps.pageSize,
          sortKey: getSortKey<ApiAppointmentBlockSortKey>(
            tableControl.tableSorting,
          ),
          sortDirection: getSortDirection(tableControl.tableSorting),
        }),
      ],
    });
  const columns = useAppointmentBlockColumns(locationSelectionMode);

  const rows = getAppointmentBlockGroups.data.elements.map(
    toAggregatedAppointmentBlockRow,
  );

  return (
    <TablePage
      fullHeight
      controls={props.controls}
      data-testid="appointmentBlockGroupsTable"
    >
      <TableSheet
        loading={getAppointmentBlockGroups.isFetching}
        footer={
          <Pagination
            totalCount={getAppointmentBlockGroups.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={rows}
          columns={columns}
          getSubRows={getSubRows}
          sorting={tableControl.tableSorting}
          minWidth={1000}
        />
      </TableSheet>
    </TablePage>
  );
}
