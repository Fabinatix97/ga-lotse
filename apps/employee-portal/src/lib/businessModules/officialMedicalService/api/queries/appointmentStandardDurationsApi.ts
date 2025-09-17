/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiOmsAppointmentStandardDurations,
} from "@eshg/official-medical-service-api";

import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { appointmentStandardDurationApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetAppointmentStandardDurationQuery() {
  const appointmentTypesApi = useAppointmentStandardDurationsApi();
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => appointmentTypesApi.getStandardDurations(),
    select: mapStandardDurations,
  });
}

function mapStandardDurations(
  standardDurations: ApiOmsAppointmentStandardDurations,
) {
  return {
    [ApiAppointmentType.OfficialMedicalServiceShort]: durationToMinutes(
      standardDurations.officialMedicalServiceShort,
    ),
    [ApiAppointmentType.OfficialMedicalServiceLong]: durationToMinutes(
      standardDurations.officialMedicalServiceLong,
    ),
  };
}
