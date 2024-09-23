/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseEventRequest,
  ApiDetailedEventWithoutCalendarId,
  ApiEventType,
  ApiShowAs,
} from "@eshg/employee-portal-api/base";
import { EventInput } from "@fullcalendar/core/index.js";
import { eachDayOfInterval, isAfter, isSameDay, max, min } from "date-fns";

import { theme } from "@/lib/baseModule/theme/theme";
import {
  mapDateTimeToInput,
  mapEndWholeDayRequest,
  mapStartWholeDayRequest,
} from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";
import {
  formatDateRange,
  formatDateTimeRange,
} from "@/lib/shared/helpers/dateTime";

import { AddServiceFormValues } from "./sidebar/AddServiceSidebar";

const colors = {
  inUse: theme.palette.danger[400],
  service: theme.palette.warning[400],
};

export type ResourceEvent = Pick<
  EventInput,
  "display" | "backgroundColor" | "allDay"
> & {
  start: Date;
  extendedProps: ApiDetailedEventWithoutCalendarId;
};

export function mapResourceCalendarEventColor(eventType: ApiEventType) {
  switch (eventType) {
    case "BUSINESS_CASE":
      return colors.inUse;
    case "SERVICE":
      return colors.service;
    default:
      return undefined;
  }
}

export function mapEventTypeToFallbackTitle(eventType: ApiEventType) {
  switch (eventType) {
    case "BUSINESS_CASE":
      return "Gebucht";
    case "SERVICE":
      return "Service";
    default:
      return "Unbenannter Termin";
  }
}

export function mapResourceCalendarEventsBackendToUi(
  events: ApiDetailedEventWithoutCalendarId[],
  startOfSelectedMonth: Date,
  endOfSelectedMonth: Date,
): ResourceEvent[] {
  return events.flatMap((event) => {
    const start = max([startOfSelectedMonth, event.timeData.start]);
    const end = min([endOfSelectedMonth, event.timeData.end]);
    return isAfter(start, end)
      ? []
      : eachDayOfInterval({
          start,
          end,
        }).map((day) => ({
          start: day,
          display: "background",
          backgroundColor: mapResourceCalendarEventColor(event.type),
          allDay: true,
          extendedProps: event,
        }));
  });
}

export function hasResourceCalendarEventOnDay(
  calendarEvents: ResourceEvent[],
  date: Date,
) {
  return (
    mapResourceCalendarEventsOnDayToDetailedEvents(calendarEvents, date)
      .length > 0
  );
}

export function mapResourceCalendarEventsOnDayToDetailedEvents(
  calendarEvents: ResourceEvent[],
  date: Date,
) {
  return calendarEvents
    .filter((event) => isSameDay(event.start, date))
    .map((event) => event.extendedProps);
}

export function mapFormToRequestValues(
  values: AddServiceFormValues,
  calendarId: string,
): ApiBaseEventRequest {
  const wholeDay = values.wholeDay;
  return {
    showAs: ApiShowAs.Busy,
    calendarId,
    subject: values.reason,
    timeData: {
      start: mapStartWholeDayRequest(values.start, wholeDay),
      end: mapEndWholeDayRequest(values.end, wholeDay),
      wholeDay,
    },
    type: ApiEventType.Service,
  };
}

export function mapEventToFormValues(
  event: ApiDetailedEventWithoutCalendarId,
): AddServiceFormValues {
  return {
    reason: event.metaData.subject ?? "",
    start: mapDateTimeToInput(event.timeData.start, event.timeData.wholeDay),
    end: mapDateTimeToInput(event.timeData.end, event.timeData.wholeDay),
    wholeDay: event.timeData.wholeDay,
  };
}

export function mapResourceEventDateInfo(
  event: ApiDetailedEventWithoutCalendarId,
) {
  const isOneDayEvent = isSameDay(event.timeData.start, event.timeData.end);
  if (isOneDayEvent && event.timeData.wholeDay) {
    return ["ganztägig"];
  } else if (isOneDayEvent && !event.timeData.wholeDay) {
    return [
      formatDateTimeRange(event.timeData.start, event.timeData.end, true),
    ];
  } else if (!isOneDayEvent && event.timeData.wholeDay) {
    return [
      formatDateRange(event.timeData.start, event.timeData.end),
      "ganztägig",
    ];
  } else {
    return [formatDateTimeRange(event.timeData.start, event.timeData.end)];
  }
}
