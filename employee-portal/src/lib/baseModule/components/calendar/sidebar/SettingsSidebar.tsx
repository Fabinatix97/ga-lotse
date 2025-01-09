/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { CalendarSelector } from "@/lib/baseModule/components/calendar/CalendarSelector";
import { CalendarInfo } from "@/lib/baseModule/components/calendar/calendarDisplay";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
