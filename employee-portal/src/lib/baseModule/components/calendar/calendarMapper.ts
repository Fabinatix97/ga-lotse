/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseEventRequest,
  ApiBaseEventType,
  ApiDetailedEventWithoutCalendarId,
  ApiEventType,
  ApiShowAs,
} from "@eshg/employee-portal-api/base";
import { DayHeaderContentArg, EventInput } from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import { addDays, startOfDay } from "date-fns";

import {
  mapDateTimeToInput,
  mapEndWholeDayRequest,
  mapStartWholeDayRequest,
} from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";
import { formatDateToFullReadableString } from "@/lib/shared/helpers/dateTime";

import { EventFormValues } from "./EventForm";
import { CalendarViewTypes } from "./calendarViews";

export function mapCalendarEventsBackendToUi(
  events: ApiDetailedEventWithoutCalendarId[],
  calendarId: string,
): EventInput[] {
  return events.map((event) => {
    const eventWithCalendarId: EventWithCalendarId = { ...event, calendarId };
    return {
      id: event.id,
      title: event.metaData.subject ?? mapEventTypeToFallbackTitle(event.type),
      start: event.timeData.start,
      end: mapEndDate(event.timeData.end, event.timeData.wholeDay),
      allDay: event.timeData.wholeDay,
      extendedProps: eventWithCalendarId,
    };
  });

  function mapEndDate(endDate: Date, wholeDay: boolean | undefined) {
    return wholeDay ? startOfDay(addDays(endDate, 1)) : endDate;
  }
}

export function mapEventTypeToFallbackTitle(eventType: ApiEventType) {
  switch (eventType) {
    case "BUSINESS_CASE":
      return "Fachmodultermin";
    case "VACATION":
      return "Abwesend";
    default:
      return "Unbenannter Termin";
  }
}

export function mapEventShowAs(eventShowAs: ApiShowAs) {
  switch (eventShowAs) {
    case "BUSY":
      return "beschäftigt";
    case "FREE":
      return "frei";
  }
}

export function mapFormToRequestValues(
  values: EventFormValues,
  type: ApiBaseEventType,
  calendarId: string,
  showAs?: ApiShowAs,
): ApiBaseEventRequest {
  const wholeDay = values.wholeDay;
  return {
    ...values,
    showAs,
    calendarId,
    timeData: {
      start: mapStartWholeDayRequest(values.start, wholeDay),
      end: mapEndWholeDayRequest(values.end, wholeDay),
      wholeDay,
    },
    type,
  };
}

export function mapEventToFormValues(
  event: ApiDetailedEventWithoutCalendarId,
): EventFormValues {
  return {
    start: mapDateTimeToInput(event.timeData.start, event.timeData.wholeDay),
    end: mapDateTimeToInput(event.timeData.end, event.timeData.wholeDay),
    wholeDay: event.timeData.wholeDay,
  };
}

export type EventWithCalendarId = ApiDetailedEventWithoutCalendarId & {
  calendarId: string;
};

export function extractExtendedProps(event: EventImpl) {
  return event.extendedProps as EventWithCalendarId;
}

export function getDayHeaderContent(info: DayHeaderContentArg) {
  const date =
    info.view.type === CalendarViewTypes.TimeGridDay ||
    info.view.type === CalendarViewTypes.ListMonth
      ? formatDateToFullReadableString(info.date)
      : info.text;
  return date.replaceAll(".", "");
}
