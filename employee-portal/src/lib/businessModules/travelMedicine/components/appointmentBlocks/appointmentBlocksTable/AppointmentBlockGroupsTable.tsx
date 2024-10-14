/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentBlockSortKey,
  ApiAppointmentType,
} from "@eshg/employee-portal-api/travelMedicine/models";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Schedule, TodayOutlined } from "@mui/icons-material";
import { Chip, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";

import {
  AppointmentBlock,
  AppointmentBlockGroup,
} from "@/lib/businessModules/travelMedicine/api/models/AppointmentBlock";
import { useGetAppointmentBlockGroupsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { appointmentTypes } from "@/lib/businessModules/travelMedicine/shared/appointmentTypes";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import {
  getSortDirection,
  getSortKey,
} from "@/lib/shared/components/table/sorting";
import {
  formatCalendarWeek,
  formatCalendarWeekRange,
} from "@/lib/shared/helpers/dateTime";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

const columnHelper = createColumnHelper<AppointmentBlockRow>();

const COLUMNS = [
  columnHelper.accessor("start", {
    id: "calendarWeek",
    header: "Woche",
    cell: (props) =>
      props.row.depth === 0
        ? formatCalendarWeekRange(
            props.row.original.start,
            props.row.original.end,
          )
        : formatCalendarWeek(props.getValue()),
    enableSorting: false,
  }),
  columnHelper.accessor("type", {
    header: "Art",
    cell: (props) =>
      props.row.depth === 0 ? appointmentTypes[props.getValue()] : undefined,
    enableSorting: false,
  }),
  columnHelper.accessor("start", {
    header: "Start",
    cell: (props) => formatDateTime(props.getValue()),
    enableSorting: true,
  }),
  columnHelper.accessor("end", {
    header: "Ende",
    cell: (props) => formatDateTime(props.getValue()),
    enableSorting: true,
  }),

  columnHelper.accessor("numberOfFreeAppointments", {
    header: "Verfügbar",
    cell: (props) => (
      <Chip size="sm" color="primary">
        {props.getValue()}
      </Chip>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("numberOfBookedAppointments", {
    header: "Gebucht",
    cell: (props) => (
      <Chip size="sm" color="success">
        {props.getValue()}
      </Chip>
    ),
    enableSorting: true,
  }),
];

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
  subRows?: AppointmentBlockRow[];
}

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
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
  };
}

function getSubRows(appointmentBlockRow: AppointmentBlockRow) {
  return appointmentBlockRow.subRows;
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

  const [{ data: appointmentBlockGroups }] = useSuspenseQueries({
    queries: [
      useGetAppointmentBlockGroupsQuery({
        pageNumber: tableControl.paginationProps.pageNumber,
        pageSize: tableControl.paginationProps.pageSize,
        sortKey: getSortKey<ApiAppointmentBlockSortKey>(
          tableControl.tableSorting,
        ),
        sortDirection: getSortDirection(tableControl.tableSorting),
      }),
    ],
  });
  const rows = appointmentBlockGroups.elements.map(
    toAggregatedAppointmentBlockRow,
  );

  return (
    <TablePage
      fullHeight
      controls={props.controls}
      data-testid="appointmentBlockGroupsTable"
    >
      <TableSheet
        footer={
          <Pagination
            totalCount={appointmentBlockGroups.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={rows}
          columns={COLUMNS}
          noDataComponent={() => <NoAppointmentBlocksAvailable />}
          getSubRows={getSubRows}
          sorting={tableControl.tableSorting}
        />
      </TableSheet>
    </TablePage>
  );
}

function NoAppointmentBlocksAvailable() {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <TodayOutlined sx={{ height: "40px", width: "40px" }} />
      <Typography sx={{ mt: 2, mb: 3 }}>
        Aktuell keine Terminblöcke vorhanden
      </Typography>
      <InternalLinkButton
        href={routes.appointmentBlockGroups.new}
        size="sm"
        startDecorator={<Schedule />}
      >
        Neuen Terminblock planen
      </InternalLinkButton>
    </Stack>
  );
}
