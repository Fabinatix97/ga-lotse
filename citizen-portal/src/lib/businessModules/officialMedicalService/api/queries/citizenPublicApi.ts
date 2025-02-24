/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/official-medical-service-api";
import { queryOptions } from "@tanstack/react-query";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";
import { mapToConcernApiList } from "@/lib/businessModules/officialMedicalService/shared/helpers";

export function useGetAllAppointmentTypesQuery() {
  const citizenPublicApi = useCitizenPublicApi();
  return queryOptions({
    queryKey: citizenPublicApiQueryKey(["getAppointmentTypesForCitizen"]),
    queryFn: () => citizenPublicApi.getAppointmentTypesForCitizen(),
    select: (response) => response.appointmentTypeConfigDtos ?? [],
    refetchOnWindowFocus: false,
  });
}

export function useGetDepartmentInfoQuery() {
  const departmentApi = useCitizenPublicApi();
  return queryOptions({
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

export function useGetFreeAppointmentsForCitizen(
  appointmentType: ApiAppointmentType,
) {
  const citizenPublicApi = useCitizenPublicApi();

  return queryOptions({
    queryKey: citizenPublicApiQueryKey([
      "getFreeAppointmentsForCitizen",
      appointmentType,
    ]),
    queryFn: () =>
      citizenPublicApi.getFreeAppointmentsForCitizen(appointmentType),
  });
}

export function useGetConcerns() {
  const citizenPublicApi = useCitizenPublicApi();

  return queryOptions({
    queryKey: citizenPublicApiQueryKey(["getVisibleConcerns"]),
    queryFn: () => citizenPublicApi.getVisibleConcerns(),
    select: (data) =>
      data.categories.flatMap((category) => mapToConcernApiList(category)),
  });
}
