/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Delete } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { Row, createColumnHelper } from "@tanstack/react-table";
import { unique } from "remeda";

import { ActionsMenu, useConfirmationDialog } from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/measles-protection-api";

import {
  AppointmentBlockGroup,
  AppointmentBlockMeasles,
} from "@/lib/businessModules/measlesProtection/api/models/AppointmentBlockGroup";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/measlesProtection/shared/constants";
import {
  type WeekdayCheckboxOption,
  getWeekdayFromDate,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import {
  formatCalendarWeek,
  formatCalendarWeekRange,
} from "@/lib/shared/helpers/dateTime";

interface AppointmentBlockRow {
  id: string;
  type: ApiAppointmentType;
  start: Date;
  end: Date;
  weekdays: WeekdayCheckboxOption["label"][];
  numberOfFreeAppointments: number;
  numberOfBookedAppointments: number;
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
    id: appointmentBlock.id,
    type: appointmentBlockGroup.type,
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    weekdays: [getWeekdayFromDate(appointmentBlock.start)],
    numberOfFreeAppointments: appointmentBlock.numberOfFreeAppointments,
    numberOfBookedAppointments: appointmentBlock.numberOfBookedAppointments,
  };
}

export function getSubRows(appointmentBlockRow: AppointmentBlockRow) {
  return appointmentBlockRow.subRows;
}

function toggleRowExpanded({
  getIsExpanded,
  toggleExpanded,
}: Row<AppointmentBlockRow>) {
  toggleExpanded(!getIsExpanded());
}

const columnHelper = createColumnHelper<AppointmentBlockRow>();

export function useAppointmentBlockGroupsColumns({
  onDeleteAppointmentBlock,
}: {
  onDeleteAppointmentBlock: ({
    appointmentBlockId,
  }: {
    appointmentBlockId: string;
  }) => void;
}) {
  const { openConfirmationDialog } = useConfirmationDialog();

  return [
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
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      cell: ({
        row: {
          depth,
          original: { id: appointmentBlockId, numberOfBookedAppointments },
        },
      }) =>
        depth !== 0 &&
        !numberOfBookedAppointments && (
          <ActionsMenu
            actionItems={[
              {
                label: "Terminblock löschen",
                color: "danger",
                startDecorator: <Delete color="danger" />,
                onClick: () => {
                  openConfirmationDialog({
                    title: "Terminblock löschen?",
                    description:
                      "Möchten Sie den Terminblock wirklich löschen? Es sind keine bereits gebuchten Termine betroffen.",
                    confirmLabel: "Terminblock löschen",
                    color: "danger",
                    onConfirm: () =>
                      onDeleteAppointmentBlock({
                        appointmentBlockId,
                      }),
                  });
                },
              },
            ]}
          />
        ),
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}
