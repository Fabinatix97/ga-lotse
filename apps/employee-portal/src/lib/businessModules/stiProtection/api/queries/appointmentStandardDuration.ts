/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiHivStiConsultationAppointmentStandardDurations,
  ApiSexWorkAppointmentStandardDurations,
  StiProtectionAppointmentStandardDurationApi,
} from "@eshg/sti-protection-api";

import { appointmentStandardDurationApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useGetHivAppointmentStandardDurationsQuery(
  standardDurationApi: StiProtectionAppointmentStandardDurationApi,
) {
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey([
      "getHivStiConsultationAppointmentStandardDurations",
    ]),
    queryFn: () =>
      standardDurationApi.getHivStiConsultationAppointmentStandardDurations(),
    select: mapHivStandardDurations,
  });
}

export function useGetSexWorkAppointmentStandardDurationsQuery(
  standardDurationApi: StiProtectionAppointmentStandardDurationApi,
) {
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey([
      "getSexWorkAppointmentStandardDurations",
    ]),
    queryFn: () => standardDurationApi.getSexWorkAppointmentStandardDurations(),
    select: mapSexWorkStandardDurations,
  });
}

function mapHivStandardDurations(
  standardDurations: ApiHivStiConsultationAppointmentStandardDurations,
): Partial<Record<ApiAppointmentType, number>> {
  return {
    [ApiAppointmentType.HivStiConsultation]: durationToMinutes(
      standardDurations.consultation,
    ),
    [ApiAppointmentType.ResultsReview]: durationToMinutes(
      standardDurations.resultsReview,
    ),
  };
}

function mapSexWorkStandardDurations(
  standardDurations: ApiSexWorkAppointmentStandardDurations,
): Partial<Record<ApiAppointmentType, number>> {
  return {
    [ApiAppointmentType.ResultsReview]: durationToMinutes(
      standardDurations.resultReview,
    ),
    [ApiAppointmentType.SexWork]: durationToMinutes(
      standardDurations.consultation,
    ),
  };
}
