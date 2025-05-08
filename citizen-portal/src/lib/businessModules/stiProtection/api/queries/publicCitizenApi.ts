/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal/api/queryOptions";
import { ApiConcern } from "@eshg/sti-protection-api";

import { useCitizenPublicApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionPublicCitizenApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

function useDepartmentInfoQuery(concern: ApiConcern) {
  const publicCitizenApi = useCitizenPublicApi();
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: stiProtectionPublicCitizenApiQueryKey([
      "departmentInfo",
      concern,
    ]),
    queryFn: () => publicCitizenApi.getDepartmentInfo(concern),
  });
}

export function useDepartmentInfo(concern: ApiConcern) {
  return useSuspenseQuery(useDepartmentInfoQuery(concern));
}

interface GetFreeAppointmentsParams {
  concern: ApiConcern;
  earliestDate: Date;
}

function useFreeAppointmentsQuery({
  concern,
  earliestDate,
}: GetFreeAppointmentsParams) {
  const publicCitizenApi = useCitizenPublicApi();
  return queryOptions({
    queryKey: stiProtectionPublicCitizenApiQueryKey([
      "freeAppointments",
      { concern, earliestDate },
    ]),
    queryFn: () =>
      publicCitizenApi.getFreeAppointmentsForCitizen(concern, earliestDate),
    select(data) {
      return data.appointments;
    },
  });
}

export function useFreeAppointments(params: GetFreeAppointmentsParams) {
  return useSuspenseQuery(useFreeAppointmentsQuery(params));
}

function useOpeningHoursQuery(concern: ApiConcern) {
  const publicCitizenApi = useCitizenPublicApi();
  return queryOptions({
    queryKey: stiProtectionPublicCitizenApiQueryKey(["openingHours", concern]),
    queryFn: () => publicCitizenApi.getOpeningHours(concern),
  });
}

export function useOpeningHours(concern: ApiConcern) {
  return useSuspenseQuery(useOpeningHoursQuery(concern));
}
