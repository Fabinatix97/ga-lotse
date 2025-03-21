/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DetailsSection } from "@eshg/lib-employee-portal";
import { formatDate, formatTime } from "@eshg/lib-portal/formatters/dateTime";
import { ApiAppointment } from "@eshg/measles-protection-api";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Button, Sheet, Stack } from "@mui/joy";

import { useDeleteAppointmentForProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/appointmentBookingApi";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

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
    <Sheet sx={{ height: "100%" }}>
      <DetailsSection
        title="Termin"
        buttons={
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
            <Stack gap={1} sx={{ flexBasis: "auto" }}>
              <DetailsCell
                label="Datum"
                value={formatDate(appointment.start)}
              />
              <DetailsCell
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
      </DetailsSection>
    </Sheet>
  );
}
