/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import { Stack } from "@mui/joy";
import { ReactNode, useRef } from "react";
import { isDefined } from "remeda";

import { QueryKeyFactory } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../../api/AppointmentBlockApi";
import { User } from "../../../api/models/User";
import { CalendarHeaderToolbar } from "../../calendar/CalendarHeaderToolbar";
import { ApiAppointmentType, AppointmentStandardDurations } from "../types";

import { useAppointmentBlockSidebar } from "./AppointmentBlockSidebar";
import { useAppointmentSidebar } from "./AppointmentSidebar";
import { AppointmentViewType, AppointmentViewTypes } from "./appointmentViews";
import { AppointmentEvent } from "./helpers";
import {
  CalendarHandle,
  useAppointmentOverviewSettings,
} from "./useAppointmentOverviewSettings";

export interface AppointmentOverviewProps {
  buttons: ReactNode;
  standardDurations: AppointmentStandardDurations;
  withTeam: boolean;
  physicians?: User[];
  mfas?: User[];
  consultants?: User[];
  sopasss?: User[];
  creator?: User;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  appointmentTypes?: ApiAppointmentType[];
  detailsHref: (procedureId: string) => string;
}

export function AppointmentOverview({
  appointmentBlockApi,
  appointmentTypes,
  appointmentBlockApiQueryKey,
  buttons,
  standardDurations,
  withTeam,
  physicians,
  mfas,
  consultants,
  sopasss,
  detailsHref,
}: AppointmentOverviewProps) {
  const calendarHandleRef = useRef<CalendarHandle>(null);
  function refetchEvents() {
    calendarHandleRef.current?.refetchEvents();
  }

  const appointmentBlockSidebar = useAppointmentBlockSidebar();
  const appointmentSidebar = useAppointmentSidebar();

  function handleEventClick(arg: EventClickArg) {
    const eventData = arg.event
      .extendedProps as AppointmentEvent["extendedProps"];
    const viewType = arg.view.type as AppointmentViewType;

    if (eventData.type === "slot") {
      const { appointmentId, appointmentBlockId } = eventData;
      if (eventData.booked && isDefined(appointmentId)) {
        appointmentSidebar.open({
          appointmentId,
          appointmentBlockApi,
          appointmentBlockApiQueryKey,
          detailsHref,
        });
      } else if (!eventData.booked && isDefined(appointmentBlockId)) {
        appointmentBlockSidebar.open({
          appointmentBlockId,
          refetchEvents,
          appointmentBlockApiQueryKey,
          appointmentBlockApi,
          consultants,
          sopasss,
          physicians,
          mfas,
          standardDurations,
          withTeam,
          appointmentTypes,
        });
      }
    } else if (eventData.type === "block") {
      appointmentBlockSidebar.open({
        appointmentBlockId: eventData.appointmentBlockId,
        isLimitedView: viewType === AppointmentViewTypes.TimeGridWeek,
        refetchEvents,
        appointmentBlockApiQueryKey,
        appointmentBlockApi,
        consultants,
        sopasss,
        physicians,
        mfas,
        standardDurations,
        withTeam,
        appointmentTypes,
      });
    }
  }
  const settings = useAppointmentOverviewSettings({
    onEventClick: handleEventClick,
    ref: calendarHandleRef,
    appointmentBlockApi,
    appointmentBlockApiQueryKey,
  });

  return (
    <Stack spacing={2} flex={1}>
      <CalendarHeaderToolbar
        {...settings.toolbarProps}
        slotProps={{ select: { "aria-label": "Terminübersicht" } }}
        buttons={buttons}
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
