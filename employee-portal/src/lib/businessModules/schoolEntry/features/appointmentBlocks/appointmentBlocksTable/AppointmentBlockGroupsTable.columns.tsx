/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { TableOptions, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu, useConfirmationDialog } from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiAppointmentLocation,
  ApiAppointmentType,
  ApiLocationSelectionMode,
} from "@eshg/school-entry-api";

import {
  AppointmentBlock,
  AppointmentBlockGroup,
} from "@/lib/businessModules/schoolEntry/api/models/AppointmentBlockGroup";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { formatCalendarWeek } from "@/lib/shared/helpers/dateTime";

const columnHelper = createColumnHelper<AppointmentBlockRow>();

export function useAppointmentBlockColumns({
  onDeleteAppointmentBlock,
  locationSelectionMode,
}: {
  onDeleteAppointmentBlock: ({
    appointmentBlockId,
  }: {
    appointmentBlockId: string;
  }) => void;
  locationSelectionMode: ApiLocationSelectionMode;
}): TableOptions<AppointmentBlockRow>["columns"] {
  const { openConfirmationDialog } = useConfirmationDialog();

  return [
    columnHelper.accessor("start", {
      id: "calendarWeek",
      header: "Woche",
      cell: ({ row: { depth }, getValue }) =>
        depth === 0 ? formatCalendarWeek(getValue() as Date) : undefined,
      enableSorting: false,
      meta: {
        width: 96,
      },
    }),
    columnHelper.accessor("type", {
      header: "Art",
      cell: ({ row: { depth }, getValue }) =>
        depth === 0
          ? APPOINTMENT_TYPES[getValue() as ApiAppointmentType]
          : undefined,
      enableSorting: false,
      meta: {
        width: 200,
      },
    }),
    columnHelper.accessor("start", {
      header: "Start",
      cell: ({ getValue }) => formatDateTime(getValue() as Date),
      enableSorting: true,
      meta: {
        width: 180,
      },
    }),
    columnHelper.accessor("end", {
      header: "Ende",
      cell: ({ getValue }) => formatDateTime(getValue() as Date),
      enableSorting: true,
      meta: {
        width: 180,
      },
    }),
    columnHelper.accessor("numberOfFreeAppointments", {
      header: "Verfügbar",
      cell: ({ getValue }) => (
        <Chip size="sm" color="primary">
          {getValue()}
        </Chip>
      ),
      enableSorting: false,
      meta: {
        width: 140,
      },
    }),
    columnHelper.accessor("numberOfBookedAppointments", {
      header: "Gebucht",
      cell: ({ getValue }) => (
        <Chip size="sm" color="success">
          {getValue()}
        </Chip>
      ),
      enableSorting: false,
      meta: {
        width: 140,
      },
    }),
    ...(locationSelectionMode !== ApiLocationSelectionMode.None
      ? [
          columnHelper.accessor("location.name", {
            header: "Ort",
            cell: (props) => props.getValue(),
            enableSorting: false,
          }),
        ]
      : []),
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

interface AppointmentBlockRow {
  id: string;
  type: ApiAppointmentType;
  start: Date;
  end: Date;
  numberOfFreeAppointments: number;
  numberOfBookedAppointments: number;
  location?: ApiAppointmentLocation;
  subRows?: AppointmentBlockRow[];
}

export function toAggregatedAppointmentBlockRow(
  appointmentBlockGroup: AppointmentBlockGroup,
): AppointmentBlockRow {
  return {
    id: appointmentBlockGroup.id,
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
    id: appointmentBlock.id,
    type: appointmentBlockGroup.type,
    start: appointmentBlock.start,
    end: appointmentBlock.end,
    numberOfFreeAppointments: appointmentBlock.numberOfFreeAppointments,
    numberOfBookedAppointments: appointmentBlock.numberOfBookedAppointments,
    location: appointmentBlockGroup.location,
  };
}

export function getSubRows(appointmentBlockRow: AppointmentBlockRow) {
  return appointmentBlockRow.subRows;
}
