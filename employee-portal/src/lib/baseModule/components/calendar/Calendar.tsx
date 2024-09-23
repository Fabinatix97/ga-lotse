/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CalendarEventApi } from "@eshg/employee-portal-api/base";
import {
  EventSourceFuncArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Stack } from "@mui/joy";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { isNonNullish } from "remeda";

import { useCalendarEventApi } from "@/lib/baseModule/api/clients";
import { theme } from "@/lib/baseModule/theme/theme";

import { HeaderToolbar } from "./HeaderToolbar";
import { CalendarInfo } from "./calendarDisplay";
import {
  EventWithCalendarId,
  extractExtendedProps,
  getDayHeaderContent,
  mapCalendarEventsBackendToUi,
} from "./calendarMapper";
import { calendarSxProps } from "./calendarSxProps";
import { CalendarViewType, CalendarViewTypes } from "./calendarViews";

function createEventSource(
  calendarId: string,
  color: string,
  calendarEventApi: CalendarEventApi,
): EventSourceInput {
  return {
    async events(info: EventSourceFuncArg) {
      const { events } = await calendarEventApi
        .getEventsOfCalendarRaw({
          calendarId,
          timeRangeStart: info.start,
          timeRangeEnd: info.end,
        })
        .then((response) => response.value());
      return mapCalendarEventsBackendToUi(events, calendarId);
    },
    color,
  };
}

interface FullCalendarViewState {
  title: string;
  type: CalendarViewType;
}

export interface CalendarProps {
  calendars: CalendarInfo[];
  displayedCalendarIds: string[];
  onNewEventButtonClick: () => void;
  onEventClick: (event: EventWithCalendarId) => void;
  onSettingsButtonClick: () => void;
}

export interface CalendarHandle {
  refetchEvents: () => void;
}

export const Calendar = forwardRef<CalendarHandle, CalendarProps>(
  function Calendar(props: CalendarProps, ref) {
    const fullCalendarRef = useRef<FullCalendar>(null);
    useImperativeHandle(
      ref,
      () => ({
        refetchEvents() {
          fullCalendarRef.current?.getApi().refetchEvents();
        },
      }),
      [],
    );
    const calendarEventApi = useCalendarEventApi();
    const calendarEventApiRef = useRef(calendarEventApi);

    const eventSources = useMemo(() => {
      const displayedCalendars = props.calendars.filter((calendar) =>
        props.displayedCalendarIds.includes(calendar.id),
      );
      return displayedCalendars.map((calendar) =>
        createEventSource(
          calendar.id,
          calendar.color,
          calendarEventApiRef.current,
        ),
      );
    }, [props.calendars, props.displayedCalendarIds, calendarEventApiRef]);

    // FullCalendar is an uncontrolled component and should manage most of its state internally.
    // Though, we want to pass the title and viewType to the HeaderToolbar, so we need to synchronize FullCalendar's state with our own.
    const [fullCalendarView, setFullCalendarView] =
      useState<FullCalendarViewState>({
        title: "",
        type: CalendarViewTypes.TimeGridWeek,
      });

    const element = document.getElementsByClassName("fc-timegrid-slots")[0];
    if (isNonNullish(element)) {
      element.setAttribute("tabindex", "0");
    }

    return (
      <Stack spacing={2} flex={1}>
        <HeaderToolbar
          title={fullCalendarView.title}
          viewType={fullCalendarView.type}
          onViewTypeChange={(view) =>
            fullCalendarRef.current?.getApi().changeView(view)
          }
          goToToday={() => fullCalendarRef.current?.getApi().today()}
          goToPrevious={() => fullCalendarRef.current?.getApi().prev()}
          goToNext={() => fullCalendarRef.current?.getApi().next()}
          onNewEventButtonClick={props.onNewEventButtonClick}
          onSettingsButtonClick={props.onSettingsButtonClick}
        />
        <Stack
          padding={2}
          borderRadius={"lg"}
          border={"1px solid"}
          borderColor={"divider"}
          color={"text.secondary"}
          flex={1}
          sx={(theme) => calendarSxProps(theme, fullCalendarView.type)}
        >
          <FullCalendar
            eventTextColor={theme.palette.text.primary}
            ref={fullCalendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
            height={"100%"}
            datesSet={({ view }) => {
              setFullCalendarView({
                title: view.title,
                type: view.type as CalendarViewType,
              });
            }}
            initialView={fullCalendarView.type}
            eventClick={(info) => {
              const event = extractExtendedProps(info.event);
              props.onEventClick(event);
            }}
            eventSources={eventSources}
            headerToolbar={false}
            locale={deLocale}
            nowIndicator={true}
            weekNumbers={
              fullCalendarView.type === CalendarViewTypes.TimeGridWeek
            }
            slotDuration={"01:00"}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
            }}
            views={{
              week: {
                titleFormat: { year: "numeric", month: "long", day: "numeric" },
                dayHeaderFormat: {
                  weekday: "short",
                  day: "numeric",
                  omitCommas: true,
                },
              },
              day: {
                titleFormat: { year: "numeric", month: "long", day: "numeric" },
              },
              month: {
                titleFormat: { year: "numeric", month: "long" },
              },
            }}
            allDayText={
              fullCalendarView.type === CalendarViewTypes.ListMonth
                ? "Ganztägig"
                : "Tag"
            }
            dayHeaderContent={(info) => getDayHeaderContent(info)}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
            }}
            defaultRangeSeparator={" bis "}
          />
        </Stack>
      </Stack>
    );
  },
);
