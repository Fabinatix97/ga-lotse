/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

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
