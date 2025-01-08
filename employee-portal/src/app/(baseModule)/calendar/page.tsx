/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetRelevantCalendarsForCurrentUser } from "@/lib/baseModule/api/queries/calendar";
import { UserCalendar } from "@/lib/baseModule/components/calendar/UserCalendar";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

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
