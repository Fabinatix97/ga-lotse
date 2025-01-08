/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseEventRequest,
  DeleteBaseEventRequest,
} from "@eshg/employee-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { isDefined } from "remeda";

import { useCalendarEventApi } from "@/lib/baseModule/api/clients";

export function useDeleteCalendarEvent() {
  const calendarEventApi = useCalendarEventApi();

  return useHandledMutation({
    mutationFn: async ({ eventId }: DeleteBaseEventRequest) => {
      await calendarEventApi.deleteBaseEvent(eventId);
    },
  });
}

export function useSubmitCalendarEvent() {
  const calendarEventApi = useCalendarEventApi();

  return useHandledMutation({
    mutationFn: async ({
      eventId,
      request,
    }: {
      eventId?: string;
      request: ApiBaseEventRequest;
    }) => {
      if (isDefined(eventId)) {
        await calendarEventApi.updateBaseEventRaw({
          eventId,
          apiBaseEventRequest: request,
        });
      } else {
        await calendarEventApi.addBaseEvent(request);
      }
    },
  });
}
