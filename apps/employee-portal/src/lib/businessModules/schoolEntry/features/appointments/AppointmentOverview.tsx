/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import FullCalendar from "@fullcalendar/react";
import { Stack } from "@mui/joy";
import { ReactNode } from "react";

import {
  AppointmentEventClickHandler,
  CalendarHandleRef,
  useAppointmentOverviewSettings,
} from "@/lib/businessModules/schoolEntry/features/appointments/useAppointmentOverview";
import { CalendarHeaderToolbar } from "@/lib/shared/components/calendar/CalendarHeaderToolbar";

export interface AppointmentOverviewProps {
  ref: CalendarHandleRef;
  buttons: ReactNode;
  onEventClick: AppointmentEventClickHandler;
}

export function AppointmentOverview(props: AppointmentOverviewProps) {
  const settings = useAppointmentOverviewSettings({
    onEventClick: props.onEventClick,
    ref: props.ref,
  });

  return (
    <Stack spacing={2} flex={1}>
      <CalendarHeaderToolbar
        {...settings.toolbarProps}
        slotProps={{ select: { "aria-label": "Terminübersicht" } }}
        buttons={props.buttons}
      />
      <Stack
        flex={1}
        padding={2}
        borderRadius="lg"
        border="1px solid"
        borderColor="divider"
        color="text.secondary"
        sx={settings.calendarWrapperSx}
      >
        <FullCalendar {...settings.fullCalendarProps} />
      </Stack>
    </Stack>
  );
}
