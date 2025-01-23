/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDetailedEventWithoutCalendarId,
  GetEventsOfCalendarRequest,
  GetResourceRequest,
  GetResourcesRequest,
} from "@eshg/base-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { endOfToday, startOfToday } from "date-fns";

import {
  useCalendarApi,
  useCalendarEventApi,
  useLabelApi,
  useResourceApi,
} from "@/lib/baseModule/api/clients";
import { resourceApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetResourcesOverviewQuery(request: GetResourcesRequest) {
  const resourceApi = useResourceApi();
  const labelApi = useLabelApi();

  return useSuspenseQuery({
    queryKey: resourceApiQueryKey(["getResources", request]),
    queryFn: async () => {
      const labels = await labelApi.getLabels();
      const resources = await resourceApi
        .getResourcesRaw(request)
        .then((res) => res.value());
      return { labels, resources };
    },
  });
}

export function useGetResourceDetailsQuery(
  request: GetResourceRequest & Omit<GetEventsOfCalendarRequest, "calendarId">,
) {
  const resourceApi = useResourceApi();
  const labelApi = useLabelApi();
  const calendarApi = useCalendarApi();
  const calendarEventApi = useCalendarEventApi();

  return useSuspenseQuery({
    queryKey: resourceApiQueryKey(["getResource", request]),
    queryFn: async () => {
      const labels = await labelApi.getLabels();
      const resource = await resourceApi.getResource(request.id);
      const { calendarId } = await calendarApi.getResourceCalendar(request.id);

      let calendarEvents: ApiDetailedEventWithoutCalendarId[] = [];

      const { events } = await calendarEventApi
        .getEventsOfCalendarRaw({
          calendarId,
          timeRangeStart: request.timeRangeStart,
          timeRangeEnd: request.timeRangeEnd,
        })
        .then((res) => res.value());
      calendarEvents = events;

      const { events: eventsOfToday } = await calendarEventApi
        .getEventsOfCalendarRaw({
          calendarId,
          timeRangeStart: startOfToday(),
          timeRangeEnd: endOfToday(),
        })
        .then((res) => res.value());

      return {
        resource,
        labels,
        calendarId,
        calendarEvents,
        eventsOfToday,
      };
    },
  });
}
