/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiProstituteProtectionAppointmentStandardDurations,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { appointmentStandardDurationApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentStandardDurationOptions() {
  const { appointmentStandardDurationApi } =
    useProstituteProtectionApiClients();
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => appointmentStandardDurationApi.getStandardDurations(),
    select: mapStandardDurations,
  });
}

function mapStandardDurations(
  standardDurations: ApiProstituteProtectionAppointmentStandardDurations,
) {
  return {
    [ApiAppointmentType.ProstituteProtectionConsultation]: durationToMinutes(
      standardDurations.consultation,
    ),
  };
}

export function useGetAppointmentStandardDuration() {
  const options = useGetAppointmentStandardDurationOptions();
  return useSuspenseQuery(options);
}
