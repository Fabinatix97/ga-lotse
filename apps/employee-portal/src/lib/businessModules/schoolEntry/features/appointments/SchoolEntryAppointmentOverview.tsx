/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Settings } from "@mui/icons-material";
import { useRef } from "react";
import { isDefined } from "remeda";

import { InternalLinkButton } from "@eshg/lib-portal";

import { AppointmentOverview } from "@/lib/businessModules/schoolEntry/features/appointments/AppointmentOverview";
import { AppointmentViewTypes } from "@/lib/businessModules/schoolEntry/features/appointments/appointmentViews";
import { useAppointmentBlockSidebar } from "@/lib/businessModules/schoolEntry/features/appointments/sidebars/AppointmentBlockSidebar";
import { useAppointmentSidebar } from "@/lib/businessModules/schoolEntry/features/appointments/sidebars/AppointmentSidebar";
import {
  AppointmentEventClickHandler,
  CalendarHandle,
} from "@/lib/businessModules/schoolEntry/features/appointments/useAppointmentOverview";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export function SchoolEntryAppointmentOverview() {
  const calendarHandleRef = useRef<CalendarHandle>(null);
  function refetchEvents() {
    calendarHandleRef.current?.refetchEvents();
  }

  const appointmentSidebar = useAppointmentSidebar();
  const appointmentBlockSidebar = useAppointmentBlockSidebar();

  const handleEventClick = function (eventData, viewType) {
    if (eventData.type === "slot") {
      const { appointmentId, appointmentBlockId } = eventData;
      if (eventData.booked && isDefined(appointmentId)) {
        appointmentSidebar.open({ appointmentId });
      } else if (!eventData.booked && isDefined(appointmentBlockId)) {
        appointmentBlockSidebar.open({ appointmentBlockId, refetchEvents });
      }
    } else if (eventData.type === "block") {
      appointmentBlockSidebar.open({
        appointmentBlockId: eventData.appointmentBlockId,
        isLimitedView: viewType === AppointmentViewTypes.TimeGridWeek,
        refetchEvents,
      });
    }
  } satisfies AppointmentEventClickHandler;

  return (
    <AppointmentOverview
      ref={calendarHandleRef}
      buttons={
        <>
          <InternalLinkButton
            href={routes.appointments.appointmentBlockGroups.new}
          >
            Terminblock hinzufügen
          </InternalLinkButton>
          <InternalLinkButton
            color="primary"
            variant="outlined"
            href={routes.appointments.appointmentBlockGroups.overview}
            endDecorator={<Settings />}
          >
            Terminblöcke bearbeiten
          </InternalLinkButton>
        </>
      }
      onEventClick={handleEventClick}
    />
  );
}
