/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useMemo, useRef, useState } from "react";

import { ApiGetRelevantCalendarsResponse } from "@eshg/base-api";

import { useAddModuleEventSidebar } from "@/lib/baseModule/components/calendar/sidebar/AddModuleCalendarEventSidebar";
import { useEditModuleEventSidebar } from "@/lib/baseModule/components/calendar/sidebar/EditModuleCalendarEventSidebar";

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

  const moduleCalendars = props.calendarsResponse.moduleCalendars;
  const [displayedCalendarIds, setDisplayedCalendarIds] = useState([
    userCalendarId,
  ]);

  const addAbsenceSidebar = useAddAbsenceSidebar();
  const editAbsenceSidebar = useEditAbsenceSidebar();
  const addModuleEventSidebar = useAddModuleEventSidebar();
  const editModuleEventSidebar = useEditModuleEventSidebar();
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

  function openAddModuleCalendarEventSidebar() {
    addModuleEventSidebar.open({
      calendars: moduleCalendars,
      refetchEvents,
    });
  }

  function openEditModuleCalendarEventSidebar(event: EventWithCalendarId) {
    editModuleEventSidebar.open({
      event,
      refetchEvents,
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
    <Calendar
      ref={calendarRef}
      calendars={calendars}
      displayedCalendarIds={displayedCalendarIds}
      onNewAbsenceEventButtonClick={openAddAbsenceSidebar}
      onNewModuleEventButtonClick={
        moduleCalendars.length === 0 ? null : openAddModuleCalendarEventSidebar
      }
      onEventClick={(event) => {
        if (event.type === "VACATION" && event.calendarId === userCalendarId) {
          openEditAbsenceSidebar(event);
        }
        if (event.type === "BUSINESS_CASE") {
          openViewEventSidebar(event);
        }
        if (event.type === "INFORMATION") {
          openEditModuleCalendarEventSidebar(event);
        }
      }}
      onSettingsButtonClick={openSettingsSidebar}
    />
  );
}
