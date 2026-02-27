/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import {
  ApiAppointmentType,
  ApiInfectionBriefingAppointmentStandardDurations,
  InfectionBriefingAppointmentStandardDurationApi,
} from "@eshg/infection-briefing-api";
import { AppointmentStandardDurations } from "@eshg/lib-employee-portal";
import { durationToMinutes } from "@eshg/lib-portal";

import { appointmentStandardDurationApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentStandardDurationOptions(
  appointmentStandardDurationApi: InfectionBriefingAppointmentStandardDurationApi,
) {
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => appointmentStandardDurationApi.getStandardDurations(),
    select: mapStandardDurations,
  });
}

function mapStandardDurations(
  standardDurations: ApiInfectionBriefingAppointmentStandardDurations,
): AppointmentStandardDurations {
  return {
    standardDurations: {
      [ApiAppointmentType.InfectionBriefingNew]: durationToMinutes(
        standardDurations.infectionBriefingNew,
      ),
      [ApiAppointmentType.InfectionBriefingReplacement]: durationToMinutes(
        standardDurations.infectionBriefingReplacement,
      ),
    },
    extraDuration: 0,
  };
}
