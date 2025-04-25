/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useMemo, useRef, useState } from "react";

import { ApiGetRelevantCalendarsResponse } from "@eshg/base-api";

import { Calendar, CalendarHandle } from "./Calendar";
import { mapApiCalendarsToCalendarInfo } from "./calendarDisplay";
import { EventWithCalendarId } from "./calendarMapper";
import { useAddAbsenceSidebar } from "./sidebar/AddAbsenceSidebar";
import { useEditAbsenceSidebar } from "./sidebar/EditAbsenceSidebar";
import { useSettingsSidebar } from "./sidebar/SettingsSidebar";
import { useViewEventSidebar } from "./sidebar/ViewEventSidebar";

export function UserCalendar(props: {
  calendarsResponse: ApiGetRelevantCalendarsResponse;
}) {
  const { userCalendarId, calendars } = useMemo(
    () => mapApiCalendarsToCalendarInfo(props.calendarsResponse),
    [props.calendarsResponse],
  );

  const [displayedCalendarIds, setDisplayedCalendarIds] = useState([
    userCalendarId,
  ]);

  const addAbsenceSidebar = useAddAbsenceSidebar();
  const editAbsenceSidebar = useEditAbsenceSidebar();
  const viewEventSidebar = useViewEventSidebar();
  const settingsSidebar = useSettingsSidebar();

  const calendarRef = useRef<CalendarHandle>(null);

  function refetchEvents() {
    calendarRef.current?.refetchEvents();
  }

  function openAddAbsenceSidebar() {
    addAbsenceSidebar.open({
      userCalendarId,
      refetchEvents,
    });
  }

  function openEditAbsenceSidebar(event: EventWithCalendarId) {
    editAbsenceSidebar.open({
      refetchEvents,
      event,
    });
  }

  function openViewEventSidebar(event: EventWithCalendarId) {
    viewEventSidebar.open({
      calendars,
      event,
    });
  }

  function openSettingsSidebar() {
    settingsSidebar.open({
      calendars,
      initialDisplayedCalenderIds: displayedCalendarIds,
      onDisplayedCalendarIdsChanged: setDisplayedCalendarIds,
    });
  }

  return (
    <>
      <Calendar
        ref={calendarRef}
        onNewEventButtonClick={openAddAbsenceSidebar}
        calendars={calendars}
        displayedCalendarIds={displayedCalendarIds}
        onEventClick={(event) => {
          if (
            event.type === "VACATION" &&
            event.calendarId === userCalendarId
          ) {
            openEditAbsenceSidebar(event);
          }
          if (event.type === "BUSINESS_CASE") {
            openViewEventSidebar(event);
          }
        }}
        onSettingsButtonClick={openSettingsSidebar}
      />
    </>
  );
}
