/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventInput } from "@fullcalendar/core";
import { addDays, addMinutes, format } from "date-fns";

export interface AppointmentEvent
  extends Omit<EventInput, "extendedProps" | "start" | "end">, TimeSlot {
  extendedProps:
    | {
        type: "slot";
        appointmentBlockOrder: number;
        booked: boolean;
        appointmentBlockId?: string;
        appointmentId?: number;
        procedureId?: string;
      }
    | {
        type: "block";
        appointmentBlockId: string;
      };
}

type GenericViewType =
  | "dayGridMonth"
  | "listMonth"
  | "timeGridWeek"
  | "timeGridDay";

export function renderToolbarNavigationLabel(
  navItem: "prev" | "next",
  viewType: GenericViewType,
): string {
  const isPrevLabel = navItem === "prev";
  switch (viewType) {
    case "dayGridMonth":
    case "listMonth":
      return isPrevLabel ? "Vorheriger Monat" : "Nächster Monat";
    case "timeGridWeek":
      return isPrevLabel ? "Vorherige Woche" : "Nächste Woche";
    case "timeGridDay":
      return isPrevLabel ? "Vorheriger Tag" : "Nächster Tag";
  }
}

export interface TimeSlot {
  start: Date;
  end: Date;
}

export function formatTimeSlotRange({ start, end }: TimeSlot) {
  return `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`;
}

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
