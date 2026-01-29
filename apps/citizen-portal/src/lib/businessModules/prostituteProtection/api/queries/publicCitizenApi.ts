/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { SEMI_STATIC_QUERY_OPTIONS } from "@eshg/lib-portal";
import { ProstituteProtectionPublicCitizenApi } from "@eshg/prostitute-protection-api";

import { useProstituteProtectionCitizenPublicApi } from "@/lib/businessModules/prostituteProtection/api/clients";
import { prostituteProtectionPublicCitizenApiQueryKey } from "@/lib/businessModules/prostituteProtection/api/queries/apiQueryKeys";
import { useLang } from "@/lib/i18n/useLang";

export function useGetLandingPageContentQuery(
  publicCitizenApi: ProstituteProtectionPublicCitizenApi,
) {
  const lang = useLang();

  return queryOptions({
    queryKey: prostituteProtectionPublicCitizenApiQueryKey([
      "getLandingPageContent",
      lang,
    ]),
    queryFn: () => publicCitizenApi.getLandingPageContent(),
  });
}

export function useGetPublicConfigurationQuery(
  publicCitizenApi: ProstituteProtectionPublicCitizenApi,
) {
  return queryOptions({
    queryKey: prostituteProtectionPublicCitizenApiQueryKey([
      "getPublicConfiguration",
    ]),
    queryFn: () => publicCitizenApi.getPublicConfiguration(),
  });
}

export function getOpeningHoursQuery(
  publicCitizenApi: ProstituteProtectionPublicCitizenApi,
) {
  return queryOptions({
    queryKey: prostituteProtectionPublicCitizenApiQueryKey(["getOpeningHours"]),
    queryFn: () => publicCitizenApi.getOpeningHours(),
  });
}

function getFreeAppointmentsQuery(
  publicCitizenApi: ProstituteProtectionPublicCitizenApi,
) {
  return queryOptions({
    queryKey: prostituteProtectionPublicCitizenApiQueryKey([
      "getFreeAppointments",
    ]),
    queryFn: () => publicCitizenApi.getFreeAppointmentsForCitizen(),
  });
}

export function useFreeAppointments() {
  const publicCitizenApi = useProstituteProtectionCitizenPublicApi();
  return useSuspenseQuery(getFreeAppointmentsQuery(publicCitizenApi));
}

export function getDepartmentInfoQuery(
  publicCitizenApi: ProstituteProtectionPublicCitizenApi,
) {
  return queryOptions({
    ...SEMI_STATIC_QUERY_OPTIONS,
    queryKey: prostituteProtectionPublicCitizenApiQueryKey([
      "getDepartmentInfo",
    ]),
    queryFn: () => publicCitizenApi.getDepartmentInfo(),
  });
}

export function useDepartmentInfo() {
  const publicCitizenApi = useProstituteProtectionCitizenPublicApi();
  return useSuspenseQuery(getDepartmentInfoQuery(publicCitizenApi));
}
