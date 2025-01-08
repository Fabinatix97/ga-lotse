/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetRelevantCalendarsResponse } from "@eshg/employee-portal-api/base";
import { useMemo, useRef, useState } from "react";

import { Calendar, CalendarHandle } from "./Calendar";
import { mapApiCalendarsToCalendarInfo } from "./calendarDisplay";
import { EventWithCalendarId } from "./calendarMapper";
import { useAddAbsenceSidebar } from "./sidebar/AddAbsenceSidebar";
import { useEditAbsenceSidebar } from "./sidebar/EditAbsenceSidebar";
import { SettingsSidebar } from "./sidebar/SettingsSidebar";
import { useViewEventSidebar } from "./sidebar/ViewEventSidebar";

export function UserCalendar(props: {
  calendarsResponse: ApiGetRelevantCalendarsResponse;
}) {
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);

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
        onSettingsButtonClick={() => setSettingsSidebarOpen(true)}
      />
      <SettingsSidebar
        open={settingsSidebarOpen}
        closeSidebar={() => setSettingsSidebarOpen(false)}
        calendars={calendars}
        displayedCalendarIds={displayedCalendarIds}
        setDisplayedCalendarIds={setDisplayedCalendarIds}
      />
    </>
  );
}
