/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addDays, addMinutes, format } from "date-fns";

import { AppointmentEvent } from "@/lib/businessModules/schoolEntry/features/appointments/useAppointmentEventSources";

// Offset to expand background events beyond the original event scope
// to display the appointment block caption
export const BACKGROUND_EVENT_MINUTES_OFFSET = 25;

export function shiftEventToVirtualTimeSlot(
  event: AppointmentEvent,
  offsetDays: number,
): AppointmentEvent {
  const virtualStartDate = addMinutes(
    addDays(event.start, offsetDays),
    event.display === "background" ? -BACKGROUND_EVENT_MINUTES_OFFSET : 0,
  );
  const virtualEndDate = addDays(event.end, offsetDays);

  return {
    ...event,
    start: virtualStartDate,
    end: virtualEndDate,
  };
}

export interface TimeSlot {
  start: Date;
  end: Date;
}
export function formatTimeSlotRange({ start, end }: TimeSlot) {
  return `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
}
