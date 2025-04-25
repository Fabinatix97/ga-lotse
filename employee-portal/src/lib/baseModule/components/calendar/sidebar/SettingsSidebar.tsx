/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Dispatch, SetStateAction, useState } from "react";

import {
  DrawerProps,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { CalendarSelector } from "@/lib/baseModule/components/calendar/CalendarSelector";
import { CalendarInfo } from "@/lib/baseModule/components/calendar/calendarDisplay";

export function useSettingsSidebar(): UseSidebarResult<SettingsSidebarProps> {
  return useSidebar({
    component: SettingsSidebar,
  });
}

interface SettingsSidebarProps extends DrawerProps {
  calendars: CalendarInfo[];
  initialDisplayedCalenderIds: string[];
  onDisplayedCalendarIdsChanged: Dispatch<SetStateAction<string[]>>;
}

export function SettingsSidebar({
  calendars,
  initialDisplayedCalenderIds,
  onDisplayedCalendarIdsChanged,
}: SettingsSidebarProps) {
  const [displayedCalendarIds, setDisplayedCalendarIds] = useState<string[]>(
    initialDisplayedCalenderIds,
  );

  function handleChange(ids: SetStateAction<string[]>) {
    setDisplayedCalendarIds(ids);
    onDisplayedCalendarIdsChanged(ids);
  }

  return (
    <SidebarContent title={"Kalender Einstellungen"}>
      <CalendarSelector
        calendars={calendars}
        displayedCalendarIds={displayedCalendarIds}
        setDisplayedCalendarIds={handleChange}
      />
    </SidebarContent>
  );
}
