/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Circle } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import {
  APPOINTMENT_TYPES,
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton } from "@eshg/lib-portal";

import { useGetAppointment } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export function useAppointmentSidebar(): UseSidebarResult<AppointmentSidebarProps> {
  return useSidebar({ component: AppointmentSidebar });
}

interface AppointmentSidebarProps extends DrawerProps {
  appointmentId: number;
}

function AppointmentSidebar({
  appointmentId,
  onClose,
}: AppointmentSidebarProps) {
  const appointment = useGetAppointment(appointmentId);
  const title = appointment.information
    ? `Termin - ${appointment.information}`
    : "Termin";
  const formattedAppointmentDate = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "short",
  }).formatRange(appointment.start, appointment.end);

  return (
    <>
      <SidebarContent title={title}>
        <Stack gap={2}>
          <Stack gap={1} direction="row">
            <Circle sx={{ color: (theme) => theme.palette.primary.solidBg }} />
            <Typography level="title-md">{formattedAppointmentDate}</Typography>
          </Stack>

          {isDefined(appointment.appointmentType) && (
            <>
              <Divider />
              <Typography level="title-md">Terminart:</Typography>
              <Stack gap={1}>
                <Typography level="body-md">
                  {APPOINTMENT_TYPES[appointment.appointmentType]}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          left={
            <Button variant="plain" onClick={() => onClose()}>
              Abbrechen
            </Button>
          }
          right={
            isDefined(appointment.procedureId) && (
              <InternalLinkButton
                variant="soft"
                color="neutral"
                href={routes.procedures.byId(appointment.procedureId).details}
              >
                Zum Vorgang
              </InternalLinkButton>
            )
          }
        />
      </SidebarActions>
    </>
  );
}
