/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/employee-portal-api/measlesProtection";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";

import { useDeleteAppointmentForProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBookingApi";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";
import {
  LabeledValue,
  ValueList,
} from "@/lib/shared/components/detailsCard/LabeledValue";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

export interface AppointmentCardProps {
  appointment?: ApiAppointment;
  procedureClosed: boolean;
  procedureId: string;
}

export function AppointmentCard({
  appointment,
  procedureId,
  procedureClosed,
}: Readonly<AppointmentCardProps>) {
  const [_editingAppointment, setEditingAppointment] = useSearchParam(
    "edit-appointment",
    "boolean",
  );
  const [_addingAppointment, setAddingAppointment] = useSearchParam(
    "add-appointment",
    "boolean",
  );
  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteAppointment = useDeleteAppointmentForProcedure();

  const appointmentCardActions: ActionsItem[] = [
    {
      label: "Bearbeiten",
      onClick: () => {
        setEditingAppointment(true);
      },
      startDecorator: <EditOutlined />,
    },
    {
      label: "Termin stornieren",
      color: "danger",
      onClick: () => {
        openConfirmationDialog({
          title: "Termin stornieren?",
          description: "Diese Aktion kann nicht rückgängig gemacht werden.",
          confirmLabel: "Termin stornieren",
          onConfirm: () => deleteAppointment.mutate(procedureId),
          color: "danger",
        });
      },
      startDecorator: <DeleteOutline />,
    },
  ];
  return (
    <DetailsCard
      title="Termin"
      fullHeight={true}
      actionButton={
        appointment && (
          <ActionsMenu
            actionItems={appointmentCardActions}
            aria-label="Aktionen"
            sx={{
              border: (theme) =>
                `1px solid ${theme.palette.primary.outlinedBorder}`,
            }}
          />
        )
      }
    >
      <Stack spacing={3} alignItems={"start"} width={"100%"}>
        {appointment ? (
          <ValueList style={{ flexBasis: "auto" }}>
            <LabeledValue label="Datum" value={formatDate(appointment.start)} />
            <LabeledValue
              label="Zeitraum"
              value={
                "Von " +
                formatTime(appointment.start) +
                " Uhr bis " +
                formatTime(appointment.end) +
                " Uhr"
              }
            />
          </ValueList>
        ) : !procedureClosed ? (
          <Button
            variant="plain"
            startDecorator={<Add />}
            onClick={() => setAddingAppointment(true)}
          >
            Hinzufügen
          </Button>
        ) : null}
      </Stack>
    </DetailsCard>
  );
}
