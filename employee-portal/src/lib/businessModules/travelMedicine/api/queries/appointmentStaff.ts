/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { appointmentStaffApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllPhysicians() {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: appointmentStaffApiQueryKey(["getAllPhysicians"]),
    queryFn: () => userApi.getUsersByGroup("[System] RMBI-Arzt"),
    select: (response) => response.users ?? [],
  });
}

export function useGetAllMedicalAssistants() {
  const userApi = useUserApi();
  return useSuspenseQuery({
    queryKey: appointmentStaffApiQueryKey(["getAllMedicalAssistents"]),
    queryFn: () => userApi.getUsersByGroup("[System] RMBI-MFA"),
    select: (response) => response.users ?? [],
  });
}
