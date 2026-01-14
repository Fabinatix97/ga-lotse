/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Delete, Edit } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import {
  CellContext,
  ColumnDef,
  ColumnHelper,
  Row,
  TableOptions,
} from "@tanstack/react-table";
import { isDefined } from "remeda";

import {
  QueryKeyFactory,
  durationToSecond,
  formatDateTime,
} from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../api/AppointmentBlockApi";
import { User } from "../../api/models/User";
import { useDeleteAppointmentBlock } from "../../api/mutations/appointmentBlock";
import { useConfirmationDialog } from "../../hooks/useConfirmationDialog";
import {
  formatCalendarWeek,
  formatCalendarWeekRange,
  formatDurationToHoursAndMinutes,
} from "../../utils/dateTime";
import { ActionsItem, ActionsMenu } from "../buttons/ActionsMenu";

import { AppointmentBlockRow } from "./AppointmentBlockGroupsTable";
import { useUpdateAppointmentBlockSidebar } from "./UpdateAppointmentBlockSidebar";
import { APPOINTMENT_TYPES } from "./translations";
import { ApiAppointmentType, AppointmentStandardDurations } from "./types";

function toggleRowExpanded({
  getIsExpanded,
  toggleExpanded,
}: Row<AppointmentBlockRow>) {
  toggleExpanded(!getIsExpanded());
}

export function useAppointmentBlockGroupsColumns({
  appointmentBlockApi,
  appointmentBlockApiQueryKey,
  withTeam = true,
  physicians,
  mfas,
  consultants,
  sopasss,
  standardDurations,
  columnHelper,
  additionalColumn,
  showWeekDays,
}: {
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  withTeam?: boolean;
  physicians?: User[];
  mfas?: User[];
  consultants?: User[];
  sopasss?: User[];
  standardDurations: AppointmentStandardDurations;
  columnHelper: ColumnHelper<AppointmentBlockRow>;
  additionalColumn?: ColumnDef<AppointmentBlockRow, string>;
  showWeekDays?: boolean;
}): TableOptions<AppointmentBlockRow>["columns"] {
  const { openConfirmationDialog } = useConfirmationDialog();
  const updateAppointmentBlockSidebar = useUpdateAppointmentBlockSidebar();
  const deleteAppointmentBlock = useDeleteAppointmentBlock(appointmentBlockApi);

  return [
    columnHelper.accessor("start", {
      id: "calendarWeek",
      header: "Woche",
      cell: ({ getValue, row }: CellContext<AppointmentBlockRow, Date>) => (
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
        width: 120,
      },
    }),
    columnHelper.accessor("types", {
      header: "Art",
      cell: ({
        getValue,
        row,
      }: CellContext<AppointmentBlockRow, ApiAppointmentType[]>) =>
        row.depth === 0 ? (
          <div onClick={() => toggleRowExpanded(row)}>
            {getValue()
              .map((type) => APPOINTMENT_TYPES[type])
              .join(", ")}
          </div>
        ) : undefined,
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 200,
      },
    }),
    columnHelper.accessor("start", {
      header: "Start",
      cell: ({ getValue, row }: CellContext<AppointmentBlockRow, Date>) => (
        <div onClick={() => toggleRowExpanded(row)}>
          {formatDateTime(getValue())}
        </div>
      ),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 180,
      },
    }),
    columnHelper.accessor("end", {
      header: "Ende",
      cell: ({ getValue, row }: CellContext<AppointmentBlockRow, Date>) => (
        <div onClick={() => toggleRowExpanded(row)}>
          {formatDateTime(getValue())}
        </div>
      ),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 180,
      },
    }),
    ...(showWeekDays
      ? [
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
              width: 180,
            },
          }),
        ]
      : []),
    columnHelper.accessor("freeDuration", {
      header: "Verfügbar",
      cell: ({ getValue, row }: CellContext<AppointmentBlockRow, string>) => {
        const duration = getValue();
        return (
          <Chip
            size="sm"
            color="primary"
            onClick={() => toggleRowExpanded(row)}
          >
            {formatDurationToHoursAndMinutes(duration ?? "")}
          </Chip>
        );
      },
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 170,
      },
    }),
    columnHelper.accessor("bookedDuration", {
      header: "Gebucht",
      cell: ({ getValue, row }: CellContext<AppointmentBlockRow, string>) => {
        const duration = getValue();
        return (
          <Chip
            size="sm"
            color="success"
            onClick={() => toggleRowExpanded(row)}
          >
            {formatDurationToHoursAndMinutes(duration ?? "")}
          </Chip>
        );
      },
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: 170,
      },
    }),
    ...(isDefined(additionalColumn) ? [additionalColumn] : []),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      cell: ({ row: { depth, original } }) => {
        return (
          depth !== 0 && (
            <ActionsMenu
              actionItems={[
                {
                  label: "Terminblock bearbeiten",
                  startDecorator: <Edit />,
                  onClick: () => {
                    updateAppointmentBlockSidebar.open({
                      appointmentBlockId: original.id,
                      appointmentBlockApi,
                      appointmentBlockApiQueryKey,
                      appointmentTypes: original.types,
                      withTeam,
                      physicians,
                      mfas,
                      consultants,
                      sopasss,
                      standardDurations,
                    });
                  },
                },
                ...(durationToSecond(original.bookedDuration ?? "") === 0
                  ? [
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
                              void deleteAppointmentBlock.mutateAsync({
                                appointmentBlockId: original.id,
                              }),
                          });
                        },
                      } as ActionsItem,
                    ]
                  : []),
              ]}
            />
          )
        );
      },
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}
