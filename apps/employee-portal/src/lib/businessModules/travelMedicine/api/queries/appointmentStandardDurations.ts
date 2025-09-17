/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiTravelMedicineAppointmentStandardDurations,
  TravelMedicineAppointmentStandardDurationApi,
} from "@eshg/travel-medicine-api";

import { appointmentStandardDurationApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAppointmentStandardDurationsQuery(
  standardDurationApi: TravelMedicineAppointmentStandardDurationApi,
) {
  return queryOptions({
    queryKey: appointmentStandardDurationApiQueryKey(["getStandardDurations"]),
    queryFn: () => standardDurationApi.getStandardDurations(),
    select: mapStandardDurations,
  });
}

function mapStandardDurations(
  standardDurations: ApiTravelMedicineAppointmentStandardDurations,
) {
  return {
    [ApiAppointmentType.Consultation]: durationToMinutes(
      standardDurations.consultation,
    ),
    [ApiAppointmentType.Vaccination]: durationToMinutes(
      standardDurations.vaccination,
    ),
  };
}
