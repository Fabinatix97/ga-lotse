/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentBlockSortKey,
  ApiAppointmentType,
} from "@eshg/employee-portal-api/measlesProtection";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Schedule, TodayOutlined } from "@mui/icons-material";
import { Chip, Stack, Typography } from "@mui/joy";
import { ColumnSort, Row, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";
import { unique } from "remeda";

import {
  AppointmentBlockGroup,
  AppointmentBlockMeasles,
} from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { useGetAppointmentBlockGroups } from "@/lib/businessModules/measlesProtection/api/queries/appointmentBlockApi";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/measlesProtection/shared/constants";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import {
  type WeekdayCheckboxOption,
  getWeekdayFromDate,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
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

function toggleRowExpanded({
  getIsExpanded,
  toggleExpanded,
}: Row<AppointmentBlockRow>) {
  toggleExpanded(!getIsExpanded());
}

const columnHelper = createColumnHelper<AppointmentBlockRow>();

const COLUMNS = [
  columnHelper.accessor("start", {
    id: "calendarWeek",
    header: "Woche",
    cell: ({ getValue, row }) => (
      <div onClick={() => toggleRowExpanded(row)}>
        {row.depth === 0
          ? formatCalendarWeekRange(row.original.start, row.original.end)
          : formatCalendarWeek(getValue())}
      </div>
    ),
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: "120px",
    },
  }),
  columnHelper.accessor("type", {
    header: "Art",
    cell: ({ getValue, row }) =>
      row.depth === 0 ? (
        <div onClick={() => toggleRowExpanded(row)}>
          {APPOINTMENT_TYPES[getValue()]}
        </div>
      ) : undefined,
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: "200px",
    },
  }),
  columnHelper.accessor("start", {
    header: "Start",
    cell: ({ getValue, row }) => (
      <div onClick={() => toggleRowExpanded(row)}>
        {formatDateTime(getValue())}
      </div>
    ),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: "180px",
    },
  }),
  columnHelper.accessor("end", {
    header: "Ende",
    cell: ({ getValue, row }) => (
      <div onClick={() => toggleRowExpanded(row)}>
        {formatDateTime(getValue())}
      </div>
    ),
    enableSorting: true,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: "180px",
    },
  }),
  columnHelper.accessor("weekdays", {
    header: "Wochentag",
    cell: ({ getValue, row }) => (
      <div onClick={() => toggleRowExpanded(row)}>
        {getValue().map((weekday) => (
          <Chip
            key={weekday}
            size="sm"
            color="primary"
            sx={{ "&:not(:last-child)": { mr: "3px" } }}
          >
            {weekday}
          </Chip>
        ))}
      </div>
    ),
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: "180px",
    },
  }),
  columnHelper.accessor("numberOfFreeAppointments", {
    header: "Verfügbar",
    cell: ({ getValue, row }) => (
      <Chip size="sm" color="primary" onClick={() => toggleRowExpanded(row)}>
        {getValue()}
      </Chip>
    ),
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: "140px",
    },
  }),
  columnHelper.accessor("numberOfBookedAppointments", {
    header: "Gebucht",
    cell: ({ getValue, row }) => (
      <Chip size="sm" color="success" onClick={() => toggleRowExpanded(row)}>
        {getValue()}
      </Chip>
    ),
    enableSorting: false,
    meta: {
      canNavigate: {
        parentRow: true,
      },
      width: "140px",
    },
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
  weekdays: WeekdayCheckboxOption["label"][];
  numberOfFreeAppointments: number;
  numberOfBookedAppointments: number;
  subRows?: AppointmentBlockRow[];
}

function toAggregatedAppointmentBlockRow(
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  const daysOfWeek = appointmentBlockGroup.appointmentBlocks.map(
    (appointmentBlock) => getWeekdayFromDate(appointmentBlock.start),
  );
  const uniqueDaysOfWeek = unique(daysOfWeek);

  return {
    type: appointmentBlockGroup.type,
    start: appointmentBlockGroup.start,
    end: appointmentBlockGroup.end,
    weekdays: uniqueDaysOfWeek,
    numberOfFreeAppointments: appointmentBlockGroup.numberOfFreeAppointments,
    numberOfBookedAppointments:
      appointmentBlockGroup.numberOfBookedAppointments,
    subRows: appointmentBlockGroup.appointmentBlocks.map((appointmentBlock) =>
      toAppointmentBlockRow(appointmentBlock, appointmentBlockGroup),
    ),
  };
}

function toAppointmentBlockRow(
  appointmentBlock: AppointmentBlockMeasles,
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  return {
    type: appointmentBlockGroup.type,
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    weekdays: [getWeekdayFromDate(appointmentBlock.start)],
    numberOfFreeAppointments: appointmentBlock.numberOfFreeAppointments,
    numberOfBookedAppointments: appointmentBlock.numberOfBookedAppointments,
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
  const appointmentBlockGroups = useGetAppointmentBlockGroups({
    pageNumber: tableControl.paginationProps.pageNumber,
    pageSize: tableControl.paginationProps.pageSize,
    sortKey: getSortKey<ApiAppointmentBlockSortKey>(tableControl.tableSorting),
    sortDirection: getSortDirection(tableControl.tableSorting),
  });

  const rows = appointmentBlockGroups.data.elements.map(
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
            totalCount={appointmentBlockGroups.data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={rows}
          columns={COLUMNS}
          getSubRows={getSubRows}
          sorting={tableControl.tableSorting}
          noDataComponent={() => <NoAppointmentBlocksAvailable />}
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
