/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Delete } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu, useConfirmationDialog } from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/travel-medicine-api";

import {
  AppointmentBlock,
  AppointmentBlockGroup,
} from "@/lib/businessModules/travelMedicine/api/models/AppointmentBlock";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";
import {
  durationToSecond,
  formatCalendarWeek,
  formatCalendarWeekRange,
  formatDurationToHoursAndMinutes,
} from "@/lib/shared/helpers/dateTime";

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
      cell: (props) =>
        props.row.depth === 0
          ? formatCalendarWeekRange(
              props.row.original.start,
              props.row.original.end,
            )
          : formatCalendarWeek(props.getValue()),
      enableSorting: false,
    }),
    columnHelper.accessor("types", {
      header: "Art",
      cell: (props) =>
        props.row.depth === 0
          ? props
              .getValue()
              .map((type) => APPOINTMENT_TYPES[type])
              .join(", ")
          : undefined,
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

    columnHelper.accessor("freeDuration", {
      header: "Verfügbar",
      cell: (props) => {
        const duration = props.getValue();
        return (
          <Chip size="md" color="primary">
            {formatDurationToHoursAndMinutes(duration ?? "")}
          </Chip>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor("bookedDuration", {
      header: "Gebucht",
      cell: (props) => {
        const duration = props.getValue();
        return (
          <Chip size="md" color="success">
            {formatDurationToHoursAndMinutes(duration ?? "")}
          </Chip>
        );
      },
      enableSorting: true,
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      cell: ({
        row: {
          depth,
          original: { id: appointmentBlockId, bookedDuration },
        },
      }) =>
        depth !== 0 &&
        durationToSecond(bookedDuration ?? "") === 0 && (
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

interface AppointmentBlockRow {
  id: string;
  types: ApiAppointmentType[];
  start: Date;
  end: Date;
  readonly freeDuration?: string;
  readonly bookedDuration?: string;
  subRows?: AppointmentBlockRow[];
}

export function toAggregatedAppointmentBlockRow(
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  return {
    id: appointmentBlockGroup.id,
    types: appointmentBlockGroup.types,
    start: appointmentBlockGroup.start,
    end: appointmentBlockGroup.end,
    freeDuration: appointmentBlockGroup.freeDuration,
    bookedDuration: appointmentBlockGroup.bookedDuration,
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
    id: appointmentBlock.id,
    types: appointmentBlockGroup.types,
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    freeDuration: appointmentBlock.freeDuration,
    bookedDuration: appointmentBlock.bookedDuration,
  };
}

export function getSubRows(appointmentBlockRow: AppointmentBlockRow) {
  return appointmentBlockRow.subRows;
}
