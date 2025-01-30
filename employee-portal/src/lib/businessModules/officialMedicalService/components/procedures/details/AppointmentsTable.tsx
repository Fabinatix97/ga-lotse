/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentState,
  ApiBookingState,
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAppointment,
} from "@eshg/employee-portal-api/officialMedicalService";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import {
  CheckCircle,
  Delete,
  EditCalendarOutlined,
  EventBusyOutlined,
} from "@mui/icons-material";
import { Chip, Typography } from "@mui/joy";
import { DefaultColorPalette } from "@mui/joy/styles/types";
import { createColumnHelper } from "@tanstack/react-table";

import {
  useCancelAppointment,
  useCloseAppointment,
  useWithdrawAppointment,
} from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentApi";
import { APPOINTMENT_TYPES } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/constants";
import { useAppointmentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AppointmentSidebar";
import { isProcedureFinalized } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { CalendarAddDay } from "@/lib/shared/components/icons/CalendarAddDay";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

const columnHelper = createColumnHelper<ApiOmsAppointment>();

const BOOKING_STATE_LABELS: EnumMap<ApiBookingState> = {
  [ApiBookingState.Bookable]: "Noch nicht gebucht",
  [ApiBookingState.Booked]: "Gebucht",
  [ApiBookingState.Cancelled]: "Abgesagt",
  [ApiBookingState.Withdrawn]: "Zurückgezogen",
} as const;

const BOOKING_STATE_COLORS: EnumMap<ApiBookingState, DefaultColorPalette> = {
  [ApiBookingState.Bookable]: "neutral",
  [ApiBookingState.Booked]: "primary",
  [ApiBookingState.Cancelled]: "danger",
  [ApiBookingState.Withdrawn]: "danger",
} as const;

const APPOINTMENT_STATE_LABELS: EnumMap<ApiAppointmentState> = {
  [ApiAppointmentState.Open]: "Offen",
  [ApiAppointmentState.Closed]: "Abgeschlossen",
} as const;

const APPOINTMENT_STATE_COLORS: EnumMap<
  ApiAppointmentState,
  DefaultColorPalette
> = {
  [ApiAppointmentState.Open]: "neutral",
  [ApiAppointmentState.Closed]: "success",
} as const;

function createAppointmentColumns({
  openBookingSidebar,
  openCancelAppointmentDialog,
  openCloseAppointmentDialog,
  openWithdrawAppointmentDialog,
  closeAppointment,
}: {
  openBookingSidebar?: (appointment: ApiOmsAppointment) => void;
  openCancelAppointmentDialog?: (appointment: ApiOmsAppointment) => void;
  openCloseAppointmentDialog?: (appointment: ApiOmsAppointment) => void;
  openWithdrawAppointmentDialog?: (appointment: ApiOmsAppointment) => void;
  closeAppointment?: (appointment: ApiOmsAppointment) => Promise<void>;
}) {
  return [
    columnHelper.accessor("appointmentType", {
      header: "Terminart",
      cell: (ctx) => APPOINTMENT_TYPES[ctx.getValue()],
    }),
    columnHelper.accessor("start", {
      header: "Termin",
      cell: (ctx) => {
        const start = ctx.getValue();
        if (!start) return;

        return (
          <Typography component="time" dateTime={start.toISOString()}>
            {formatDateTime(start)}
          </Typography>
        );
      },
    }),
    columnHelper.accessor("duration", {
      header: "Dauer",
      cell: (ctx) => {
        const duration = ctx.getValue();
        if (!duration) return;

        return `${duration} Minuten`;
      },
    }),
    columnHelper.accessor("bookingState", {
      header: "Buchungsstatus",
      cell: (ctx) => (
        <Chip color={BOOKING_STATE_COLORS[ctx.getValue()]}>
          {BOOKING_STATE_LABELS[ctx.getValue()]}
        </Chip>
      ),
    }),
    columnHelper.accessor("appointmentState", {
      header: "Terminstatus",
      cell: (ctx) => (
        <Chip color={APPOINTMENT_STATE_COLORS[ctx.getValue()]}>
          {APPOINTMENT_STATE_LABELS[ctx.getValue()]}
        </Chip>
      ),
    }),
    columnHelper.display({
      header: "Aktion",
      id: "action",
      cell: (ctx) => {
        const { bookingState, appointmentState } = ctx.row.original;
        const items: ActionsItem[] = [];

        if (
          (bookingState === ApiBookingState.Bookable ||
            bookingState === ApiBookingState.Cancelled) &&
          appointmentState === ApiAppointmentState.Open &&
          openBookingSidebar
        ) {
          items.push({
            label: "Terminbuchung vornehmen",
            startDecorator: <CalendarAddDay />,
            onClick: () => openBookingSidebar(ctx.row.original),
          });
        }

        if (
          bookingState === ApiBookingState.Bookable &&
          openWithdrawAppointmentDialog
        ) {
          items.push({
            label: "Terminoption zurückziehen",
            startDecorator: <Delete />,
            color: "danger",
            onClick: () => openWithdrawAppointmentDialog(ctx.row.original),
          });
        }

        if (
          bookingState === ApiBookingState.Booked &&
          appointmentState === ApiAppointmentState.Open &&
          openBookingSidebar &&
          openCancelAppointmentDialog
        ) {
          items.push({
            label: "Terminbuchung bearbeiten",
            startDecorator: <EditCalendarOutlined />,
            onClick: () => openBookingSidebar(ctx.row.original),
          });

          items.push({
            label: "Terminbuchung absagen",
            startDecorator: <EventBusyOutlined />,
            color: "danger",
            onClick: () => openCancelAppointmentDialog(ctx.row.original),
          });
        }

        if (
          bookingState === ApiBookingState.Booked &&
          appointmentState === ApiAppointmentState.Open &&
          openCloseAppointmentDialog
        ) {
          items.push({
            label: "Als abgeschlossen markieren",
            startDecorator: <CheckCircle />,
            onClick: () => openCloseAppointmentDialog(ctx.row.original),
          });
        }

        if (
          bookingState === ApiBookingState.Cancelled &&
          appointmentState === ApiAppointmentState.Open &&
          closeAppointment
        ) {
          items.push({
            label: "Als abgeschlossen markieren",
            startDecorator: <CheckCircle />,
            onClick: () => closeAppointment(ctx.row.original),
          });
        }

        if (items.length === 0) {
          return null;
        }

        return <ActionsMenu actionItems={items} />;
      },
      meta: {
        cellStyle: "button",
        width: "7rem",
        textAlign: "right",
      },
    }),
  ];
}

export function AppointmentsTable({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const { open: openBookingSidebar } = useAppointmentSidebar(
    procedure.physician,
  );
  const { openConfirmationDialog } = useConfirmationDialog();
  const { mutateAsync: cancelAppointment } = useCancelAppointment();
  const { mutateAsync: closeAppointment } = useCloseAppointment();
  const { mutateAsync: withdrawAppointment } = useWithdrawAppointment();

  if (procedure.appointments.length === 0) {
    return;
  }

  function openCancelAppointmentDialog(appointment: ApiOmsAppointment) {
    openConfirmationDialog({
      title: "Termin absagen?",
      description:
        "Der/die Bürger:in wird per E-Mail informiert. Ein neuer Termin kann gebucht werden.",
      color: "danger",
      confirmLabel: "Absagen",
      onConfirm: () => cancelAppointment(appointment),
    });
  }

  function openCloseAppointmentDialog(appointment: ApiOmsAppointment) {
    openConfirmationDialog({
      title: "Termin abschließen?",
      description:
        "Der/die Bürger:in wird per E-Mail informiert. Ein neuer Termin kann gebucht werden.",
      confirmLabel: "Abschließen",
      onConfirm: () => closeAppointment(appointment),
    });
  }

  function openWithdrawAppointmentDialog(appointment: ApiOmsAppointment) {
    openConfirmationDialog({
      title: "Terminoption zurückziehen?",
      description:
        "Der/die Bürger:in wird per E-Mail informiert. Eine neue Terminoption kann erstellt werden.",
      color: "danger",
      confirmLabel: "Zurückziehen",
      onConfirm: () => withdrawAppointment(appointment),
    });
  }

  const columns = isProcedureFinalized(procedure)
    ? createAppointmentColumns({})
    : createAppointmentColumns({
        openBookingSidebar: (appointment) =>
          openBookingSidebar({ appointment }),
        openCancelAppointmentDialog: (appointment) =>
          openCancelAppointmentDialog(appointment),
        openCloseAppointmentDialog,
        openWithdrawAppointmentDialog,
        closeAppointment,
      });

  return <DataTable data={procedure.appointments} columns={columns} />;
}
