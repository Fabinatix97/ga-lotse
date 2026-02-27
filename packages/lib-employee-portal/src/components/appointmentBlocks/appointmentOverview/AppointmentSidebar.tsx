/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
import { InternalLinkButton, QueryKeyFactory } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../../api/AppointmentBlockApi";
import { useGetAppointment } from "../../../api/queries/appointmentBlock";

export function useAppointmentSidebar(): UseSidebarResult<AppointmentSidebarProps> {
  return useSidebar({ component: AppointmentSidebar });
}

interface AppointmentSidebarProps extends DrawerProps {
  appointmentId: number;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  detailsHref: (procedureId: string) => string;
}

function AppointmentSidebar({
  appointmentId,
  appointmentBlockApi,
  appointmentBlockApiQueryKey,
  onClose,
  detailsHref,
}: AppointmentSidebarProps) {
  const { data: appointment } = useGetAppointment(
    appointmentBlockApi,
    appointmentBlockApiQueryKey,
    appointmentId,
  );
  const title = appointment?.information
    ? `Termin - ${appointment.information}`
    : "Termin";
  const formattedAppointmentDate =
    appointment?.start &&
    appointment?.end &&
    new Intl.DateTimeFormat("de-DE", {
      dateStyle: "full",
      timeStyle: "short",
    }).formatRange(appointment?.start, appointment?.end);

  return (
    <>
      <SidebarContent title={title}>
        <Stack gap={2}>
          <Stack gap={1} direction="row">
            <Circle sx={{ color: (theme) => theme.palette.primary.solidBg }} />
            <Typography level="title-md">{formattedAppointmentDate}</Typography>
          </Stack>

          {isDefined(appointment?.appointmentType) && (
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
            isDefined(appointment?.procedureId) && (
              <InternalLinkButton
                variant="soft"
                color="neutral"
                href={detailsHref(appointment.procedureId)}
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
