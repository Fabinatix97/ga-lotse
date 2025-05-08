/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Card, Chip, Stack, Typography } from "@mui/joy";
import { useRef, useState } from "react";

import { ApiDetailedEventWithoutCalendarId } from "@eshg/base-api";
import { InformationSheet } from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";

import { CalendarViewTypes } from "@/lib/baseModule/components/calendar/calendarViews";

import { CalendarHeader } from "./CalendarHeader";
import { UserActivityState } from "./ResourceDetail";
import {
  hasResourceCalendarEventOnDay,
  mapResourceCalendarEventsBackendToUi,
  mapResourceCalendarEventsOnDayToDetailedEvents,
} from "./resourceCalendarMapper";
import { resourceCalendarSxProps } from "./resourceCalendarSxProps";

export interface TimeRangeProps {
  setCurrentCalendarDate: (value: Date) => void;
  timeRangeStart: Date;
  timeRangeEnd: Date;
}

export function ResourceCalendar(props: {
  resourceCalendarEvents: ApiDetailedEventWithoutCalendarId[];
  setUserActivity: (activity: UserActivityState) => void;
  timeRangeProps: TimeRangeProps;
  isTodayAvaliable: boolean;
}) {
  const fullCalendarRef = useRef<FullCalendar>(null);
  const [fullCalendarTitle, setFullCalendarTitle] = useState("");

  function updateCurrentCalendarDate() {
    if (fullCalendarRef.current !== null) {
      props.timeRangeProps.setCurrentCalendarDate(
        fullCalendarRef.current.getApi().getDate(),
      );
    }
  }

  const resourceCalendarEventInputs = mapResourceCalendarEventsBackendToUi(
    props.resourceCalendarEvents,
    props.timeRangeProps.timeRangeStart,
    props.timeRangeProps.timeRangeEnd,
  );

  return (
    <InformationSheet>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        paddingBottom={1.5}
        flexWrap="wrap"
      >
        <Typography component="h2" level="h3">
          Auslastung
        </Typography>
        {props.isTodayAvaliable && (
          <Chip color="success" sx={{ paddingX: 1 }}>
            heute verfügbar
          </Chip>
        )}
      </Stack>
      <Card
        variant="plain"
        size="sm"
        sx={(theme) => resourceCalendarSxProps(theme)}
      >
        <CalendarHeader
          title={fullCalendarTitle}
          goToPrevious={() => {
            fullCalendarRef.current?.getApi().prev();
            updateCurrentCalendarDate();
          }}
          goToNext={() => {
            fullCalendarRef.current?.getApi().next();
            updateCurrentCalendarDate();
          }}
        />
        <FullCalendar
          ref={fullCalendarRef}
          locale={deLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView={CalendarViewTypes.DayGridMonth}
          height="auto"
          headerToolbar={false}
          datesSet={({ view }) => {
            setFullCalendarTitle(view.title);
          }}
          fixedWeekCount={false}
          showNonCurrentDates={false}
          eventClassNames="bubble-event"
          events={resourceCalendarEventInputs}
          dateClick={(info) => {
            if (
              hasResourceCalendarEventOnDay(
                resourceCalendarEventInputs,
                info.date,
              )
            ) {
              props.setUserActivity({
                type: "view-events",
                date: info.date,
                events: mapResourceCalendarEventsOnDayToDetailedEvents(
                  resourceCalendarEventInputs,
                  info.date,
                ),
              });
            } else {
              props.setUserActivity({
                type: "add-service",
                start: info.dateStr,
              });
            }
          }}
        />
      </Card>
      <Alert
        title=""
        message="Durch Klick auf einen Tag können Sie Einträge bearbeiten, verschieben und löschen"
        color="primary"
      />
    </InformationSheet>
  );
}
