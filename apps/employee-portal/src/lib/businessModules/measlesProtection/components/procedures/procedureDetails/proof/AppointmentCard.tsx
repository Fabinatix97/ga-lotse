/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";

import {
  ActionsItem,
  ActionsMenu,
  DetailsItem,
  useConfirmationDialog,
  useSearchParam,
} from "@eshg/lib-employee-portal";
import { DetailsList, formatDate, formatTime } from "@eshg/lib-portal";
import { ApiAppointment } from "@eshg/measles-protection-api";

import { useDeleteAppointmentForProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBookingApi";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface AppointmentCardProps {
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
    <InfoTile
      title="Termin"
      name="appointment"
      sx={{ height: "100%" }}
      controls={
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
      <DetailsList>
        <Stack spacing={3} alignItems="start" width="100%">
          {appointment ? (
            <Stack gap={1} sx={{ flexBasis: "auto" }}>
              <DetailsItem
                label="Datum"
                value={formatDate(appointment.start)}
              />
              <DetailsItem
                label="Zeitraum"
                value={
                  "Von " +
                  formatTime(appointment.start) +
                  " Uhr bis " +
                  formatTime(appointment.end) +
                  " Uhr"
                }
              />
            </Stack>
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
      </DetailsList>
    </InfoTile>
  );
}
