/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConcern } from "@eshg/sti-protection-api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useCitizenPublicApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionPublicCitizenApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useDepartmentInfoQuery(concern: ApiConcern) {
  const publicCitizenApi = useCitizenPublicApi();
  return queryOptions({
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

export function useOpeningHoursQuery(concern: ApiConcern) {
  const publicCitizenApi = useCitizenPublicApi();
  return queryOptions({
    queryKey: stiProtectionPublicCitizenApiQueryKey(["openingHours", concern]),
    queryFn: () => publicCitizenApi.getOpeningHours(concern),
  });
}

export function useOpeningHours(concern: ApiConcern) {
  return useSuspenseQuery(useOpeningHoursQuery(concern));
}

export function useFreeAppointments({
  concern,
  earliestDate,
}: {
  concern: ApiConcern;
  earliestDate: Date;
}) {
  const publicCitizenApi = useCitizenPublicApi();
  return useSuspenseQuery({
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
