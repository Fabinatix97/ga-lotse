/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { appointmentStaffApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetAllPhysiciansQuery() {
  const userApi = useUserApi();
  return queryOptions({
    queryKey: appointmentStaffApiQueryKey(["getAllPhysicians"]),
    queryFn: () => userApi.getUsersByGroup("[System] AÄD-Arzt"),
    select: (response) => response.users ?? [],
  });
}
