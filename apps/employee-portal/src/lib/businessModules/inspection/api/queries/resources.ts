/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiGetBlockingEventsOfResourcesResponse,
  ApiResourceType,
} from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal";

import {
  useCalendarEventApi,
  useResourceApi,
} from "@/lib/baseModule/api/clients";
import { resourceApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

/**
 * Find resources of the given time and return blocking event information for
 * the given time period.
 */
export function useGetResourcesWithEvents(props: {
  resourceType: ApiResourceType;
  start: Date;
  end: Date;
}) {
  const resourceApi = useResourceApi();
  const calendarEventApi = useCalendarEventApi();
  return useSuspenseQuery({
    queryKey: resourceApiQueryKey(["getResourcesWithEvents", props]),
    queryFn: async () => {
      // first get all resources for given resourceType
      const resources = await resourceApi
        .getResourcesRaw({ type: props.resourceType })
        .then(unwrapRawResponse)
        .then((response) => response.elements);

      // now determine which resources are free or blocked in [start - end]:
      if (resources.length > 0) {
        return (
          calendarEventApi
            .getBlockingEventsOfResourceCalendarsRaw({
              apiGetBlockingEventsOfResourcesRequest: {
                resourceIds: resources.map((resource) => resource.id),
                timeRangeStart: props.start,
                timeRangeEnd: props.end,
              },
            })
            .then(unwrapRawResponse)
            // return both resource and calendar response
            .then((calendarResponse) => ({ resources, calendarResponse }))
        );
      } else {
        return {
          resources,
          calendarResponse: {
            notFoundResourceIds: [],
            resourcesWithBlockingEvents: [],
          } satisfies ApiGetBlockingEventsOfResourcesResponse,
        };
      }
    },
  });
}
