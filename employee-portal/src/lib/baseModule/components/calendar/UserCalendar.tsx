/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetRelevantCalendarsResponse } from "@eshg/employee-portal-api/base";
import { useMemo, useRef, useState } from "react";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

import { Calendar, CalendarHandle } from "./Calendar";
import { mapApiCalendarsToCalendarInfo } from "./calendarDisplay";
import { EventWithCalendarId } from "./calendarMapper";
import { AddAbsenceSidebar } from "./sidebar/AddAbsenceSidebar";
import { EditAbsenceSidebar } from "./sidebar/EditAbsenceSidebar";
import { SettingsSidebar } from "./sidebar/SettingsSidebar";
import { ViewEventSidebar } from "./sidebar/ViewEventSidebar";

type UserActivityState =
  | { type: "view-calendar" }
  | { type: "add-event" }
  | { type: "edit-event"; event: EventWithCalendarId }
  | { type: "view-event"; event: EventWithCalendarId }
  | { type: "settings" };

const initialUserActivity: UserActivityState = { type: "view-calendar" };

export function UserCalendar(props: {
  calendarsResponse: ApiGetRelevantCalendarsResponse;
}) {
  const [userActivity, setUserActivity] =
    useState<UserActivityState>(initialUserActivity);

  const { userCalendarId, calendars } = useMemo(
    () => mapApiCalendarsToCalendarInfo(props.calendarsResponse),
    [props.calendarsResponse],
  );

  const [displayedCalendarIds, setDisplayedCalendarIds] = useState([
    userCalendarId,
  ]);

  const calendarRef = useRef<CalendarHandle>(null);

  function refetchEvents() {
    calendarRef.current?.refetchEvents();
  }

  function closeSidebar() {
    setUserActivity(initialUserActivity);
  }

  return (
    <>
      <Calendar
        ref={calendarRef}
        onNewEventButtonClick={() => setUserActivity({ type: "add-event" })}
        calendars={calendars}
        displayedCalendarIds={displayedCalendarIds}
        onEventClick={(event) => {
          if (
            event.type === "VACATION" &&
            event.calendarId === userCalendarId
          ) {
            setUserActivity({
              type: "edit-event",
              event: event,
            });
          }
          if (event.type === "BUSINESS_CASE") {
            setUserActivity({
              type: "view-event",
              event: event,
            });
          }
        }}
        onSettingsButtonClick={() => setUserActivity({ type: "settings" })}
      />
      <OverlayBoundary>
        <AddAbsenceSidebar
          open={userActivity.type === "add-event"}
          closeSidebar={closeSidebar}
          userCalendarId={userCalendarId}
          refetchEvents={refetchEvents}
        />
      </OverlayBoundary>
      <OverlayBoundary>
        <EditAbsenceSidebar
          open={userActivity.type === "edit-event"}
          closeSidebar={closeSidebar}
          event={
            userActivity.type === "edit-event" ? userActivity.event : undefined
          }
          refetchEvents={refetchEvents}
        />
      </OverlayBoundary>
      <ViewEventSidebar
        open={userActivity.type === "view-event"}
        closeSidebar={closeSidebar}
        event={
          userActivity.type === "view-event" ? userActivity.event : undefined
        }
        calendars={calendars}
      />
      <SettingsSidebar
        open={userActivity.type === "settings"}
        closeSidebar={closeSidebar}
        calendars={calendars}
        displayedCalendarIds={displayedCalendarIds}
        setDisplayedCalendarIds={setDisplayedCalendarIds}
      />
    </>
  );
}
