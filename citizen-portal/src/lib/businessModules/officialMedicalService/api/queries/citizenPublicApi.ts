/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";
import {
  ApiAppointmentType,
  CitizenPublicApi,
} from "@eshg/official-medical-service-api";
import { QueryClient, queryOptions } from "@tanstack/react-query";

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

export function useGetLandingContent() {
  const citizenPublicApi = useCitizenPublicApi();

  return queryOptions({
    queryKey: citizenPublicApiQueryKey(["getLandingContent"]),
    queryFn: () => citizenPublicApi.getLandingContent(),
  });
}

export function validateFiles(
  citizenPublicApi: CitizenPublicApi,
  queryClient: QueryClient,
  files: Blob[],
) {
  return queryClient.fetchQuery({
    queryKey: citizenPublicApiQueryKey(["validateFiles", files]),
    queryFn: () => citizenPublicApi.validateFiles(files),
  });
}
