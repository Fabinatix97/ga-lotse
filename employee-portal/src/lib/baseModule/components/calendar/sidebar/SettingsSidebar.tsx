/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Dispatch, SetStateAction } from "react";

import { CalendarSelector } from "@/lib/baseModule/components/calendar/CalendarSelector";
import { CalendarInfo } from "@/lib/baseModule/components/calendar/calendarDisplay";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function SettingsSidebar({
  open,
  closeSidebar,
  calendars,
  displayedCalendarIds,
  setDisplayedCalendarIds,
}: {
  open: boolean;
  closeSidebar: () => void;
  calendars: CalendarInfo[];
  displayedCalendarIds: string[];
  setDisplayedCalendarIds: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <Sidebar open={open} onClose={closeSidebar}>
      {open && (
        <SidebarContent title={"Kalender Einstellungen"}>
          <CalendarSelector
            calendars={calendars}
            displayedCalendarIds={displayedCalendarIds}
            setDisplayedCalendarIds={setDisplayedCalendarIds}
          />
        </SidebarContent>
      )}
    </Sidebar>
  );
}
