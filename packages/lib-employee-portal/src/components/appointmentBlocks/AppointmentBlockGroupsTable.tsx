/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColumnSort, TableOptions } from "@tanstack/react-table";
import { ReactNode } from "react";
import { unique } from "remeda";

import { PaginatedList } from "../../api/models/PaginatedList";
import { DataTable } from "../../features/table/components/DataTable";
import { TablePage } from "../../features/table/components/TablePage";
import { TableSheet } from "../../features/table/components/TableSheet";
import { Pagination } from "../../features/table/components/pagination/Pagination";
import { UseTableControlResult } from "../../features/table/hooks/useTableControl";

import {
  WeekdayCheckboxOption,
  getWeekdayFromDate,
} from "./AppointmentBlockFormWithDays";
import {
  AppointmentBlock,
  AppointmentBlockGroup,
  AppointmentLocation,
} from "./AppointmentBlockGroup";
import { NoAppointmentBlocksAvailable } from "./NoAppointmentBlocksAvailable";
import { ApiAppointmentType } from "./types";

export const INITIAL_SORTING_APPOINTMENT_BLOCK_GROUPS: ColumnSort = {
  id: "start",
  desc: false,
};

interface AppointmentBlockGroupsTableProps {
  controls?: ReactNode;
  tableControl: UseTableControlResult;
  appointmentBlockGroups: PaginatedList<AppointmentBlockGroup>;
  isLoading: boolean;
  columns: TableOptions<AppointmentBlockRow>["columns"];
  newAppointmentBlockRoute: string;
}

export function AppointmentBlockGroupsTable(
  props: AppointmentBlockGroupsTableProps,
) {
  const rows = props.appointmentBlockGroups.elements.map(
    toAggregatedAppointmentBlockRow,
  );

  return (
    <TablePage
      fullHeight
      controls={props.controls}
      data-testid="appointmentBlockGroupsTable"
    >
      <TableSheet
        loading={props.isLoading}
        footer={
          <Pagination
            totalCount={props.appointmentBlockGroups.totalNumberOfElements}
            {...props.tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={rows}
          columns={props.columns}
          getSubRows={getSubRows}
          sorting={props.tableControl.tableSorting}
          noDataComponent={() => (
            <NoAppointmentBlocksAvailable
              href={props.newAppointmentBlockRoute}
            />
          )}
          minWidth={1000}
        />
      </TableSheet>
    </TablePage>
  );
}

export interface AppointmentBlockRow {
  id: string;
  types: ApiAppointmentType[];
  start: Date;
  end: Date;
  freeDuration?: string;
  bookedDuration?: string;
  weekdays: WeekdayCheckboxOption["label"][];
  location?: AppointmentLocation;
  subRows?: AppointmentBlockRow[];
}

export function toAggregatedAppointmentBlockRow(
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  const daysOfWeek = appointmentBlockGroup.appointmentBlocks.map(
    (appointmentBlock) => getWeekdayFromDate(appointmentBlock.start),
  );
  const uniqueDaysOfWeek = unique(daysOfWeek);

  return {
    id: appointmentBlockGroup.id,
    types: appointmentBlockGroup.types,
    start: appointmentBlockGroup.start,
    end: appointmentBlockGroup.end,
    freeDuration: appointmentBlockGroup.freeDuration,
    bookedDuration: appointmentBlockGroup.bookedDuration,
    weekdays: uniqueDaysOfWeek,
    location: appointmentBlockGroup.location,
    subRows: appointmentBlockGroup.appointmentBlocks.map((appointmentBlock) =>
      toAppointmentBlockRow(appointmentBlock, appointmentBlockGroup),
    ),
  };
}

export function toAppointmentBlockRow(
  appointmentBlock: AppointmentBlock,
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  return {
    id: appointmentBlock.id,
    types: appointmentBlockGroup.types,
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    freeDuration: appointmentBlock.freeDuration,
    bookedDuration: appointmentBlock.bookedDuration,
    location: appointmentBlockGroup.location,
    weekdays: [getWeekdayFromDate(appointmentBlock.start)],
  };
}

export function getSubRows(appointmentBlockRow: AppointmentBlockRow) {
  return appointmentBlockRow.subRows;
}
