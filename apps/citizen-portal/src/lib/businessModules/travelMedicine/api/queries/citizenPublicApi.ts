/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SEMI_STATIC_QUERY_OPTIONS, durationToMinutes } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiTravelMedicineAppointmentStandardDurations,
} from "@eshg/travel-medicine-api";

import { useCitizenPublicApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/apiQueryKeys";

export function useGetAllDiseasesCitizen() {
  const citizenPublicApi = useCitizenPublicApi();
  return useSuspenseQuery({
    queryKey: citizenPublicApiQueryKey(["getPublicDiseases"]),
    queryFn: () => citizenPublicApi.getPublicDiseases(),
  });
}

export function useGetAppointmentStandardDurations() {
  const citizenPublicApi = useCitizenPublicApi();
  return useSuspenseQuery({
    queryKey: citizenPublicApiQueryKey([
      "getAppointmentStandardDurationsForCitizen",
    ]),
    queryFn: () => citizenPublicApi.getAppointmentStandardDurationsForCitizen(),
    select: mapAppointmentDurationConfig,
    refetchOnWindowFocus: false,
  });
}

function mapAppointmentDurationConfig(
  response: ApiTravelMedicineAppointmentStandardDurations,
): Partial<Record<ApiAppointmentType, number>> {
  return {
    [ApiAppointmentType.Consultation]: durationToMinutes(response.consultation),
    [ApiAppointmentType.Vaccination]: durationToMinutes(response.vaccination),
  };
}
export function useGetFreeAppointmentsForCitizen(
  appointmentType: ApiAppointmentType,
  earliestDate?: Date,
) {
  const citizenPublicApi = useCitizenPublicApi();

  return useSuspenseQuery({
    queryKey: citizenPublicApiQueryKey([
      "getFreeAppointmentsForCitizen",
      appointmentType,
      earliestDate,
    ]),
    queryFn: () =>
      citizenPublicApi.getFreeAppointmentsForCitizen(
        appointmentType,
        earliestDate,
      ),
    refetchOnWindowFocus: false,
  });
}

export function useGetDepartmentInfo() {
  const departmentApi = useCitizenPublicApi();
  return useSuspenseQuery({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: citizenPublicApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => departmentApi.getDepartmentInfo(),
  });
}

export function useGetDepartmentInfoQuery() {
  const departmentApi = useCitizenPublicApi();
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: citizenPublicApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => departmentApi.getDepartmentInfo(),
  });
}

export function useGetOpeningHoursQuery() {
  const departmentApi = useCitizenPublicApi();
  return queryOptions({
    queryKey: citizenPublicApiQueryKey(["getOpeningHours"]),
    queryFn: () => departmentApi.getOpeningHours(),
  });
}
