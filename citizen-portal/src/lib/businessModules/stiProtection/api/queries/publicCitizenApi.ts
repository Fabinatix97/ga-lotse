/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
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

interface GetFreeAppointmentsParams {
  concern: ApiConcern;
  earliestDate: Date;
}

export function useFreeAppointmentsQuery({
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

export function useAnonymousIdentificationDocumentQuery(procedureId: string) {
  const publicCitizenApi = useCitizenPublicApi();
  return useFileDownload(() =>
    publicCitizenApi.getCitizenAnonymousIdentificationDocumentRaw({
      id: procedureId,
    }),
  );
}
