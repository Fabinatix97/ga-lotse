/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiSchoolEntryAppointmentStandardDurations,
  SchoolEntryAppointmentStandardDurationApi,
} from "@eshg/school-entry-api";

import { appointmentStandardDurationApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useGetAppointmentStandardDurationsQuery(
  standardDurationApi: SchoolEntryAppointmentStandardDurationApi,
) {
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => standardDurationApi.getStandardDurations(),
    select: mapStandardDurations,
  });
}

function mapStandardDurations(
  standardDurations: ApiSchoolEntryAppointmentStandardDurations,
) {
  return {
    [ApiAppointmentType.CanChild]: durationToMinutes(
      standardDurations.canChild,
    ),
    [ApiAppointmentType.RegularExamination]: durationToMinutes(
      standardDurations.regularExamination,
    ),
    [ApiAppointmentType.EntryLevel]: durationToMinutes(
      standardDurations.entryLevel,
    ),
    [ApiAppointmentType.SpecialNeeds]: durationToMinutes(
      standardDurations.specialNeeds,
    ),
  };
}
