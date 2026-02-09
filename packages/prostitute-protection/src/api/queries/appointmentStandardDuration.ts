/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { AppointmentStandardDurations } from "@eshg/lib-employee-portal";
import { durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiProstituteProtectionAppointmentStandardDurations,
  ProstituteProtectionAppointmentStandardDurationApi,
} from "@eshg/prostitute-protection-api";

import { appointmentStandardDurationApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentStandardDurationOptions(
  appointmentStandardDurationApi: ProstituteProtectionAppointmentStandardDurationApi,
) {
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => appointmentStandardDurationApi.getStandardDurations(),
    select: mapStandardDurations,
  });
}

function mapStandardDurations(
  standardDurations: ApiProstituteProtectionAppointmentStandardDurations,
): AppointmentStandardDurations {
  return {
    standardDurations: {
      [ApiAppointmentType.ProstituteProtectionConsultation]: durationToMinutes(
        standardDurations.consultation,
      ),
    },
    extraDuration: 0,
  };
}
