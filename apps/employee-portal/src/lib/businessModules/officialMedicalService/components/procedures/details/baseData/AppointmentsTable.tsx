/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
  APPOINTMENT_TYPES,
  ActionsItem,
  ActionsMenu,
  DataTable,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { EnumMap, formatDateTime } from "@eshg/lib-portal";
import {
  ApiAppointmentState,
  ApiBookingState,
  ApiEmployeeOmsProcedureDetails,
  ApiOmsAppointment,
} from "@eshg/official-medical-service-api";

import {
  useCloseAppointment,
  useWithdrawAppointment,
} from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentApi";
import { useAppointmentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AppointmentSidebar";
import { useCancelAppointmentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/CancelAppointmentSidebar";
import { isProcedureFinalized } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { CalendarAddDay } from "@/lib/shared/components/icons/CalendarAddDay";

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
  openCancelAppointmentSidebar,
  openCloseAppointmentDialog,
  openWithdrawAppointmentDialog,
}: {
  openBookingSidebar?: (appointment: ApiOmsAppointment) => void;
  openCancelAppointmentSidebar?: (appointment: ApiOmsAppointment) => void;
  openCloseAppointmentDialog?: (appointment: ApiOmsAppointment) => void;
  openWithdrawAppointmentDialog?: (appointment: ApiOmsAppointment) => void;
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
          openCancelAppointmentSidebar
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
            onClick: () => openCancelAppointmentSidebar(ctx.row.original),
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
          openCloseAppointmentDialog
        ) {
          items.push({
            label: "Als abgeschlossen markieren",
            startDecorator: <CheckCircle />,
            onClick: () => openCloseAppointmentDialog(ctx.row.original),
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
  const { open: openCancelSidebar } = useCancelAppointmentSidebar();
  const { openConfirmationDialog } = useConfirmationDialog();
  const { mutateAsync: closeAppointment } = useCloseAppointment();
  const { mutateAsync: withdrawAppointment } = useWithdrawAppointment();

  if (procedure.appointments.length === 0) {
    return;
  }

  function openCloseAppointmentDialog(appointment: ApiOmsAppointment) {
    openConfirmationDialog({
      title: "Termin abschließen?",
      description: "Der Termin kann nicht mehr editiert werden.",
      confirmLabel: "Abschließen",
      onConfirm: () => closeAppointment(appointment),
    });
  }

  function openWithdrawAppointmentDialog(appointment: ApiOmsAppointment) {
    openConfirmationDialog({
      title: "Terminoption zurückziehen?",
      description:
        "Es kan kein Termin über das Online Portal mehr gebucht werden. Der/die Bürger:in wird per E-Mail informiert.",
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
        openCancelAppointmentSidebar: (appointment) =>
          openCancelSidebar({ appointment }),
        openCloseAppointmentDialog,
        openWithdrawAppointmentDialog,
      });

  return <DataTable data={procedure.appointments} columns={columns} />;
}
