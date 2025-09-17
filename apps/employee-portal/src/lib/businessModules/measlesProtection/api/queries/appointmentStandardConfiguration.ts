/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiMeaslesProtectionAppointmentStandardDurations,
} from "@eshg/measles-protection-api";

import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { appointmentStandardDurationApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function useGetAppointmentStandardDurationQuery() {
  const appointmentStandardDurationsApi = useAppointmentStandardDurationsApi();
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => appointmentStandardDurationsApi.getStandardDurations(),
    select: mapStandardDurations,
  });
}

function mapStandardDurations(
  standardDurations: ApiMeaslesProtectionAppointmentStandardDurations,
): Partial<Record<ApiAppointmentType, number>> {
  return {
    [ApiAppointmentType.ProofSubmission]: durationToMinutes(
      standardDurations.proofSubmission,
    ),
  };
}
