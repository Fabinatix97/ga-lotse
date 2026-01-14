/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useCalendarApi } from "@/lib/baseModule/api/clients";

import { calendarApiQueryKey } from "./apiQueryKey";

export function useGetRelevantCalendarsForCurrentUser() {
  const calendarApi = useCalendarApi();
  return useSuspenseQuery({
    queryKey: calendarApiQueryKey(["getRelevantCalendarsForCurrentUser"]),
    queryFn: () => calendarApi.getRelevantCalendarsForCurrentUser(),
  });
}
