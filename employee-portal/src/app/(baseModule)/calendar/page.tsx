/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { useGetRelevantCalendarsForCurrentUser } from "@/lib/baseModule/api/queries/calendar";
import { UserCalendar } from "@/lib/baseModule/components/calendar/UserCalendar";

export default function CalendarPage() {
  const { data: relevantCalendarsResponse } =
    useGetRelevantCalendarsForCurrentUser();

  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Kalender"} />}>
      <MainContentLayout fullViewportHeight>
        <UserCalendar calendarsResponse={relevantCalendarsResponse} />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
