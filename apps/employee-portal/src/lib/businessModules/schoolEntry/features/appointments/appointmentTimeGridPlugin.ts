/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarApi } from "@fullcalendar/core/index.js";
import timeGridPlugin from "@fullcalendar/timegrid";
import { clone } from "remeda";

import { AppointmentViewTypes } from "@/lib/businessModules/schoolEntry/features/appointments/appointmentViews";

interface TimeGridView {
  type: string;
  duration: {
    days?: number;
    weeks?: number;
  };
}

// Customize timeGridPlugin to support displaying up to 10 parallel appointment blocks.
// Each appointment block is rendered in separate column in the day view.
// This is achieved by offsetting the block's start and end date to a virtual date.
const MAX_NUMBER_OF_PARALLEL_APPOINTMENT_BLOCKS = 10;
const appointmentTimeGridPlugin = clone(timeGridPlugin);
const timeGridDayView = appointmentTimeGridPlugin.views
  .timeGridDay as unknown as TimeGridView;
timeGridDayView.duration = { days: MAX_NUMBER_OF_PARALLEL_APPOINTMENT_BLOCKS };

function goToPrevious(api: CalendarApi | undefined): void {
  if (!api) return;

  if (api.view.type === AppointmentViewTypes.TimeGridDay) {
    api.incrementDate({ days: -1 });
  } else {
    api.prev();
  }
}

function goToNext(api: CalendarApi | undefined): void {
  if (!api) return;

  if (api.view.type === AppointmentViewTypes.TimeGridDay) {
    api.incrementDate({ days: 1 });
  } else {
    api.next();
  }
}

export { appointmentTimeGridPlugin, goToNext, goToPrevious };
