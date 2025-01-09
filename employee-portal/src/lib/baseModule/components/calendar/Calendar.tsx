/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CalendarEventApi } from "@eshg/employee-portal-api/base";
import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";
import {
  EventSourceFuncArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Circle } from "@mui/icons-material";
import { Stack, Tooltip, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { format } from "date-fns";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { isDefined, isNonNullish } from "remeda";

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

    function eventContent(eventInfo: {
      timeText: string;
      backgroundColor: string;
      event: {
        title: string;
        extendedProps: EventWithCalendarId;
      };
    }) {
      if (fullCalendarView.type === CalendarViewTypes.DayGridMonth) {
        return (
          <Stack direction="row" gap={1} overflow="hidden" alignItems="center">
            <Circle sx={{ color: eventInfo.backgroundColor, fontSize: 12 }} />
            <Typography
              level="body-xs"
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {eventInfo.timeText} {eventInfo.event.title}
            </Typography>
          </Stack>
        );
      } else if (fullCalendarView.type === CalendarViewTypes.ListMonth) {
        return (
          <Typography
            level="body-md"
            color="neutral"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {eventInfo.event.title}
          </Typography>
        );
      } else {
        function content(color?: "white") {
          const sx = {
            color,
            overflow: "hidden",
            textOverflow: "ellipsis",
          } satisfies SxProps;

          return (
            <Stack>
              <Typography level="title-sm" sx={sx}>
                {eventInfo.event.title}
              </Typography>
              {isDefined(eventInfo.event.extendedProps.metaData.location) && (
                <Typography level="body-sm" sx={sx}>
                  {eventInfo.event.extendedProps.metaData.location}
                </Typography>
              )}
              {isDefined(eventInfo.event.extendedProps.metaData.subject) && (
                <Typography level="body-sm" sx={sx}>
                  Eintrag von {eventInfo.event.extendedProps.metaData.subject}
                </Typography>
              )}
              <Typography level="body-sm" sx={sx}>
                {eventInfo.timeText}
              </Typography>
            </Stack>
          );
        }

        return (
          <Tooltip title={content("white")} arrow placement="bottom">
            {content()}
          </Tooltip>
        );
      }
    }

    const [eventsLoading, setEventsLoading] = useState<boolean>(false);

    function noEventsContent() {
      if (eventsLoading) {
        return <LoadingIndicator />;
      }
      return <>Keine Ereignisse anzuzeigen</>;
    }

    return (
      <Stack spacing={2} flex={1}>
        <HeaderToolbar
          title={fullCalendarView.title}
          viewType={fullCalendarView.type}
          onViewTypeChange={(view) => {
            queueMicrotask(() => {
              fullCalendarRef.current?.getApi().changeView(view);
            });
          }}
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
            scrollTime={format(new Date(), "HH:00:00")}
            height={"100%"}
            datesSet={({ view }) => {
              setFullCalendarView({
                title: view.title,
                type: view.type as CalendarViewType,
              });
            }}
            eventContent={eventContent}
            loading={setEventsLoading}
            noEventsContent={noEventsContent}
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
